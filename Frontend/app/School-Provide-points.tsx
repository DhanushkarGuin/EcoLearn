import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image,
  FlatList, TextInput, Alert, StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const TEACHERS_DATA_KEY = '@school_teachers';
import { router } from 'expo-router';

interface Teacher {
  id: string;
  name: string;
  class: string;
  points: number;
}

// Mock data to initialize if storage is empty
const MOCK_TEACHERS: Teacher[] = [
    { id: 't1', name: 'Mrs. Davis', class: '10-A', points: 1000 },
    { id: 't2', name: 'Mr. Smith', class: '10-B', points: 850 },
    { id: 't3', name: 'Ms. Jones', class: '9-C', points: 1200 },
];

const SchoolPointsAllocationScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [pointsToGive, setPointsToGive] = useState('');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const jsonValue = await AsyncStorage.getItem(TEACHERS_DATA_KEY);
    if (jsonValue) {
      setTeachers(JSON.parse(jsonValue));
    } else {
      // If no data, load mock data into storage and state
      await AsyncStorage.setItem(TEACHERS_DATA_KEY, JSON.stringify(MOCK_TEACHERS));
      setTeachers(MOCK_TEACHERS);
    }
  };

  const handleProvidePoints = async () => {
    if (!selectedTeacherId || !pointsToGive || parseInt(pointsToGive, 10) <= 0) {
      Alert.alert('Invalid Input', 'Please select a teacher and enter a valid number of points.');
      return;
    }

    const points = parseInt(pointsToGive, 10);
    const updatedTeachers = teachers.map(teacher => {
        if (teacher.id === selectedTeacherId) {
            return { ...teacher, points: teacher.points + points };
        }
        return teacher;
    });

    await AsyncStorage.setItem(TEACHERS_DATA_KEY, JSON.stringify(updatedTeachers));
    setTeachers(updatedTeachers);
    Alert.alert('Success!', `${points} points have been allocated to the selected teacher.`);
    setSelectedTeacherId(null);
    setPointsToGive('');
  };

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const styles = getStyles(theme);
  const headerIconColor = theme === 'dark' ? '#FFFFFF' : '#121212';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/images/logo-2.png')} style={styles.logo} />
                <TouchableOpacity onPress={toggleTheme}>
                    <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButtonCircle} onPress={() => router.back()}>
                  <Feather name="chevron-left" size={24} color={headerIconColor}/>
                </TouchableOpacity>
            </View>

            <Text style={styles.pageTitle}>Allocate Points</Text>

            <FlatList
                data={teachers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    const isSelected = item.id === selectedTeacherId;
                    return (
                        <TouchableOpacity style={[styles.card, isSelected && styles.selectedCard]} onPress={() => setSelectedTeacherId(item.id)}>
                            <View>
                                <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>{item.name}</Text>
                                <Text style={[styles.cardSubtitle, isSelected && styles.selectedText]}>Class: {item.class}</Text>
                            </View>
                            <Text style={[styles.pointsText, isSelected && styles.selectedText]}>{item.points} pts</Text>
                        </TouchableOpacity>
                    );
                }}
                ListHeaderComponent={<Text style={styles.listHeader}>Select a Teacher:</Text>}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter points to provide..."
                    value={pointsToGive}
                    onChangeText={setPointsToGive}
                    keyboardType="numeric"
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleProvidePoints}>
                    <Text style={styles.submitButtonText}>Provide</Text>
                </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5' },
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
      logo: {
  height: 100, // You can adjust the height as needed
  width: 100, 
  backgroundColor: 'none',
  resizeMode: 'contain', // Ensures the logo scales correctly without distortion
  marginTop: 5, // Adds space from the top of the screen
  marginLeft: -10, // Aligns it nicely with the buttons
      },
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular', paddingHorizontal: 20, marginBottom: 5 },
    listHeader: { color: '#AEB6BF', fontSize: 16, fontFamily: 'Poppins-Regular', paddingHorizontal: 20, marginBottom: 10 },
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 10, borderWidth: 2, borderColor: 'transparent' },
    selectedCard: { borderColor: '#FBBF24' },
    selectedText: { color: '#FBBF24' },
    cardTitle: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 18, fontFamily: 'Poppins-Regular' },
    cardSubtitle: { color: '#AEB6BF', fontSize: 14, fontFamily: 'Poppins-Regular', marginTop: 3 },
    pointsText: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 18, fontFamily: 'Poppins-Regular' },
    inputContainer: { padding: 20, borderTopWidth: 1, borderTopColor: theme === 'dark' ? '#2E2E2E' : '#EAECEE' },
    input: { backgroundColor: theme === 'dark' ? '#2E2E2E' : '#F0F0F0', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 10, padding: 15, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 15 },
    submitButton: { backgroundColor: '#FBBF24', padding: 15, borderRadius: 10, alignItems: 'center' },
    submitButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16 },
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
}
});

export default SchoolPointsAllocationScreen;
