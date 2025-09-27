import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing our locations array in AsyncStorage
const STORAGE_KEY = '@saved_locations';
// How close (in meters) a new photo needs to be to an old one to be considered a "match"
const MATCHING_DISTANCE_METERS = 5;

// --- FIX 1: Define the shape of our location data ---
interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
}

export default function PhotoLocationTracker() {
  // --- FIX 2: Apply the type to the state ---
  const [storedLocations, setStoredLocations] = useState<LocationData[]>([]);

  // Load locations from storage when the app starts
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        setStoredLocations(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load locations from storage.');
    }
  };

  /**
   * Calculates the distance between two GPS coordinates in meters using the Haversine formula.
   * This is crucial for detecting small changes in location.
   */
  // --- FIX 3: Add types to the function parameters ---
  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };


  const takePhotoAndGetLocation = async () => {
    // 1. Request Camera Permission
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    // 2. Launch Camera
    const photoResult = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });
    if (photoResult.canceled) return;

    // 3. Request High-Accuracy Location Permission
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    if (locationPermission.status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }

    // 4. Get High-Accuracy Location
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const { latitude, longitude } = currentLocation.coords;

      // 5. Check for a matching location
      let isMatchFound = false;
      for (const loc of storedLocations) {
        const distance = getDistanceInMeters(latitude, longitude, loc.latitude, loc.longitude);
        if (distance < MATCHING_DISTANCE_METERS) {
          isMatchFound = true;
          break;
        }
      }
      
      if (isMatchFound) {
        Alert.alert('Location Matched!', `You are within ${MATCHING_DISTANCE_METERS} meters of a previously saved spot.`);
      } else {
        // 6. If no match, save the new location
        const newLocation: LocationData = {
          id: Date.now().toString(), // Unique ID for the list
          latitude,
          longitude,
        };
        const updatedLocations = [...storedLocations, newLocation];
        setStoredLocations(updatedLocations);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
        Alert.alert('New Location Saved', 'This spot has been added to your list.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch location. Please ensure GPS is enabled and you have a clear sky view.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>High-Precision Tagger 📍</Text>
      <Button
        title="Take Photo & Check Location"
        onPress={takePhotoAndGetLocation}
        color="#007AFF"
      />
      
      <Text style={styles.listHeader}>Saved Locations:</Text>
      <FlatList
        data={storedLocations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.locationItem}>
            <Text>Lat: {item.latitude.toFixed(6)}</Text>
            <Text>Lon: {item.longitude.toFixed(6)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No locations saved yet.</Text>}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  list: {
    width: '100%',
  },
  locationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
