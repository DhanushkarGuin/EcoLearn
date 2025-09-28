import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

// --- Mock Data for Games ---
// In a real app, this would come from an API or a config file.
const ALL_GAMES = [
  {
    id: 'g1',
    title: 'Disaster Detective',
    description: 'Solve puzzles to prevent environmental crises. A thrilling solo adventure!',
    playerType: 'single',
    image: require('../assets/images/logo-2.png'),
  },
  {
    id: 'g2',
    title: 'Carbon Quiz Challenge',
    description: 'Test your eco-knowledge against a friend. Who knows more?',
    playerType: 'two',
    image: require('../assets/images/logo-2.png'),
  },
  {
    id: 'g3',
    title: 'Eco Tycoon',
    description: 'Build a sustainable city from the ground up in this engaging single-player simulation.',
    playerType: 'single',
    image: require('../assets/images/logo-2.png'),
  },
];

const singlePlayerGames = ALL_GAMES.filter(g => g.playerType === 'single');
const twoPlayerGames = ALL_GAMES.filter(g => g.playerType === 'two');

// --- Reusable Component for Game Cards ---
interface GameCardProps {
  game: typeof ALL_GAMES[0];
  onPress: () => void;
  theme: 'light' | 'dark';
}

const GameCard: React.FC<GameCardProps> = ({ game, onPress, theme }) => {
    const styles = getStyles(theme);
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={game.image} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{game.title}</Text>
                <Text style={styles.cardDescription}>{game.description}</Text>
            </View>
        </TouchableOpacity>
    );
};


const GameListScreen: React.FC = () => {
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
                <TouchableOpacity onPress={toggleTheme}>
                    <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButtonCircle}>
                    <Feather name="chevron-left" size={24} color={headerIconColor} />
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* --- Single Player Section --- */}
            <Text style={styles.sectionTitle}>Single Player</Text>
            {singlePlayerGames.map(game => (
                <GameCard key={game.id} game={game} theme={theme} onPress={() => console.log(`Play ${game.title}`)} />
            ))}

            {/* --- Two Player Section --- */}
            <Text style={styles.sectionTitle}>Two Player</Text>
             {twoPlayerGames.map(game => (
                <GameCard key={game.id} game={game} theme={theme} onPress={() => console.log(`Play ${game.title}`)} />
            ))}
        </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  sectionTitle: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 26,
    fontFamily: 'Poppins-Regular',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden', // Ensures the image respects the border radius
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
    shadowRadius: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardTextContainer: {
    padding: 15,
  },
  cardTitle: {
    color: theme === 'dark' ? '#EAEAEA' : '#121212',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  cardDescription: {
    color: '#AEB6BF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
});

export default GameListScreen;
