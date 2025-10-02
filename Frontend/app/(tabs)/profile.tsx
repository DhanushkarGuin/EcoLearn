import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

// Reusable component for each option row
interface ProfileOptionProps {
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
  text: string;
  onPress: () => void;
  theme: 'light' | 'dark';
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, text, onPress, theme }) => {
    const styles = getStyles(theme);
    return (
        <TouchableOpacity style={styles.optionRow} onPress={onPress}>
            <FontAwesome5 name={icon} size={20} color={styles.optionIcon.color} />
            <Text style={styles.optionText}>{text}</Text>
            <FontAwesome5 name="chevron-right" size={16} color={styles.optionIcon.color} />
        </TouchableOpacity>
    );
};


const ProfileScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const styles = getStyles(theme);
  const headerIconColor = theme === 'dark' ? '#FFFFFF' : '#121212';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.container}>
        {/* --- Custom Header --- */}
        <View style={styles.header}>
            <Image source={require('../../assets/images/logo-2.png')} style={styles.logo} />
            <TouchableOpacity onPress={toggleTheme}>
                <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
            </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            {/* --- User Info Card --- */}
            <View style={styles.userInfoSection}>
                <View style={styles.profilePicContainer}>
                    {/* Placeholder for a profile picture */}
                    <FontAwesome5 name="user" size={40} color={theme === 'dark' ? '#121212' : '#FFFFFF'} />
                </View>
                <Text style={styles.userName}>Alex Doe</Text>
                <Text style={styles.userRole}>Student</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>42069</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>Gold</Text>
                        <Text style={styles.statLabel}>Rank</Text>
                    </View>
                </View>
            </View>

            {/* --- Options List --- */}
            <View style={styles.optionsContainer}>
                <ProfileOption icon="user-edit" text="Edit Profile" onPress={() => {}} theme={theme} />
                <ProfileOption icon="cog" text="Account Settings" onPress={() => {}} theme={theme} />
                <ProfileOption icon="award" text="My Rewards" onPress={() => {}} theme={theme} />
                <ProfileOption icon="shield-alt" text="Privacy Policy" onPress={() => {}} theme={theme} />
                <ProfileOption icon="sign-out-alt" text="Logout" onPress={() => {}} theme={theme} />
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logo: {
  height: 100, // You can adjust the height as needed
  width: 100, 
  backgroundColor: 'none',
  resizeMode: 'contain', // Ensures the logo scales correctly without distortion
  marginTop: 5, // Adds space from the top of the screen
  marginLeft: -10, // Aligns it nicely with the buttons
  },
  userInfoSection: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme === 'dark' ? '#FBBF24' : '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
  },
  userRole: {
    color: '#AEB6BF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 15,
    padding: 15,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  statLabel: {
    color: '#AEB6BF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  optionsContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
  },
  optionIcon: {
      color: theme === 'dark' ? '#FBBF24' : '#566573',
  },
  optionText: {
    color: theme === 'dark' ? '#EAEAEA' : '#121212',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginLeft: 15,
    flex: 1,
  },
});

export default ProfileScreen;
