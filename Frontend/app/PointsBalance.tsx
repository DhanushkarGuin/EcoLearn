import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

// Page-flow
const handleBackButton = () =>{
  router.push('/StudentPage')
}

// --- Reusable component for the NEW progress bars ---
interface ProgressBarProps {
  label: string;
  value: number; // Value from 0 to 100
  theme: 'light' | 'dark';
}

// --- THIS COMPONENT HAS BEEN UPDATED ---
const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, theme }) => {
  const styles = getStyles(theme);
  return (
    // The order of the Bar and the Label has been swapped
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarForeground, { width: `${value}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
};

// --- Main Screen Component ---
const BalanceScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const styles = getStyles(theme);

  // --- Mock Data for the points capsules ---
  const septemberData = [
    { label: 'Trees', value: 90 }, { label: 'Cycle', value: 70 },
    { label: 'Bus', value: 60 }, { label: 'Train', value: 40 },
  ];
  const augustData = [
    { label: 'Trees', value: 80 }, { label: 'Cycle', value: 75 },
    { label: 'Bus', value: 65 }, { label: 'Train', value: 50 },
  ];


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- Custom Header --- */}
        <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/images/logo-2.png')} style={styles.logo} />
            </View>
            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                    <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={styles.headerIconColor.color} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButtonCircle} onPress={handleBackButton}>
                    <Feather name="chevron-left" size={24} color={styles.headerIconColor.color} />
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* --- Top Section: Balance and Tips --- */}
          <View style={styles.topSection}>
            {/* Balance Card */}
            <View style={[styles.card, styles.balanceCard]}>
              <Text style={styles.balanceTitle}>Balance</Text>
              <Text style={styles.balanceAmount}>42069</Text>
              <View style={styles.redCircle} />
            </View>
            {/* Tips Section */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips:</Text>
              <View style={[styles.card, styles.tipCard]} />
              <View style={[styles.card, styles.tipCard]} />
            </View>
          </View>

          {/* --- Points Capsule Section --- */}
          <Text style={styles.capsuleHeader}>Points Capsule:</Text>

          {/* September Capsule */}
          <View style={styles.card}>
            <Text style={styles.capsuleMonth}>September<Text style={styles.capsuleYear}>2025</Text></Text>
            {septemberData.map(item => (
                <ProgressBar key={item.label} label={item.label} value={item.value} theme={theme} />
            ))}
          </View>

          {/* August Capsule */}
          <View style={styles.card}>
            <Text style={styles.capsuleMonth}>August<Text style={styles.capsuleYear}>2025</Text></Text>
            {augustData.map(item => (
                <ProgressBar key={item.label} label={item.label} value={item.value} theme={theme} />
            ))}
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  logoContainer: {
    alignItems: 'center',
  },
 logo: {
  height: 100, // You can adjust the height as needed
  width: 100, 
  backgroundColor: 'none',
  resizeMode: 'contain', // Ensures the logo scales correctly without distortion
  marginTop: 5, // Adds space from the top of the screen
  marginLeft: -10, // Aligns it nicely with the buttons
 },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
  backButtonCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 3,
  },
  headerIconColor: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
  },
  card: {
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.3 : 0.1, shadowRadius: 4,
    elevation: 5,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  balanceCard: {
    flex: 1,
    marginRight: 10,
    overflow: 'hidden',
  },
  balanceTitle: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  balanceAmount: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 36,
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
  },
  redCircle: {
    position: 'absolute',
    bottom: -100,
    left: 0,
    width: 250,
    height: 180,
    borderRadius: 100,
    backgroundColor: '#CF4647',
  },
  tipsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  tipsTitle: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
 tipCard: {
    height: 70,
    backgroundColor: '#ffcf76', // Your original color
    marginBottom: 10,
    padding: 0,
    borderRadius: 20, // Shadows look best on elements with rounded corners

    // --- Shadow for iOS ---
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // --- Shadow for Android ---
    elevation: 5,
  },
  capsuleHeader: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  capsuleMonth: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
  },
  capsuleYear: {
    color: '#CF4647',
  },
  // --- Progress Bar Styles (Updated) ---
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressLabel: {
    color: theme === 'dark' ? '#AEB6BF' : '#566573',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 10, // Changed from marginRight
    width: 50,
  },
  progressBarBackground: {
    flex: 1,
    height: 14,
    backgroundColor: theme === 'dark' ? '#2C3E50' : '#EAECEE',
    borderRadius: 7,
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: '#ffcf76',
    borderRadius: 7,
  },
});

export default BalanceScreen;

