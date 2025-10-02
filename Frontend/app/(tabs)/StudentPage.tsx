import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import Header from '../../components/Header';
import CalendarWidget from '../../components/CalendarWidget';
import { Feather, FontAwesome5 } from '@expo/vector-icons'; // Using FontAwesome5 for seedling

const HomeScreen: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>

          {/* Top Cards Section */}
          <View style={styles.cardsRow}>
            {/* Left Column */}
            <View style={styles.column}>
              <View style={[styles.card, styles.rewardsCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.rewardsCardTitle}>Rewards</Text>
                  <Feather name="arrow-right" size={20} color="#fff" />
                </View>
                <Feather name="gift" size={32} color="#D32F2F" style={styles.rewardsIcon} />
                <Text style={styles.rewardsCardSubtitle}>You can redeem rewards</Text>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.column}>
              <View style={[styles.card, styles.balanceCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.balanceCardTitle}>Balance</Text>
                  <Feather name="arrow-right" size={20} color="#333" />
                </View>
                <Text style={styles.balanceText}>42069</Text>
              </View>
              <View style={[styles.card, styles.carbonCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.balanceCardTitle}>Carbon Footprint</Text>
                  <Feather name="arrow-right" size={20} color="#333" />
                </View>
                <Text style={styles.carbonText}>XX saved</Text>
              </View>
            </View>
          </View>

          {/* School Events Card */}
          <View style={[styles.card, styles.fullWidthCard]}>
            <Text style={styles.cardTitle}>School Events</Text>
            <CalendarWidget theme={theme} />
          </View>

          {/* Plantograph Card - Corrected Icon */}
           <TouchableOpacity style={[styles.card, styles.fullWidthCard, styles.plantographCard]}>
            <Text style={styles.plantographCardTitle}>Click your Plantograph</Text>
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

          {/* Leaderboards Card */}
          <View style={[styles.card, styles.fullWidthCard]}>
             <Text style={styles.cardTitle}>Leaderboards</Text>
             <Text style={styles.cardSubtitle}>You are placed</Text>
             <Text style={styles.leaderboardRank}>69th right now!</Text>
          </View>

           {/* Games Card */}
           <TouchableOpacity style={[styles.card, styles.fullWidthCard, styles.gamesCard]}>
                <View>
                    <Text style={styles.cardTitle}>Games</Text>
                    <Text style={styles.cardSubtitle}>check out 5 unique <Text style={styles.gamesLink}>games</Text></Text>
                </View>
                <Image source={require('../../assets/images/games.png')} style={styles.gamesImage} />
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
    cardsRow: {
        flexDirection: 'row',
        marginHorizontal: -5,
        marginTop: 10,
    },
    column: {
        flex: 1,
        paddingHorizontal: 5
    },
    card: {
        borderRadius: 20,
        padding: 15,
        backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme === 'dark' ? 0.25 : 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fullWidthCard: {
        marginHorizontal: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        flex: 1, // Allows text to take available space
        marginRight: 10, // Adds space between text and image
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
        transform: [{ rotate: '5deg' }], // Slight rotation
    },
    polaroidBorder: {
        borderWidth: 2,
        borderColor: '#E91E63', // Pinkish border
        borderRadius: 3,
    },
    polaroidImageArea: {
        backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
        width: 80,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    polaroidBottom: {
        backgroundColor: 'white',
        height: 20,
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
    cardTitle: {
        color: theme === 'dark' ? '#fff' : '#121212',
        fontSize: 18,
        fontFamily: 'Poppins-Regular'
    },
    rewardsCardTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
    },
    rewardsCardSubtitle: {
        color: '#bb271a',
        fontSize: 15,
        width: 150,
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
    },
    cardSubtitle: {
        color: '#A9A9A9',
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
    },
    rewardsCard: {
        backgroundColor: '#1e1e1e',
    },
    rewardsIcon: {
        marginVertical: 10,
        fontSize: 40
    },
    detailsButton: {
        backgroundColor: '#4A4A4A',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    detailsButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    balanceCard: {
        backgroundColor: '#f5d061',
        borderRadius: 25,
    },
    balanceCardTitle: {
        color: '#333',
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
    },
    balanceText: {
        color: '#333',
        fontSize: 28,
        fontFamily: 'Poppins-Regular',
        marginTop: 10,
    },
    carbonCard: {
        backgroundColor: '#f5d061',
        marginTop: 10,
        borderRadius: 25,
    },
    carbonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        fontFamily: 'Poppins-Regular',
    },
   
    leaderboardRank: {
        color: theme === 'dark' ? '#fff' : '#121212',
        fontSize: 24,
        fontFamily: 'Poppins-Regular',
    },
    gamesCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#FFFFFF',
    },
    gamesLink: {
        color: '#EF4444',
        textDecorationLine: 'underline',
    },
    gamesImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    }
});

export default HomeScreen;

