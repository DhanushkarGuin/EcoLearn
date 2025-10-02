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
import {router} from 'expo-router';

// Page-flow
const handleBackButton = () =>{
  router.push('/StudentPage')
}

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
  const [capturedPhoto, setCapturedPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
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
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const photoAsset = result.assets[0];
      
      const matchingPlant = savedPlants.find(plant => 
          getDistanceInMeters(location.coords.latitude, location.coords.longitude, plant.location.latitude, plant.location.longitude) < MATCHING_RADIUS_METERS
      );

      if (matchingPlant) {
        const newCheckIn: CheckIn = { timestamp: new Date().toISOString(), photoUri: photoAsset.uri, points: POINTS_CHECK_IN };
        const updatedPlants = savedPlants.map(p => p.id === matchingPlant.id ? { ...p, checkIns: [...p.checkIns, newCheckIn] } : p);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
        setSavedPlants(updatedPlants);
        Alert.alert('Check-in Success!', `You earned ${POINTS_CHECK_IN} points for visiting "${matchingPlant.nickname}".`);
      } else {
        const isFarFromAllPlants = savedPlants.every(plant => getDistanceInMeters(location.coords.latitude, location.coords.longitude, plant.location.latitude, plant.location.longitude) >= MATCHING_RADIUS_METERS);
        if (isFarFromAllPlants || savedPlants.length === 0) {
            setCapturedPhoto(photoAsset);
            setCurrentLocation(location);
            setScreenState('details');
        } else {
            Alert.alert('Too Far', 'You are not close enough to any of your registered plants to check in. Try moving closer or find a new spot to plant!');
        }
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
          id: Date.now().toString(), plantName, nickname: plantNickname, initialPhotoUri: capturedPhoto.uri,
          location: { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
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
  
  // --- NEW DELETE FUNCTION ---
  const handleDeletePlant = async (plantId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to permanently delete this plant and all its history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedPlants = savedPlants.filter(p => p.id !== plantId);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
              setSavedPlants(updatedPlants);
              setSelectedPlant(null); // Close the modal
              Alert.alert("Deleted!", "The plant has been removed.");
            } catch (error) {
              Alert.alert("Error", "Could not delete the plant data.");
            }
          },
        },
      ]
    );
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
        <View style={styles.header}>
            <Image source={require('../assets/images/logo-2.png')} style={styles.logo} />
            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={toggleTheme}>
                    <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButtonCircle} onPress={()=> router.back()}>
                    <Feather name="chevron-left" size={24} color={headerIconColor} />
                </TouchableOpacity>
            </View>
        </View>

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
                                <Text style={styles.pointsValue}>{POINTS_NEW_PLANT + item.checkIns.reduce((sum, checkIn) => sum + checkIn.points, 0)}</Text>
                                <Text style={styles.pointsLabel}>Total Points</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No plants registered yet. Tap the camera to start!</Text>}
                />
                <TouchableOpacity style={styles.fab} onPress={handleTakePhoto} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff"/> : <FontAwesome5 name="camera" size={24} color="#fff" />}
                </TouchableOpacity>
            </>
        )}
        
        {screenState === 'details' && (
            <ScrollView contentContainerStyle={styles.detailsContentContainer}>
                {capturedPhoto && <Image source={{ uri: capturedPhoto.uri }} style={styles.photoPreview} />}
                <Text style={styles.detailsTitle}>Register New Plant</Text>
                <View style={styles.inputGroup}><Text style={styles.label}>Plant Name:</Text><TextInput style={styles.input} value={plantName} onChangeText={setPlantName} placeholder="e.g., Sunflower" placeholderTextColor="#888" /></View>
                <View style={styles.inputGroup}><Text style={styles.label}>Nickname:</Text><TextInput style={styles.input} value={plantNickname} onChangeText={setPlantNickname} placeholder="e.g., Sunny" placeholderTextColor="#888" /></View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitNewPlant} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#333" /> : <Text style={styles.submitButtonText}>Submit</Text>}
                </TouchableOpacity>
            </ScrollView>
        )}

        {selectedPlant && (
            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedPlant !== null}
                onRequestClose={() => setSelectedPlant(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedPlant.nickname}</Text>
                        <Text style={styles.modalSubtitle}>{selectedPlant.plantName}</Text>
                        <FlatList
                            data={[ {uri: selectedPlant.initialPhotoUri, points: POINTS_NEW_PLANT, time: 'Initial Photo'}, ...selectedPlant.checkIns.map(c => ({uri: c.photoUri, points: c.points, time: new Date(c.timestamp).toLocaleDateString()}))]}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => (
                                <View style={styles.historyImageContainer}>
                                    <Image source={{uri: item.uri}} style={styles.historyImage} />
                                    <Text style={styles.historyPoints}>+{item.points} pts</Text>
                                    <Text style={styles.historyTime}>{item.time}</Text>
                                </View>
                            )}
                        />
                        {/* --- NEW BUTTON CONTAINER --- */}
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePlant(selectedPlant.id)}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPlant(null)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )}

      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  logo: {
  height: 100, // You can adjust the height as needed
  width: 100, 
  backgroundColor: 'none',
  resizeMode: 'contain', // Ensures the logo scales correctly without distortion
  marginTop: 5, // Adds space from the top of the screen
  marginLeft: -10, // Aligns it nicely with the buttons
},
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backButtonCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular', paddingHorizontal: 20, marginBottom: 10 },
  plantCard: { flexDirection: 'row', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 15, padding: 10, marginHorizontal: 20, marginBottom: 15, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  plantCardImage: { width: 60, height: 60, borderRadius: 10 },
  plantCardInfo: { flex: 1, marginLeft: 15 },
  plantCardNickname: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 18, fontFamily: 'Poppins-Regular' },
  plantCardName: { color: '#AEB6BF', fontSize: 14, fontFamily: 'Poppins-Regular' },
  plantCardPoints: { alignItems: 'center' },
  pointsValue: { color: '#FBBF24', fontSize: 20, fontFamily: 'Poppins-Regular' },
  pointsLabel: { color: '#AEB6BF', fontSize: 12, fontFamily: 'Poppins-Regular' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FBBF24', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowRadius: 5, shadowOpacity: 0.3 },
  detailsContentContainer: { alignItems: 'center', padding: 20 },
  detailsTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 24, fontFamily: 'Poppins-Regular', marginBottom: 20 },
  photoPreview: { width: 200, height: 200, borderRadius: 15, marginBottom: 20, borderWidth: 3, borderColor: '#FCD34D' },
  inputGroup: { width: '100%', marginBottom: 15 },
  label: { color: theme === 'dark' ? '#EAEAEA' : '#333333', fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 8 },
  input: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 15, padding: 15, fontSize: 16, fontFamily: 'Poppins-Regular', borderWidth: 1, borderColor: theme === 'dark' ? '#2E2E2E' : '#E0E0E0' },
  submitButton: { backgroundColor: '#FCD34D', borderRadius: 15, paddingVertical: 15, paddingHorizontal: 40, alignItems: 'center', minWidth: 200 },
  submitButtonText: { color: '#333333', fontSize: 18, fontFamily: 'Poppins-Regular' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '50%' },
  modalTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 24, fontFamily: 'Poppins-Regular', marginBottom: 5 },
  modalSubtitle: { color: '#AEB6BF', fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 20 },
  historyImageContainer: { marginRight: 15, alignItems: 'center' },
  historyImage: { width: 150, height: 150, borderRadius: 10 },
  historyPoints: { color: '#FBBF24', fontFamily: 'Poppins-Regular', marginTop: 5 },
  historyTime: { color: '#AEB6BF', fontSize: 12, fontFamily: 'Poppins-Regular'},
  // --- NEW STYLES FOR MODAL BUTTONS ---
  modalButtonsContainer: {
    flexDirection: 'row',
    marginTop: 'auto', // Pushes buttons to the bottom
    gap: 10,
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#FBBF24',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#CF4647', // Red color for delete
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default PlantographScreen;