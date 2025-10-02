import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, FlatList, Alert, Modal, TextInput, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // 1. Import the router hook

const EVENTS_STORAGE_KEY = '@school_events';
const STUDENT_DATA_KEY = '@student_data';

interface StudentRegistration {
    name: string;
    studentClass: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  fee: number;
  registeredStudents?: StudentRegistration[];
}

interface Student {
    name: string;
    points: number;
    registeredEventIds: string[];
}

const MOCK_STUDENT: Student = { name: "Alex Doe", points: 500, registeredEventIds: [] };

const SchoolStudentEventsScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [events, setEvents] = useState<Event[]>([]);
  const [student, setStudent] = useState<Student>(MOCK_STUDENT);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Form State
  const [registrantName, setRegistrantName] = useState('');
  const [registrantClass, setRegistrantClass] = useState('');
  
  // 2. Initialize the router
  const router = useRouter();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000); // Refresh data periodically
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const eventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (eventsJson) setEvents(JSON.parse(eventsJson));

    const studentJson = await AsyncStorage.getItem(STUDENT_DATA_KEY);
    if (studentJson) setStudent(JSON.parse(studentJson));
    else setStudent(MOCK_STUDENT); // Initialize if not present
  };

  const openRegistrationModal = (event: Event) => {
    if (student.registeredEventIds.includes(event.id)) {
        Alert.alert('Already Registered', 'You are already registered for this event.');
        return;
    }
    if (student.points < event.fee) {
      Alert.alert('Insufficient Points', `You need ${event.fee} points, but you only have ${student.points}.`);
      return;
    }
    setSelectedEvent(event);
  };

  const handleConfirmRegistration = async () => {
    if (!registrantName || !registrantClass || !selectedEvent) return;

    const updatedStudent: Student = {
        ...student,
        points: student.points - selectedEvent.fee,
        registeredEventIds: [...student.registeredEventIds, selectedEvent.id],
    };
    
    const newRegistration: StudentRegistration = { name: registrantName, studentClass: registrantClass };
    const updatedEvents = events.map(e => {
        if (e.id === selectedEvent.id) {
            return { ...e, registeredStudents: [...(e.registeredStudents || []), newRegistration] };
        }
        return e;
    });

    await AsyncStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(updatedStudent));
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));

    setStudent(updatedStudent);
    setEvents(updatedEvents);
    setSelectedEvent(null);
    setRegistrantName('');
    setRegistrantClass('');

    Alert.alert('Registration Successful!', `You have registered for ${selectedEvent.name}.`);
  };

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const styles = getStyles(theme);
  const headerIconColor = theme === 'dark' ? '#FFFFFF' : '#121212';

  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/images/logo-2.png')} style={styles.logo} />
                {/* 3. Wrap header icons for correct alignment */}
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={toggleTheme}>
                        <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backButtonCircle} onPress={() => router.back()}>
                        <Feather name="chevron-left" size={24} color={headerIconColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.pageTitle}>Upcoming Events</Text>
                <Text style={styles.pointsText}>Your Points: {student.points}</Text>
            </View>

            <FlatList
                data={events}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    const isRegistered = student.registeredEventIds.includes(item.id);
                    return (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardFee}>{item.fee} pts</Text>
                            </View>
                            <Text style={styles.cardDate}>{item.date}</Text>
                            <TouchableOpacity
                                style={[styles.registerButton, isRegistered && styles.registeredButton]}
                                onPress={() => openRegistrationModal(item)}
                                disabled={isRegistered}
                            >
                                <Text style={styles.registerButtonText}>{isRegistered ? 'Registered' : 'Register'}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>No upcoming events.</Text>}
            />
        </View>

        <Modal visible={selectedEvent !== null} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Confirm Registration</Text>
                    <Text style={styles.modalSubtitle}>for {selectedEvent?.name}</Text>
                    <TextInput style={styles.input} placeholder="Your Full Name" value={registrantName} onChangeText={setRegistrantName} placeholderTextColor="#888" />
                    <TextInput style={styles.input} placeholder="Your Class (e.g., 10-B)" value={registrantClass} onChangeText={setRegistrantClass} placeholderTextColor="#888" />
                    <TouchableOpacity style={styles.submitButton} onPress={handleConfirmRegistration}>
                        <Text style={styles.submitButtonText}>Confirm & Pay {selectedEvent?.fee} Points</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedEvent(null)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
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
    // 4. New style for the icon container
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
    titleContainer: { paddingHorizontal: 20, marginBottom: 15 },
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular' },
    pointsText: { color: '#FBBF24', fontSize: 16, fontFamily: 'Poppins-Regular', marginTop: 5 },
    card: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 15, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 20, fontFamily: 'Poppins-Regular' },
    cardFee: { color: theme === 'dark' ? '#FBBF24' : '#CF4647', fontSize: 18, fontFamily: 'Poppins-Regular' },
    cardDate: { color: '#AEB6BF', fontSize: 14, fontFamily: 'Poppins-Regular', marginVertical: 10 },
    registerButton: { backgroundColor: '#FBBF24', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    registeredButton: { backgroundColor: '#2ECC71' },
    registerButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16, fontWeight: '600' },
    emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContent: { width: '90%', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 20, padding: 25 },
    modalTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 22, fontFamily: 'Poppins-Regular', textAlign: 'center' },
    modalSubtitle: { color: '#AEB6BF', fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: theme === 'dark' ? '#2E2E2E' : '#F0F0F0', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 10, padding: 15, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 15 },
    submitButton: { backgroundColor: '#FBBF24', padding: 15, borderRadius: 10, alignItems: 'center' },
    submitButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16 },
    cancelText: { color: '#AEB6BF', fontFamily: 'Poppins-Regular', fontSize: 14, textAlign: 'center', marginTop: 15 },
});

export default SchoolStudentEventsScreen;

