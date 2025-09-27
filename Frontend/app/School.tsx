import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import Header from '../components/Header';
import CalendarWidget from '../components/CalendarWidget';
import BottomTabBar from '../components/BottomTabBar';

// Reusable Action Card Component
interface ActionCardProps {
    title: string;
    imageSource: any; // Using 'any' for require() result
    onPress: () => void;
    theme: 'light' | 'dark';
}

const ActionCard: React.FC<ActionCardProps> = ({ title, imageSource, onPress, theme }) => {
    const styles = getStyles(theme);
    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, styles.actionCard]}>
            <Text style={styles.actionCardTitle}>{title}</Text>
            <Image source={imageSource} style={styles.actionCardImage} />
        </TouchableOpacity>
    );
};


const SchoolHomeScreen: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light'); // Defaulting to light as per image

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* The Header component is reused */}
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

          {/* School Events Card */}
          <View style={[styles.card, styles.eventsCard]}>
            <Text style={styles.cardTitle}>School Events</Text>
            {/* The CalendarWidget component is reused */}
            <CalendarWidget theme={theme} />
          </View>

          {/* Action Cards */}
          <ActionCard
            title="Manage Events"
            imageSource={require('../assets/images/manage-events.png')}
            onPress={() => console.log('Manage Events')}
            theme={theme}
          />
          <ActionCard
            title="Manage Points"
            imageSource={require('../assets/images/manage-points.png')}
            onPress={() => console.log('Manage Points')}
            theme={theme}
          />
          <ActionCard
            title="Check LeaderBoardC"
            imageSource={require('../assets/images/check-leaderBoard.png')}
            onPress={() => console.log('Check Plantography')}
            theme={theme}
          />

        </ScrollView>
        {/* The BottomTabBar component is reused */}
        <BottomTabBar theme={theme} />
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
    marginBottom: 15,
    backgroundColor: theme === 'dark' ? '#2a363b' : '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.25 : 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5,
  },
  eventsCard: {
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1E1E1E',
  },
  cardTitle: {
    color: theme === 'dark' ? '#fff' : '#2a363b',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
  },
  actionCard: {
    backgroundColor: '#f5d061',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  actionCardTitle: {
    color: '#333',
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  actionCardImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
});

export default SchoolHomeScreen;
