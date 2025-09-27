import React from 'react';
import { StyleSheet, Text, View, SafeAreaView,Image } from 'react-native';
import RoleButton from '../components/RoleButton';

const RoleSelectionScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
       source={require("../assets/images/logo-2.png")}
  style={styles.logo}></Image>
      <View style={styles.container}>
          {/* Use the 'Poppins-Bold' font for this title */}
        <Text style={styles.title}>You are a?</Text>

        <RoleButton
          title="Student"
          style={styles.studentButton}
          textStyle={styles.studentButtonText}
          // 👇 Place your image in the assets folder and update the path
          imageSource={require('../assets/images/student.png')}
          onPress={() => console.log('Student selected')}
        />

        <RoleButton
          title="Teacher"
          style={styles.teacherButton}
          textStyle={styles.teacherButtonText}
          // 👇 Place your image in the assets folder and update the path
          imageSource={require('../assets/images/teacher.png')}
          onPress={() => console.log('Teacher selected')}
        />

        <RoleButton
          title="School"
          style={styles.principalButton}
          textStyle={styles.principalButtonText}
          // 👇 Place your image in the assets folder and update the path
          imageSource={require('../assets/images/school.png')}
          onPress={() => console.log('Principal selected')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
 // Add this to your styles object
logo: {
  height: 100, // You can adjust the height as needed
  width: 100, 
  backgroundColor: "#f8f9fa",
  resizeMode: 'contain', // Ensures the logo scales correctly without distortion
  marginTop: 5, // Adds space from the top of the screen
  marginLeft: -10, // Aligns it nicely with the buttons
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Poppins-Regular",
    color: '#343A40',
    marginBottom: 5,
  },
  studentButton: {
    backgroundColor: '#f5d061',
  },
  studentButtonText: {
    color: '#2a363b',
  },
  teacherButton: {
    backgroundColor: '#cf4647',
  },
  teacherButtonText: {
    color: '#2a363b',
  },
  principalButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  principalButtonText: {
    color: '#2a363b',
  },
});

export default RoleSelectionScreen;
