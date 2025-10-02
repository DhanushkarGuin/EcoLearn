import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// --- Data for our rewards ---
// In a real app, this might come from an API
const BADGES = [
  { id: 'b1', source: require('../assets/images/badge-1.png') },
  { id: 'b2', source: require('../assets/images/badge-2.png') },
  { id: 'b3', source: require('../assets/images/badge-3.png') },
];

const CERTIFICATES = [
  { id: 'c1', source: require('../assets/images/cert-1.png') },
  { id: 'c2', source: require('../assets/images/cert-2.png') },
];


const RewardsScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectReward = (id: string) => {
    // Allows toggling selection
    setSelectedReward(prev => (prev === id ? null : id));
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          <Image source={require('../assets/images/logo-2.png')} style={styles.logo} />
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={styles.headerIconColor.color} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButtonCircle}>
                <Feather name="chevron-left" size={24} color={styles.headerIconColor.color} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Select any of the rewards and redeem</Text>

            {/* --- Badges Card --- */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Badges</Text>
                <View style={styles.rewardContainer}>
                    {BADGES.map(badge => (
                        <TouchableOpacity
                            key={badge.id}
                            onPress={() => handleSelectReward(badge.id)}
                            style={[
                                styles.rewardItem,
                                selectedReward === badge.id && styles.selectedItem
                            ]}
                        >
                            <Image source={badge.source} style={styles.rewardImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* --- Certificates Card --- */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Certificates</Text>
                <View style={styles.rewardContainer}>
                    {CERTIFICATES.map(cert => (
                        <TouchableOpacity
                            key={cert.id}
                            onPress={() => handleSelectReward(cert.id)}
                            style={[
                                styles.rewardItem,
                                selectedReward === cert.id && styles.selectedItem
                            ]}
                        >
                            <Image source={cert.source} style={styles.rewardImageCert} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>

        {/* --- Redeem Button --- */}
        <TouchableOpacity
            style={[styles.redeemButton, !selectedReward && styles.disabledButton]}
            disabled={!selectedReward}
            onPress={() => alert(`Redeeming reward ID: ${selectedReward}`)}
        >
            <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>

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
    marginLeft: 15,
  },
  title: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
    marginTop: 10,
    width: '80%', // To match the design's text wrapping
  },
  card: {
    backgroundColor: theme === 'dark' ? '#2a363b' : '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half of width/height
    backgroundColor: theme === 'dark' ? '#2a363b' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 4,
  },
  // --- END OF NEW STYLE ---
  headerIconColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#121212',
  },
  rewardItem: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent', // Default state
  },
  selectedItem: {
    borderColor: '#FBBF24', // Highlight color when selected
    backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.1)',
  },
  rewardImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  rewardImageCert: {
    width: 110,
    height: 80,
    resizeMode: 'contain',
  },
  redeemButton: {
    width: 100,
    backgroundColor: '#FBBF24',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 15,
    marginLeft:140,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Gray out when no reward is selected
  },
  redeemButtonText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default RewardsScreen;
