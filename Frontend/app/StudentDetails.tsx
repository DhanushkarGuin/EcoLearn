import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image,
  TextInput, ScrollView, Alert, StatusBar
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRole } from "./RoleContext";
import API_URL from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StudentProfile {
  id?: string;
  name: string;
  studentClass: string;
  rollNumber: string;
  photoUrl?: string | null;
}

const StudentDetailsScreen: React.FC = () => {
  const { setRole } = useRole();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('Testing connection to:', API_URL);
      const response = await fetch(`${API_URL}/api/test`);
      const result = await response.text();
      console.log('Connection test result:', result);
    } catch (error) {
      console.log('Connection test failed:', error);
      Alert.alert(
        'Connection Error', 
        `Cannot connect to server at ${API_URL}. Make sure:\n\n1. Backend server is running\n2. Correct IP address\n3. Same WiFi network`
      );
    }
  };

  const handleInputChange = (field: keyof StudentProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmitButton = async () => {
    if (isLoading) return;
    
    try {
      if (!profile.name || !profile.studentClass || !profile.rollNumber) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('studentClass', profile.studentClass);
      formData.append('rollNumber', profile.rollNumber);

      if (imageUri) {
        const fileName = `student-${Date.now()}.jpg`;
        formData.append('photo', {
          uri: imageUri,
          name: fileName,
          type: 'image/jpeg',
        } as any);
      }

      console.log('Submitting to:', `${API_URL}/api/students`);
      
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        body: formData,
        // Remove Content-Type header - let React Native set it
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      // Save rollNumber for future use
      await AsyncStorage.setItem('studentRollNumber', profile.rollNumber);
      
      Alert.alert('Success', 'Profile saved successfully!');
      setRole("student");
      router.push('/StudentPage');
    } catch (err: any) {
      console.log('Submit error:', err);
      Alert.alert(
        'Network Error', 
        `Failed to connect: ${err.message}\n\nCheck:\n1. Server is running\n2. Correct IP: ${API_URL}\n3. Same WiFi network`
      );
    } finally {
      setIsLoading(false);
    }
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
            <Text style={styles.pageTitle}>My Details</Text>
            
            {/* Connection Status */}
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionText}>Server: {API_URL}</Text>
            </View>

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

            <TextInput 
              style={styles.input} 
              placeholder="Full Name" 
              value={profile.name} 
              onChangeText={val => handleInputChange('name', val)} 
              placeholderTextColor="#888" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Class (e.g., 10-A)" 
              value={profile.studentClass} 
              onChangeText={val => handleInputChange('studentClass', val)} 
              placeholderTextColor="#888" 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Roll Number" 
              value={profile.rollNumber} 
              onChangeText={val => handleInputChange('rollNumber', val)} 
              keyboardType="numeric" 
              placeholderTextColor="#888" 
            />
            
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
              onPress={handleSubmitButton}
              disabled={isLoading}
            >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Saving...' : 'Save Details'}
                </Text>
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
    logo: { height: 100, width: 100, resizeMode: 'contain', marginTop: 5, marginLeft: -10 },
    scrollContainer: { padding: 20 },
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular', marginBottom: 10 },
    connectionInfo: { marginBottom: 20, padding: 10, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#E5E5E5', borderRadius: 5 },
    connectionText: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 12, fontFamily: 'Poppins-Regular' },
    profilePicContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5 },
    profilePic: { width: '100%', height: '100%', borderRadius: 60 },
    profilePicPlaceholder: { justifyContent: 'center', alignItems: 'center' },
    profilePicText: { color: '#888', marginTop: 8, fontFamily: 'Poppins-Regular' },
    input: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 10, padding: 15, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 15, elevation: 2 },
    submitButton: { backgroundColor: '#FBBF24', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    submitButtonDisabled: { backgroundColor: '#9CA3AF' },
    submitButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16 },
});

export default StudentDetailsScreen;