import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

// --- Configuration ---
const STORAGE_KEY = '@saved_plants_history_v2';
const MATCHING_RADIUS_METERS = 3;
const POINTS_NEW_PLANT = 25;
const POINTS_CHECK_IN = 10;

// --- Type Definitions ---
interface CheckIn {
  timestamp: string;
  photoUri: string;
  points: number;
}

interface Plant {
  id: string;
  nickname: string;
  plantName: string;
  initialPhotoUri: string;
  location: { latitude: number; longitude: number };
  checkIns: CheckIn[];
}

const PlantographScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [screenState, setScreenState] = useState<'history' | 'details'>('history');
  const [isLoading, setIsLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<any | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [savedPlants, setSavedPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // Form state
  const [plantName, setPlantName] = useState('');
  const [plantNickname, setPlantNickname] = useState('');

  useEffect(() => { loadPlants(); }, []);

  const loadPlants = async () => {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue) setSavedPlants(JSON.parse(jsonValue));
  };

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const toRad = (val: number) => (val * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // --- Prediction Function (Send to ML Model) ---
  const checkIfPlant = async (uri: string): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const res = await axios.post("http://192.168.0.101:8000/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.prediction === "plant"; // expects "plant" or "not_plant" in backend response
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not connect to prediction server.");
      return false;
    }
  };

  const handleTakePhoto = async () => {
    setIsLoading(true);
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    if (cameraPermission.status !== 'granted' || locationPermission.status !== 'granted') {
      Alert.alert('Permissions Required', 'Camera and Location access are needed.');
      setIsLoading(false);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (result.canceled) {
      setIsLoading(false);
      return;
    }

    const photoAsset = result.assets[0];

    // --- ML Prediction Check ---
    const isPlant = await checkIfPlant(photoAsset.uri);
    if (!isPlant) {
      Alert.alert("Not a Plant", "The photo is not recognized as a plant. Please try again.");
      setIsLoading(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      const matchingPlant = savedPlants.find(plant =>
        getDistanceInMeters(location.coords.latitude, location.coords.longitude,
          plant.location.latitude, plant.location.longitude) < MATCHING_RADIUS_METERS
      );

      if (matchingPlant) {
        const newCheckIn: CheckIn = {
          timestamp: new Date().toISOString(),
          photoUri: photoAsset.uri,
          points: POINTS_CHECK_IN
        };
        const updatedPlants = savedPlants.map(p =>
          p.id === matchingPlant.id ? { ...p, checkIns: [...p.checkIns, newCheckIn] } : p
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
        setSavedPlants(updatedPlants);
        Alert.alert('Check-in Success!', `You earned ${POINTS_CHECK_IN} points for visiting "${matchingPlant.nickname}".`);
      } else {
        setCapturedPhoto(photoAsset);
        setCurrentLocation(location);
        setScreenState('details');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get your location. Please ensure GPS is enabled.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPlant = async () => {
    if (!plantName || !plantNickname || !currentLocation || !capturedPhoto) {
      Alert.alert('Incomplete Form', 'Please fill out all fields.');
      return;
    }

    const newPlant: Plant = {
      id: Date.now().toString(),
      plantName,
      nickname: plantNickname,
      initialPhotoUri: capturedPhoto.uri,
      location: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      },
      checkIns: [],
    };

    try {
      const updatedPlants = [...savedPlants, newPlant];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
      setSavedPlants(updatedPlants);
      Alert.alert('New Plant Registered!', `You earned ${POINTS_NEW_PLANT} points for planting "${plantNickname}"!`);
      resetAndGoToHistory();
    } catch (error) {
      Alert.alert('Save Error', 'Could not save the new plant data.');
    }
  };

  const resetAndGoToHistory = () => {
    setCapturedPhoto(null);
    setCurrentLocation(null);
    setPlantName('');
    setPlantNickname('');
    setScreenState('history');
    setIsLoading(false);
  };

  const styles = getStyles(theme);
  const headerIconColor = theme === 'dark' ? '#FFFFFF' : '#121212';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={{ fontSize: 22, color: headerIconColor }}>🌱 Plantograph</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleTheme}>
              <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* HISTORY */}
        {screenState === 'history' && (
          <>
            <Text style={styles.pageTitle}>My Plantographs</Text>
            <FlatList
              data={savedPlants}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.plantCard} onPress={() => setSelectedPlant(item)}>
                  <Image source={{ uri: item.initialPhotoUri }} style={styles.plantCardImage} />
                  <View style={styles.plantCardInfo}>
                    <Text style={styles.plantCardNickname}>{item.nickname}</Text>
                    <Text style={styles.plantCardName}>{item.plantName}</Text>
                  </View>
                  <View style={styles.plantCardPoints}>
                    <Text style={styles.pointsValue}>
                      {POINTS_NEW_PLANT + item.checkIns.reduce((sum, c) => sum + c.points, 0)}
                    </Text>
                    <Text style={styles.pointsLabel}>Total Points</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No plants registered yet. Tap the camera to start!</Text>}
            />
            <TouchableOpacity style={styles.fab} onPress={handleTakePhoto} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <FontAwesome5 name="camera" size={24} color="#fff" />}
            </TouchableOpacity>
          </>
        )}

        {/* DETAILS */}
        {screenState === 'details' && (
          <ScrollView contentContainerStyle={styles.detailsContentContainer}>
            {capturedPhoto && <Image source={{ uri: capturedPhoto.uri }} style={styles.photoPreview} />}
            <Text style={styles.detailsTitle}>Register New Plant</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student Name:</Text>
              <TextInput style={styles.input} value={plantName} onChangeText={setPlantName} placeholder="" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nickname:</Text>
              <TextInput style={styles.input} value={plantNickname} onChangeText={setPlantNickname} placeholder="e.g., Sunny" />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={()=> router.back()} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#333" /> : <Text style={styles.submitButtonText}>Submit</Text>}
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  headerIcons: { flexDirection: 'row', gap: 15 },
  pageTitle: { fontSize: 24, margin: 15, color: theme === 'dark' ? '#fff' : '#121212' },
  plantCard: { flexDirection: 'row', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', borderRadius: 15, padding: 10, margin: 10 },
  plantCardImage: { width: 60, height: 60, borderRadius: 10 },
  plantCardInfo: { flex: 1, marginLeft: 10 },
  plantCardNickname: { fontSize: 18, color: theme === 'dark' ? '#fff' : '#121212' },
  plantCardName: { fontSize: 14, color: '#888' },
  plantCardPoints: { alignItems: 'center' },
  pointsValue: { color: '#FBBF24', fontSize: 18 },
  pointsLabel: { fontSize: 12, color: '#888' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#FBBF24', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  detailsContentContainer: { alignItems: 'center', padding: 20 },
  detailsTitle: { fontSize: 22, marginBottom: 20, color: theme === 'dark' ? '#fff' : '#121212' },
  photoPreview: { width: 200, height: 200, borderRadius: 10, marginBottom: 15 },
  inputGroup: { width: '100%', marginBottom: 15 },
  label: { marginBottom: 5, color: theme === 'dark' ? '#fff' : '#121212' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, color: theme === 'dark' ? '#fff' : '#121212' },
  submitButton: { backgroundColor: '#FBBF24', borderRadius: 15, padding: 15, marginTop: 10 },
  submitButtonText: { fontSize: 18, textAlign: 'center', color: '#333' },
});

export default PlantographScreen;
