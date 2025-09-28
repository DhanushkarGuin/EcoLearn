import React, { useState, useMemo } from 'react';
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
import BottomTabBar from '../components/BottomTabBar';

// --- Mock Data for Students ---
// In a real app, this would be fetched from your database
const MOCK_STUDENTS = [
  { id: 's1', name: 'Alex Doe', points: 42069 },
  { id: 's2', name: 'Jane Roe', points: 38500 },
  { id: 's3', name: 'Sam Wilson', points: 38450 },
  { id: 's4', name: 'Jessica Day', points: 35100 },
  { id: 's5', name: 'Mike Ross', points: 32000 },
  { id: 's6', name: 'Rachel Zane', points: 29800 },
  { id: 's7', name: 'Harvey Specter', points: 25000 },
];

// Reusable component for each ranked student
interface LeaderboardItemProps {
  item: { id: string; name: string; points: number; rank: number };
  theme: 'light' | 'dark';
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item, theme }) => {
    const styles = getStyles(theme);
    const rank = item.rank;

    const getRankStyle = () => {
        if (rank === 1) return styles.rankGold;
        if (rank === 2) return styles.rankSilver;
        if (rank === 3) return styles.rankBronze;
        return styles.rankDefault;
    };
    
    const getRankIcon = () => {
        if (rank === 1) return { name: "trophy", color: "#FFD700"};
        if (rank === 2) return { name: "medal", color: "#C0C0C0"};
        if (rank === 3) return { name: "award", color: "#CD7F32"};
        return null;
    }

    const rankIcon = getRankIcon();

    return (
        <View style={styles.card}>
            <View style={styles.rankContainer}>
                <Text style={[styles.rankNumber, getRankStyle()]}>{rank}</Text>
                {rankIcon && <FontAwesome5 name={rankIcon.name} size={20} color={rankIcon.color} style={{marginLeft: 5}} />}
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <Text style={styles.pointsText}>{item.points} pts</Text>
        </View>
    );
};

const LeaderboardScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Memoize the sorted leaderboard data
  const leaderboardData = useMemo(() => {
    return MOCK_STUDENTS
      .sort((a, b) => b.points - a.points)
      .map((student, index) => ({ ...student, rank: index + 1 }));
  }, []);

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
                <TouchableOpacity onPress={toggleTheme}>
                    <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButtonCircle}>
                    <Feather name="chevron-left" size={24} color={headerIconColor} />
                </TouchableOpacity>
            </View>
        </View>

        <Text style={styles.pageTitle}>Leaderboards</Text>

        <FlatList
          data={leaderboardData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <LeaderboardItem item={item} theme={theme} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

      </View>
      <BottomTabBar theme={theme} />
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
    gap: 15,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pageTitle: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 28,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
    shadowRadius: 2,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60, // Fixed width for alignment
  },
  rankNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
  rankGold: { color: '#FFD700' },
  rankSilver: { color: '#C0C0C0' },
  rankBronze: { color: '#CD7F32' },
  rankDefault: { color: theme === 'dark' ? '#AEB6BF' : '#566573' },
  nameContainer: {
    flex: 1,
    marginLeft: 15,
  },
  nameText: {
    color: theme === 'dark' ? '#EAEAEA' : '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  pointsText: {
    color: '#FBBF24',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default LeaderboardScreen;
