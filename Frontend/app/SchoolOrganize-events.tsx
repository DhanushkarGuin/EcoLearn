import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image,
  FlatList, Modal, TextInput, Alert, StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_STORAGE_KEY = '@school_events';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  fee: number;
}

const SchoolPrincipalEventsScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventFee, setEventFee] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
        if (jsonValue) setEvents(JSON.parse(jsonValue));
    } catch (e) {
        Alert.alert("Error", "Failed to load events.");
    }
  };

  const handleCreateEvent = async () => {
    if (!eventName || !eventDate || !eventFee) {
      Alert.alert('Missing Info', 'Please fill out at least the name, date, and fee.');
      return;
    }
    const newEvent: Event = {
      id: Date.now().toString(),
      name: eventName,
      description: eventDesc,
      date: eventDate,
      fee: parseInt(eventFee, 10) || 0,
    };
    try {
        const updatedEvents = [...events, newEvent];
        await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
        setEvents(updatedEvents); // Refresh the list
        setModalVisible(false);
        // Reset form
        setEventName(''); setEventDesc(''); setEventDate(''); setEventFee('');
    } catch (e) {
        Alert.alert("Error", "Failed to create event.");
    }
  };

  // --- THIS IS THE CORRECTED DELETE FUNCTION ---
  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to permanently delete this event? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Filter out the event to be deleted
              const updatedEvents = events.filter(event => event.id !== eventId);
              // 2. Save the new, shorter list to AsyncStorage
              await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
              // 3. Update the state to force the screen to re-render with the event removed
              setEvents(updatedEvents);
            } catch (e) {
              Alert.alert("Error", "Failed to delete the event.");
            }
          }
        }
      ]
    );
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
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.pageTitle}>Organize Events</Text>
                <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                    <Feather name="plus" size={20} color="#333" />
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={events}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardDate}>{item.date}</Text>
                        <Text style={styles.cardDesc}>{item.description}</Text>
                        <View style={styles.cardFooter}>
                          <Text style={styles.cardFee}>Fee: {item.fee} points</Text>
                          <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
                            <Feather name="trash-2" size={20} color="#E74C3C" />
                          </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No events organized yet.</Text>}
            />
        </View>

        {/* --- Create Event Modal --- */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create New Event</Text>
                    <TextInput style={styles.input} placeholder="Event Name" value={eventName} onChangeText={setEventName} placeholderTextColor="#888" />
                    <TextInput style={styles.input} placeholder="Date (e.g., Oct 25, 2025)" value={eventDate} onChangeText={setEventDate} placeholderTextColor="#888" />
                    <TextInput style={styles.input} placeholder="Registration Fee (in points)" value={eventFee} onChangeText={setEventFee} keyboardType="numeric" placeholderTextColor="#888" />
                    <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={eventDesc} onChangeText={setEventDesc} multiline placeholderTextColor="#888" />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleCreateEvent}><Text style={styles.submitButtonText}>Submit</Text></TouchableOpacity>
                    </View>
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
    titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    pageTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 28, fontFamily: 'Poppins-Regular' },
    createButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBBF24', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
    createButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16, marginLeft: 5 },
    card: { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 15, elevation: 3 },
    cardTitle: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 20, fontFamily: 'Poppins-Regular' },
    cardDate: { color: '#FBBF24', fontSize: 14, fontFamily: 'Poppins-Regular', marginVertical: 5 },
    cardDesc: { color: '#AEB6BF', fontSize: 14, fontFamily: 'Poppins-Regular', marginBottom: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    cardFee: { color: theme === 'dark' ? '#EAEAEA' : '#121212', fontSize: 16, fontFamily: 'Poppins-Regular' },
    emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContent: { width: '90%', backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', borderRadius: 20, padding: 25 },
    modalTitle: { color: theme === 'dark' ? '#FFFFFF' : '#121212', fontSize: 22, fontFamily: 'Poppins-Regular', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: theme === 'dark' ? '#2E2E2E' : '#F0F0F0', color: theme === 'dark' ? '#FFFFFF' : '#121212', borderRadius: 10, padding: 15, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 15 },
    textArea: { height: 100, textAlignVertical: 'top' },
    modalButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    cancelButton: { padding: 15, borderRadius: 10 },
    cancelButtonText: { color: '#AEB6BF', fontFamily: 'Poppins-Regular', fontSize: 16 },
    submitButton: { backgroundColor: '#FBBF24', padding: 15, borderRadius: 10 },
    submitButtonText: { color: '#333', fontFamily: 'Poppins-Regular', fontSize: 16 },
});

export default SchoolPrincipalEventsScreen;
