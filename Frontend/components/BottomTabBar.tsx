import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
// Using FontAwesome for solid icons that better match the image
import { FontAwesome } from '@expo/vector-icons';

// Define the shape of the tab data
type Tab = {
  name: string;
  // Get the specific icon names available in FontAwesome
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
};

interface TabBarProps {
  theme: 'light' | 'dark';
}

const BottomTabBar: React.FC<TabBarProps> = ({ theme }) => {
  const styles = getStyles(theme);

  // Note: labels are now lowercase to match the image
  const tabs: Tab[] = [
    { name: 'notification', icon: 'bell', label: 'notification' },
    { name: 'home', icon: 'home', label: 'home' },
    { name: 'profile', icon: 'user', label: 'profile' },
  ];

  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} style={styles.tabItem}>
          <FontAwesome name={tab.icon} size={28} color={styles.icon.color} />
          <Text style={styles.tabLabel}>
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
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: theme === 'dark' ? '#2E2E2E' : '#E0E0E0',
    paddingTop: 10,
    // Use paddingBottom that respects the safe area for modern devices
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  tabItem: {
    alignItems: 'center',
  },
  icon: {
      color: theme === 'dark' ? '#FFFFFF' : '#121212',
  },
  tabLabel: {
    color: theme === 'dark' ? '#AEB6BF' : '#566573',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
});

export default BottomTabBar;

