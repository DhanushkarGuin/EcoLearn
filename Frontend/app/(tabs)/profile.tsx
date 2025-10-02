// ProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image,
  ScrollView, StatusBar, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRole } from '../RoleContext';
import API_URL from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface StudentProfile {
  name: string;
  student_class: string;
  roll_number: string;
  photo_url?: string | null;
  points?: number;
  rank?: string;
}

const ProfileScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { role } = useRole();

  const fetchProfile = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      
      // Get rollNumber from storage
      const savedRollNumber = await AsyncStorage.getItem('studentRollNumber');
      
      if (!savedRollNumber) {
        Alert.alert(
          'Profile Incomplete', 
          'Please complete your profile setup first.',
          [
            {
              text: 'Go to Profile',
              onPress: () => router.push('/StudentDetails')
            }
          ]
        );
        setIsLoading(false);
        return;
      }

      console.log('Fetching profile for:', savedRollNumber);
      const response = await fetch(`${API_URL}/api/students/${savedRollNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert(
            'Profile Not Found', 
            'Your profile was not found. Please update your details.',
            [
              {
                text: 'Update Profile',
                onPress: () => router.push('/StudentDetails')
              }
            ]
          );
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Profile data:', result);
      
      if (result.success) {
        setProfile(result.data);
      } else {
        throw new Error(result.message || 'Failed to load profile');
      }
    } catch (err: any) {
      console.log('Profile fetch error:', err);
      Alert.alert(
        'Error', 
        err.message || 'Failed to load profile. Please check your connection.',
        [
          {
            text: 'Retry',
            onPress: () => fetchProfile()
          }
        ]
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const styles = getStyles(theme);
  const headerIconColor = theme === 'dark' ? '#FFFFFF' : '#121212';

  const handleEditProfile = () => {
    router.push('/StudentDetails');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/logo-2.png')} style={styles.logo} />
            <TouchableOpacity onPress={toggleTheme}>
              <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
            </TouchableOpacity>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FBBF24" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo-2.png')} style={styles.logo} />
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Feather name="edit-3" size={20} color={headerIconColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme}>
              <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FBBF24']}
              tintColor={theme === 'dark' ? '#FBBF24' : '#FBBF24'}
            />
          }
        >
          <View style={styles.userInfoSection}>
            <View style={styles.profilePicContainer}>
              {profile?.photo_url ? (
                <Image source={{ uri: profile.photo_url }} style={styles.profileImage} />
              ) : (
                <FontAwesome5 name="user" size={40} color={theme === 'dark' ? '#121212' : '#FFFFFF'} />
              )}
            </View>
            
            <Text style={styles.userName}>{profile?.name || "Student Name"}</Text>
            <Text style={styles.userRole}>{role || "Student"}</Text>
            <Text style={styles.userClass}>{profile?.student_class || "Class not set"}</Text>
            <Text style={styles.userRoll}>Roll: {profile?.roll_number || "Not set"}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile?.points || 0}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile?.rank || "N/A"}</Text>
                <Text style={styles.statLabel}>Rank</Text>
              </View>
            </View>

            {/* Additional Info Section */}
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Feather name="award" size={20} color="#FBBF24" />
                <Text style={styles.infoText}>Eco Warrior Level: Beginner</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="calendar" size={20} color="#FBBF24" />
                <Text style={styles.infoText}>Member since: {new Date().getFullYear()}</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
                <Feather name="edit-2" size={18} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                <Feather name="share-2" size={18} color={theme === 'dark' ? '#FFFFFF' : '#121212'} />
                <Text style={[styles.actionButtonText, styles.secondaryActionText]}>Share Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5' 
  },
  container: { 
    flex: 1 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 20 
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  editButton: {
    padding: 5,
  },
  logo: { 
    height: 100, 
    width: 100, 
    resizeMode: 'contain', 
    marginTop: 5, 
    marginLeft: -10 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  userInfoSection: { 
    alignItems: 'center', 
    padding: 20 
  },
  profilePicContainer: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: theme === 'dark' ? '#FBBF24' : '#2C3E50', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 60 
  },
  userName: { 
    color: theme === 'dark' ? '#FFFFFF' : '#121212', 
    fontSize: 28, 
    fontFamily: 'Poppins-SemiBold', 
    marginBottom: 5,
    textAlign: 'center'
  },
  userRole: { 
    color: '#AEB6BF', 
    fontSize: 16, 
    fontFamily: 'Poppins-Regular', 
    marginBottom: 10 
  },
  userClass: { 
    color: theme === 'dark' ? '#FFFFFF' : '#121212', 
    fontSize: 18, 
    fontFamily: 'Poppins-Medium', 
    marginBottom: 5 
  },
  userRoll: { 
    color: '#AEB6BF', 
    fontSize: 16, 
    fontFamily: 'Poppins-Regular', 
    marginBottom: 30 
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 10, 
    marginBottom: 30,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', 
    borderRadius: 15, 
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statBox: { 
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5',
    marginHorizontal: 10,
  },
  statValue: { 
    color: theme === 'dark' ? '#FFFFFF' : '#121212', 
    fontSize: 24, 
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
  },
  statLabel: { 
    color: '#AEB6BF', 
    fontSize: 14, 
    fontFamily: 'Poppins-Regular' 
  },
  infoContainer: {
    width: '100%',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FBBF24',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#FFFFFF' : '#121212',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  secondaryActionText: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
  },
});

export default ProfileScreen;