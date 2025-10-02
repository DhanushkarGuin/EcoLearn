import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, ScrollView, Alert, StatusBar } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRole } from "./RoleContext"; // ✅ Import role context

const handleSubmitButton = () =>{
  router.push('/School')
}

const SCHOOL_PROFILE_KEY = '@school_profile';

interface SchoolProfile {
  schoolName: string;
  principalName: string;
  address: string;
  contactNumber: string;
  photoUri: string | null;
}

const SchoolDetailsScreen: React.FC = () => {
  const { setRole } = useRole();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [profile, setProfile] = useState<Partial<SchoolProfile>>({});
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const jsonValue = await AsyncStorage.getItem(SCHOOL_PROFILE_KEY);
    if (jsonValue) {
        const savedProfile: SchoolProfile = JSON.parse(jsonValue);
        setProfile(savedProfile);
        setImageUri(savedProfile.photoUri);
    }
  };

  const handleInputChange = (field: keyof Omit<SchoolProfile, 'photoUri'>, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3], // Aspect ratio for a school photo/logo might be different
          quality: 0.5,
      });
      if (!result.canceled) {
          setImageUri(result.assets[0].uri);
      }
  };

  const handleSave = async () => {
    const profileToSave: SchoolProfile = {
        schoolName: profile.schoolName || '',
        principalName: profile.principalName || '',
        address: profile.address || '',
        contactNumber: profile.contactNumber || '',
        photoUri: imageUri,
    };
    await AsyncStorage.setItem(SCHOOL_PROFILE_KEY, JSON.stringify(profileToSave));
    Alert.alert('Success', 'The school details have been saved.');
  };
 const handleSubmitButton = async () => {
    await handleSave();         // Save student details
    setRole("student");         // ✅ Mark role as student
    router.push('/StudentPage'); // Redirect to student home
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
            <Text style={styles.pageTitle}>School Details</Text>

            <TouchableOpacity style={styles.schoolPicContainer} onPress={pickImage}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.schoolPic} />
                ) : (
                    <View style={styles.schoolPicPlaceholder}>
                        <FontAwesome5 name="school" size={24} color="#888" />
                        <Text style={styles.schoolPicText}>Attach School Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="School Name" value={profile.schoolName} onChangeText={val => handleInputChange('schoolName', val)} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Principal's Name" value={profile.principalName} onChangeText={val => handleInputChange('principalName', val)} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="School Address" value={profile.address} onChangeText={val => handleInputChange('address', val)} multiline placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Contact Number" value={profile.contactNumber} onChangeText={val => handleInputChange('contactNumber', val)} keyboardType="phone-pad" placeholderTextColor="#888" />
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitButton}>
                <Text style={styles.submitButtonText}>Save Details</Text>
            </TouchableOpacity>
        </ScrollView>
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
    scrollContainer: { padding: 20 },
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular', marginBottom: 20 },
    schoolPicContainer: { width: '100%', height: 150, borderRadius: 15, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5, overflow: 'hidden' },
    schoolPic: { width: '100%', height: '100%' },
    schoolPicPlaceholder: { justifyContent: 'center', alignItems: 'center' },
    schoolPicText: { color: '#888', marginTop: 8, fontFamily: 'Poppins-Regular' },
    input: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 10, padding: 15, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 15, elevation: 2 },
    submitButton: { backgroundColor: '#FBBF24', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    submitButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16 },
});

export default SchoolDetailsScreen;

