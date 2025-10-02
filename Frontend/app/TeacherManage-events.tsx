import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, FlatList, Modal, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Page-flow
const handleBackButton = () =>{
    router.push('/Teacher')
}

const EVENTS_STORAGE_KEY = '@school_events';

interface StudentRegistration {
    name: string;
    studentClass: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  registeredStudents?: StudentRegistration[];
}

const SchoolTeacherEventsScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const interval = setInterval(loadEvents, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadEvents = async () => {
    const jsonValue = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (jsonValue) setEvents(JSON.parse(jsonValue));
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
                <TouchableOpacity onPress={toggleTheme}>
                    <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerIconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButtonCircle} onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color={headerIconColor}/>
                </TouchableOpacity>
            </View>

            <Text style={styles.pageTitle}>Manage Events</Text>

            <FlatList
                data={events}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardDate}>{item.date}</Text>
                        </View>
                        <TouchableOpacity style={styles.manageButton} onPress={() => setSelectedEvent(item)}>
                            <Text style={styles.manageButtonText}>Manage</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No events found.</Text>}
            />
        </View>

        {/* --- NEW: MANAGEMENT MODAL --- */}
        <Modal visible={selectedEvent !== null} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Registrations</Text>
                    <Text style={styles.modalSubtitle}>{selectedEvent?.name}</Text>
                    <FlatList
                        data={selectedEvent?.registeredStudents || []}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.studentRow}>
                                <Text style={styles.studentName}>{item.name}</Text>
                                <Text style={styles.studentClass}>Class: {item.studentClass}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No students registered yet.</Text>}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedEvent(null)}>
                        <Text style={styles.closeButtonText}>Close</Text>
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
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular', paddingHorizontal: 20, marginBottom: 15 },
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 15, elevation: 3 },
    cardTitle: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 20, fontFamily: 'Poppins-Regular' },
    cardDate: { color: '#AEB6BF', fontSize: 14, fontFamily: 'Poppins-Regular', marginTop: 5 },
    manageButton: { backgroundColor: '#FBBF24', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
    manageButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16 },
    emptyText: { color: '#888', textAlign: 'center', marginTop: 20, fontFamily: 'Poppins-Regular' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContent: { width: '90%', maxHeight: '70%', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 20, padding: 25 },
    modalTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 22, fontFamily: 'Poppins-Regular', marginBottom: 5, textAlign: 'center' },
    modalSubtitle: { color: '#AEB6BF', fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 20, textAlign: 'center' },
    studentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme === 'dark' ? '#2E2E2E' : '#EAECEE', paddingVertical: 15 },
    studentName: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 16, fontFamily: 'Poppins-Regular' },
    studentClass: { color: '#AEB6BF', fontSize: 14, fontFamily: 'Poppins-Regular' },
    closeButton: { backgroundColor: '#FBBF24', padding: 15, borderRadius: 10, marginTop: 20 },
    closeButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16, textAlign: 'center' },
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

export default SchoolTeacherEventsScreen;

