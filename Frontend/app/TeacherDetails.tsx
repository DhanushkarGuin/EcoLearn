import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, ScrollView, Alert, StatusBar } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import BottomTabBar from '../components/BottomTabBar';

const TEACHER_PROFILE_KEY = '@teacher_profile';

// --- UPDATED: Added photoUri to the interface ---
interface TeacherProfile {
  name: string;
  subject: string;
  contactEmail: string;
  photoUri: string | null;
}

const TeacherDetailsScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [profile, setProfile] = useState<Partial<TeacherProfile>>({});
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const jsonValue = await AsyncStorage.getItem(TEACHER_PROFILE_KEY);
    if (jsonValue) {
        const savedProfile: TeacherProfile = JSON.parse(jsonValue);
        setProfile(savedProfile);
        setImageUri(savedProfile.photoUri);
    }
  };

  const handleInputChange = (field: keyof Omit<TeacherProfile, 'photoUri'>, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  // --- NEW: Function to pick an image ---
  const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
      });

      if (!result.canceled) {
          setImageUri(result.assets[0].uri);
      }
  };

  const handleSave = async () => {
    const profileToSave: TeacherProfile = {
        name: profile.name || '',
        subject: profile.subject || '',
        contactEmail: profile.contactEmail || '',
        photoUri: imageUri,
    };
    await AsyncStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(profileToSave));
    Alert.alert('Success', 'Your details have been saved.');
  };

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const styles = getStyles(theme);
  const headerIconColor = theme === 'dark' ? '#FFFFFF' : '#121212';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.container}>
        <View style={styles.header}>
            <Image source={require('../assets/images/logo-2.png')} style={styles.logo} />
            <TouchableOpacity onPress={toggleTheme}>
                <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.pageTitle}>Teacher Details</Text>
            
            {/* --- NEW: Photo Attachment UI --- */}
            <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.profilePic} />
                ) : (
                    <View style={styles.profilePicPlaceholder}>
                        <FontAwesome5 name="user-plus" size={24} color="#888" />
                        <Text style={styles.profilePicText}>Attach Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Full Name" value={profile.name} onChangeText={val => handleInputChange('name', val)} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Primary Subject" value={profile.subject} onChangeText={val => handleInputChange('subject', val)} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Contact Email" value={profile.contactEmail} onChangeText={val => handleInputChange('contactEmail', val)} keyboardType="email-address" placeholderTextColor="#888" />
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <Text style={styles.submitButtonText}>Save Details</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
      <BottomTabBar theme={theme} />
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
    scrollContainer: { padding: 20 },
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular', marginBottom: 20 },
    profilePicContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5, overflow: 'hidden' },
    profilePic: { width: '100%', height: '100%' },
    profilePicPlaceholder: { justifyContent: 'center', alignItems: 'center' },
    profilePicText: { color: '#888', marginTop: 8, fontFamily: 'Poppins-Regular' },
    input: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 10, padding: 15, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 15, elevation: 2 },
    submitButton: { backgroundColor: '#FBBF24', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    submitButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16 },
});

export default TeacherDetailsScreen;

