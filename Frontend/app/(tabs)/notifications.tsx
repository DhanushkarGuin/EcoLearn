import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

// --- Mock Data for Notifications ---
const NOTIFICATIONS = [
  { id: '1', icon: 'award', title: 'New Badge Unlocked!', description: 'You earned the "Eco Warrior" badge. Keep it up!', time: '2 hours ago', color: '#2ECC71' },
  { id: '2', icon: 'calendar-alt', title: 'School Event Reminder', description: 'The "Campus Cleanup Day" is tomorrow at 10 AM.', time: '1 day ago', color: '#3498DB' },
  { id: '3', icon: 'seedling', title: 'Plantograph Check-in', description: 'You successfully checked in on your plant spot.', time: '3 days ago', color: '#FBBF24' },
  { id: '4', icon: 'exclamation-triangle', title: 'Account Alert', description: 'Please update your password for enhanced security.', time: '1 week ago', color: '#E74C3C' },
];

interface NotificationItemProps {
  item: typeof NOTIFICATIONS[0];
  theme: 'light' | 'dark';
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, theme }) => {
    const styles = getStyles(theme);
    return (
        <View style={styles.notificationCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <FontAwesome5 name={item.icon} size={22} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDesc}>{item.description}</Text>
            </View>
            <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
    );
};


const NotificationScreen: React.FC = () => {
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

        <Text style={styles.pageTitle}>Notifications</Text>

        <FlatList
            data={NOTIFICATIONS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <NotificationItem item={item} theme={theme} />}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <FontAwesome5 name="bell-slash" size={50} color="#566573" />
                    <Text style={styles.emptyText}>No new notifications</Text>
                </View>
            }
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
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
  pageTitle: {
      color: theme === 'dark' ? '#FFFFFF' : '#121212',
      fontSize: 28,
      fontFamily: 'Poppins-Regular',
      paddingHorizontal: 20,
      marginBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    color: theme === 'dark' ? '#EAEAEA' : '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  notificationDesc: {
    color: '#AEB6BF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  notificationTime: {
    color: '#AEB6BF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40%',
  },
  emptyText: {
    color: '#566573',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginTop: 15,
  },
});

export default NotificationScreen;
