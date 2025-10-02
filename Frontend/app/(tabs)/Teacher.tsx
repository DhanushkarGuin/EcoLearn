import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import Header from '../../components/Header';
import CalendarWidget from '../../components/CalendarWidget';
import { FontAwesome5 } from '@expo/vector-icons';
import {router} from 'expo-router';

//Page-flow
const handlePlantographButton = () =>{
  router.push('/photo_clicker')
}

const handleEventsButton = () =>{
  router.push('/TeacherManage-events')
}

const handleStudentEntryButton = () =>{

}

const handlePointsButton = () =>{
  router.push("/Teacher-Provide-points")
}

const handleLeaderboardsButton = () =>{
  router.push('/LeaderBoard')
}

const TeacherHomeScreen: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

          {/* Check Student's Plantography Card */}
          <TouchableOpacity style={[styles.card, styles.plantographCard]} onPress={handlePlantographButton}>
            <Text style={styles.plantographCardTitle}>Check student's Plantography</Text>
            <View style={styles.polaroidFrame}>
              <View style={styles.polaroidBorder}>
                <View style={styles.polaroidImageArea}>
                  <FontAwesome5 name="seedling" size={40} color={theme === 'dark' ? '#fff' : '#121212'} />
                </View>
              </View>
              <View style={styles.polaroidBottom}>
                <View style={styles.polaroidDots} />
              </View>
            </View>
          </TouchableOpacity>

          {/* School Events Card */}
          <View style={[styles.card]}>
            <TouchableOpacity onPress={handleEventsButton}>
              <Text style={styles.cardTitle}>School Events</Text>
              <CalendarWidget theme={theme} />
            </TouchableOpacity>
          </View>

          {/* Scan Entry QR Card */}
          <TouchableOpacity style={[styles.card, styles.actionCard, styles.yellowCard]}>
            <Text style={styles.actionCardTitle}>Confirm student entry</Text>
            <Image source={require('../../assets/images/IDcheck.png')} style={styles.actionCardImage} />
          </TouchableOpacity>

          {/* Provide Points Card */}
          <TouchableOpacity style={[styles.card, styles.actionCard, styles.yellowCard]} onPress={handlePointsButton}>
            <Text style={styles.actionCardTitle}>Provide points to student</Text>
            <Image source={require('../../assets/images/provide-points.png')} style={styles.actionCardImage} />
          </TouchableOpacity>
          
          {/* --- NEW LEADERBOARDS CARD --- */}
          <TouchableOpacity style={[styles.card, styles.actionCard, styles.yellowCard]} onPress={handleLeaderboardsButton}>
            <Text style={styles.actionCardTitle}>Check Leaderboards</Text>
            {/* 👇 IMPORTANT: Add 'check-leaderboards.png' to your assets/images folder */}
            <Image source={require('../../assets/images/check-leaderBoard.png')} style={styles.actionCardImage} />
          </TouchableOpacity>
          {/* --- END OF NEW CARD --- */}
            <TouchableOpacity style={[styles.card, styles.actionCard, styles.yellowCard]} onPress={handleEventsButton}>
              <Text style={styles.actionCardTitle}>Manage Events</Text>
              {/* 👇 IMPORTANT: Add 'check-leaderboards.png' to your assets/images folder */}
              <Image source={require('../../assets/images/manage-events.png')} style={styles.actionCardImage} />
          </TouchableOpacity>
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
    paddingHorizontal: 15,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.25 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5,
  },
  cardTitle: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
  },
  plantographCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantographCardTitle: {
    color: theme === 'dark' ? '#fff' : '#121212',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    flex: 1,
    marginRight: 10,
  },
  polaroidFrame: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  polaroidBorder: {
    borderWidth: 2,
    borderColor: '#E91E63',
    borderRadius: 3,
  },
  polaroidImageArea: {
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
    width: 60,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polaroidBottom: {
    backgroundColor: 'white',
    height: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 5,
  },
  polaroidDots: {
    width: 15,
    height: 3,
    backgroundColor: '#E91E63',
    borderRadius: 2,
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  yellowCard: {
    backgroundColor: '#f5d061',
  },
  actionCardTitle: {
    color: '#333',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  actionCardImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
  },
});

export default TeacherHomeScreen;

