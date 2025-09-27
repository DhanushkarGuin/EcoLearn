import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const GameModeScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
            <Image source={require('../assets/images/logo-2.png')} style={styles.logo} />
            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                    <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButtonCircle}>
                    <Feather name="chevron-left" size={24} color={headerIconColor} />
                </TouchableOpacity>
            </View>
        </View>

        {/* --- Main Content --- */}
        <View style={styles.contentContainer}>
            <Text style={styles.title}>You wanna play?{'\n'}Let's PLAY!!!</Text>

            <TouchableOpacity style={styles.modeButton} onPress={() => console.log('Single Player Selected')}>
                <Text style={styles.modeButtonText}>Single Player</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            <TouchableOpacity style={styles.modeButton} onPress={() => console.log('Multi Player Selected')}>
                <Text style={styles.modeButtonText}>Multi Player</Text>
            </TouchableOpacity>
        </View>

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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 28,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  modeButton: {
    backgroundColor: '#ffcf76',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  modeButtonText: {
    color: '#333333',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  orText: {
    color: theme === 'dark' ? '#AEB6BF' : '#566573',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginVertical: 20,
  },
});

export default GameModeScreen;
