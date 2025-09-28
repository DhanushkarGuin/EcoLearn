import React, { useState, useMemo } from 'react';
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
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

// --- Data & Constants for Carbon Calculation ---
// These are simplified estimates. Real calculations are more complex.
const CARBON_FACTORS = {
  tree: 21,    // kg of CO2 saved per tree per year
  cycle: 0.21, // kg of CO2 saved per km cycled vs. driving a car
  bus: 0.1,    // kg of CO2 saved per km on a bus vs. driving a car
  train: 0.04, // kg of CO2 saved per km on a train vs. driving a car
};

// --- Reusable Component for Input Rows ---
interface CalculatorInputProps {
  label: string;
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  theme: 'light' | 'dark';
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({ label, icon, value, onIncrement, onDecrement, theme }) => {
    const styles = getStyles(theme);
    return (
        <View style={styles.inputRow}>
            <FontAwesome5 name={icon} size={24} color={styles.iconColor.color} />
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.counterContainer}>
                <TouchableOpacity onPress={onDecrement} style={styles.counterButton}>
                    <Feather name="minus" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{value}</Text>
                <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
                    <Feather name="plus" size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const CarbonFootprintScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // State for calculator inputs
  const [trees, setTrees] = useState(0);
  const [cycleKm, setCycleKm] = useState(0);
  const [busKm, setBusKm] = useState(0);
  const [trainKm, setTrainKm] = useState(0);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Memoized calculation to prevent recalculating on every render
  const totalCarbonSaved = useMemo(() => {
      const treeSavings = trees * (CARBON_FACTORS.tree / 365); // Daily saving
      const cycleSavings = cycleKm * CARBON_FACTORS.cycle;
      const busSavings = busKm * CARBON_FACTORS.bus;
      const trainSavings = trainKm * CARBON_FACTORS.train;
      return (treeSavings + cycleSavings + busSavings + trainSavings).toFixed(2);
  }, [trees, cycleKm, busKm, trainKm]);

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

        <ScrollView>
            <View style={styles.contentContainer}>
                <Text style={styles.pageTitle}>Carbon Footprint</Text>
                <Text style={styles.pageSubtitle}>Calculate your daily CO2 savings!</Text>

                {/* --- Results Card --- */}
                <View style={styles.resultsCard}>
                    <Text style={styles.resultsValue}>{totalCarbonSaved}</Text>
                    <Text style={styles.resultsLabel}>kg of CO2 Saved Today</Text>
                </View>

                {/* --- Calculator Inputs --- */}
                <View style={styles.calculatorContainer}>
                    <CalculatorInput
                        label="Trees Planted"
                        icon="tree"
                        value={trees}
                        onIncrement={() => setTrees(t => t + 1)}
                        onDecrement={() => setTrees(t => Math.max(0, t - 1))}
                        theme={theme}
                    />
                     <CalculatorInput
                        label="Cycled (km)"
                        icon="bicycle"
                        value={cycleKm}
                        onIncrement={() => setCycleKm(k => k + 1)}
                        onDecrement={() => setCycleKm(k => Math.max(0, k - 1))}
                        theme={theme}
                    />
                     <CalculatorInput
                        label="Bus Travel (km)"
                        icon="bus-alt"
                        value={busKm}
                        onIncrement={() => setBusKm(k => k + 1)}
                        onDecrement={() => setBusKm(k => Math.max(0, k - 1))}
                        theme={theme}
                    />
                     <CalculatorInput
                        label="Train Travel (km)"
                        icon="train"
                        value={trainKm}
                        onIncrement={() => setTrainKm(k => k + 1)}
                        onDecrement={() => setTrainKm(k => Math.max(0, k - 1))}
                        theme={theme}
                    />
                </View>
            </View>
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
  contentContainer: {
    padding: 20,
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
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  pageTitle: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 28,
    fontFamily: 'Poppins-Regular',
  },
  pageSubtitle: {
    color: '#AEB6BF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  resultsCard: {
    backgroundColor: '#FBBF24',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  resultsValue: {
    color: '#333',
    fontSize: 48,
    fontFamily: 'Poppins-Regular',
  },
  resultsLabel: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
  },
  calculatorContainer: {
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#2E2E2E' : '#EAECEE',
  },
  iconColor: {
    color: theme === 'dark' ? '#FBBF24' : '#566573',
  },
  inputLabel: {
    flex: 1,
    marginLeft: 15,
    color: theme === 'dark' ? '#EAEAEA' : '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#2E2E2E' : '#EAECEE',
    borderRadius: 15,
  },
  counterButton: {
    padding: 10,
  },
  counterValue: {
    color: theme === 'dark' ? '#FFFFFF' : '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 15,
  },
});

export default CarbonFootprintScreen;
