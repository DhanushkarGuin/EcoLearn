import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const styles = getStyles(theme);

  return (
    <View style={styles.headerContainer}>
          <Image
               source={require("../assets/images/logo-2.png")}
          style={styles.logo}></Image>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9E9E9E"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.themeToggle} onPress={onToggleTheme}>
          <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={24} color={theme === 'dark' ? '#f5d061' : '#4A4A4A'} />
        </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
logo: {
  height: 100, // You can adjust the height as needed
  width: 100, 
  backgroundColor: 'none',
  resizeMode: 'contain', // Ensures the logo scales correctly without distortion
  marginTop: 5, // Adds space from the top of the screen
  marginLeft: -10, // Aligns it nicely with the buttons
},
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#2E2E2E' : '#E0E0E0',
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: theme === 'dark' ? '#fff' : '#121212',
    fontFamily: 'Poppins-Regular',
  },
  themeToggle: {
    marginLeft: 15,
    padding: 5,
  },
});

export default Header;

