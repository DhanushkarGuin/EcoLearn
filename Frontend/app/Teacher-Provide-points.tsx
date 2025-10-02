import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput, Alert, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from 'expo-router'

const TEACHERS_DATA_KEY = '@school_teachers';
const STUDENTS_DATA_KEY = '@school_students';

interface Teacher { id: string; name: string; class: string; points: number; }
interface Student { id: string; name: string; class: string; points: number; }

// Mock data to initialize if storage is empty
const MOCK_TEACHER: Teacher = { id: 't2', name: 'Mr. Smith', class: '10-B', points: 850 };
const MOCK_STUDENTS: Student[] = [
    { id: 's1', name: 'Alex Doe', class: '10-B', points: 500 },
    { id: 's2', name: 'Jane Roe', class: '10-B', points: 650 },
    { id: 's3', name: 'John Public', class: '10-B', points: 420 },
];

const TeacherPointsDistributionScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [pointsToDistribute, setPointsToDistribute] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // In a real app, you would load the specific logged-in teacher
    const teachersJson = await AsyncStorage.getItem(TEACHERS_DATA_KEY);
    if (teachersJson) setTeacher(JSON.parse(teachersJson).find((t: Teacher) => t.id === MOCK_TEACHER.id) || MOCK_TEACHER);
    else setTeacher(MOCK_TEACHER);

    const studentsJson = await AsyncStorage.getItem(STUDENTS_DATA_KEY);
    if (studentsJson) setStudents(JSON.parse(studentsJson));
    else {
      await AsyncStorage.setItem(STUDENTS_DATA_KEY, JSON.stringify(MOCK_STUDENTS));
      setStudents(MOCK_STUDENTS);
    }
  };

  const handlePointChange = (studentId: string, value: string) => {
    setPointsToDistribute(prev => ({ ...prev, [studentId]: value.replace(/[^0-9]/g, '') }));
  };

  const handleDistribute = async () => {
    if (!teacher) return;

    const totalPointsToGive = Object.values(pointsToDistribute).reduce((sum, pts) => sum + (parseInt(pts, 10) || 0), 0);

    if (totalPointsToGive <= 0) {
      Alert.alert("No Points", "Please enter points to distribute.");
      return;
    }
    if (totalPointsToGive > teacher.points) {
      Alert.alert("Insufficient Points", `You only have ${teacher.points} points to distribute.`);
      return;
    }

    // Update students
    const updatedStudents = students.map(student => {
        const pointsToAdd = parseInt(pointsToDistribute[student.id], 10) || 0;
        return { ...student, points: student.points + pointsToAdd };
    });

    // Update teacher
    const updatedTeacher = { ...teacher, points: teacher.points - totalPointsToGive };

    // In a real app, you would get all teachers, update one, and save all.
    // For this simulation, we just update our mock teacher state.
    setTeacher(updatedTeacher);
    setStudents(updatedStudents);
    await AsyncStorage.setItem(STUDENTS_DATA_KEY, JSON.stringify(updatedStudents));
    // Here you'd update the full teacher list in storage as well.

    Alert.alert("Success", `${totalPointsToGive} points have been distributed.`);
    setPointsToDistribute({});
  };

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const styles = getStyles(theme);
  const headerIconColor = theme === 'dark' ? '#FFFFFF' : '#121212';

  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
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

            <View style={styles.titleContainer}>
                <Text style={styles.pageTitle}>Distribute Points</Text>
                <Text style={styles.pointsText}>Your Balance: {teacher?.points || 0}</Text>
            </View>

            <FlatList
                data={students}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>Current: {item.points} pts</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            value={pointsToDistribute[item.id] || ''}
                            onChangeText={(value) => handlePointChange(item.id, value)}
                            keyboardType="numeric"
                            placeholderTextColor="#888"
                        />
                    </View>
                )}
            />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleDistribute}>
                    <Text style={styles.submitButtonText}>Distribute</Text>
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
    titleContainer: { paddingHorizontal: 20, marginBottom: 15 },
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular' },
    pointsText: { color: '#FBBF24', fontSize: 16, fontFamily: 'Poppins-Regular', marginTop: 5 },
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 10 },
    cardTitle: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 18, fontFamily: 'Poppins-Regular' },
    cardSubtitle: { color: '#AEB6BF', fontSize: 14, fontFamily: 'Poppins-Regular', marginTop: 3 },
    input: { backgroundColor: theme === 'dark' ? '#2E2E2E' : '#F0F0F0', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 10, padding: 10, fontSize: 16, fontFamily: 'Poppins-Regular', width: 80, textAlign: 'center' },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: theme === 'dark' ? '#2E2E2E' : '#EAECEE' },
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

export default TeacherPointsDistributionScreen;
