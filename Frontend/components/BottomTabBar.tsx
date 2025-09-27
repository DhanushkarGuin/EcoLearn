import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Tab = {
  name: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
};

interface TabBarProps {
  theme: 'dark' | 'light';
}

const BottomTabBar: React.FC<TabBarProps> = ({ theme }) => {
  const styles = getStyles(theme);
  const tabs: Tab[] = [
    { name: 'notification', icon: 'bell', label: 'Notification' },
    { name: 'home', icon: 'home', label: 'Home' },
    { name: 'profile', icon: 'user', label: 'Profile' },
  ];

  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} style={styles.tabItem}>
          <Feather name={tab.icon} size={24} color={tab.name === 'home' ? '#FBBF24' : '#A9A9A9'} />
          <Text style={[styles.tabLabel, tab.name === 'home' && styles.activeLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? '#2E2E2E' : '#E0E0E0',
    paddingVertical: 10,
    // Add padding for the home bar area on newer phones
    paddingBottom: 20, 
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    color: '#A9A9A9',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  activeLabel: {
    color: '#FBBF24',
  },
});

export default BottomTabBar;

