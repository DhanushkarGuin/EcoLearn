import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar
} from "react-native";
import React, {useState} from "react";
import { Feather } from '@expo/vector-icons';

// --- Color palettes can be shared between screens ---
const lightColors = {
  background: '#FFFFFF',
  formBackground: '#FFFFFF',
  text: '#121212',
  inputBackground: '#F0F0F0',
  inputPlaceholder: '#888888',
  buttonBackground: '#F5D061',
  buttonText: '#2A363B',
  link: '#2A363B',
  toggleInactive: '#E0E0E0',
  toggleActive: '#FBBF24',
};

const darkColors = {
  background: '#121212',
  formBackground: '#1E1E1E',
  text: '#EAEAEA',
  inputBackground: '#2E2E2E',
  inputPlaceholder: '#888888',
  buttonBackground: '#FBBF24',
  buttonText: '#121212',
  link: '#EAEAEA',
  toggleInactive: '#424242',
  toggleActive: '#FBBF24',
};

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onPress: () => void;
}

// Custom Theme Toggle Switch Component (reusable)
const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onPress }) => {
    const styles = getStyles(theme);
    const colors = theme === 'light' ? lightColors : darkColors;

    return (
        <TouchableOpacity onPress={onPress} style={styles.toggleContainer}>
            <Feather name="sun" size={18} color={theme === 'light' ? colors.buttonText : colors.text} />
            <View style={[styles.toggleCircle, theme === 'light' ? styles.toggleCircleLight : styles.toggleCircleDark]} />
            <Feather name="moon" size={18} color={theme === 'dark' ? colors.buttonText : colors.text} />
        </TouchableOpacity>
    );
}

const LoginScreen = () =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const styles = getStyles(theme);
  const colors = theme === 'light' ? lightColors : darkColors;

  return(
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.mainContainer}>
        {/* Top Image Container */}
        <View style={styles.topContainer}>
            <Image style={styles.backgroundImage} source={require("../assets/images/signupPageBackground.png")} />
            <Image
                source={require("../assets/images/logo-2.png")}
                style={styles.logo}
            />
        </View>

        {/* Bottom Form Container */}
        <View style={styles.bottomContainer}>
            <View style={styles.formHeader}>
                {/* Text changed to "Login" */}
                <Text style={styles.formTitle}>Login</Text>
                <ThemeToggle theme={theme} onPress={toggleTheme} />
            </View>

            <TextInput
            style={styles.input}
            placeholder="Enter mail..."
            placeholderTextColor={colors.inputPlaceholder}
            value={email}
            onChangeText={setEmail}
            />
            <TextInput
            style={styles.input}
            placeholder="Password..."
            placeholderTextColor={colors.inputPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />

            <View style={styles.buttonsContainer}>
                {/* Text changed to "Login" */}
                <TouchableOpacity style={styles.mainButton}>
                    <Text style={styles.mainButtonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.promptContainer}>
                  <Text style={styles.promptLink}>Forget Password</Text>
                    {/* Text changed to "Don't have an account?" */}
                    <Text style={styles.promptText}>Don't have an account?</Text>
                    <TouchableOpacity>
                        {/* Text changed to "Signup" */}
                        <Text style={styles.promptLink}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') => {
    const colors = theme === 'light' ? lightColors : darkColors;
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.formBackground,
        },
        mainContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },
        topContainer: {
            flex: 1,
        },
        backgroundImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
       logo: {
            position: 'absolute',
            top: -5,
            left: -25,
            width: 120, // Adjust size as needed
            height: 100,  // Adjust size as needed
            resizeMode: 'contain',
        },
        bottomContainer: {
            backgroundColor: colors.formBackground,
            paddingHorizontal: 25,
            paddingVertical: 30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        formHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 25,
        },
        formTitle:{ // Renamed from signupText for clarity
            color: colors.text,
            fontFamily:'Poppins-Regular',
            fontSize: 28,
        },
        input: {
            color: colors.text,
            fontFamily:'Poppins-Regular',
            backgroundColor: colors.inputBackground,
            borderRadius: 15,
            fontSize: 16,
            paddingHorizontal: 20,
            paddingVertical: 15,
            width: '100%',
            marginBottom: 20,
        },
        buttonsContainer:{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
        },
        mainButton:{ // Renamed from signupButton
            backgroundColor: colors.buttonBackground,
            borderRadius: 15,
            paddingVertical: 10,
            paddingHorizontal: 25,
        },
        mainButtonText:{ // Renamed from signupButtonText
            color: colors.buttonText,
            fontSize: 16,
            fontFamily:'Poppins-Regular'
        },
        promptContainer: { // Renamed from loginPromptContainer
            alignItems: 'flex-end',
        },
        promptText:{ // Renamed from alreadyText
            color: colors.text,
            fontFamily:'Poppins-Regular',
            fontSize: 14,
        },
        promptLink:{ // Renamed from loginButton
            fontFamily:'Poppins-Regular',
            fontSize: 14,
            color: '#b53d3e',
            textDecorationLine: 'underline',
        },
        // --- Theme Toggle Styles remain the same ---
        toggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.toggleInactive,
            borderRadius: 20,
            width: 80,
            padding: 6,
            position: 'relative',
        },
        toggleCircle: {
            position: 'absolute',
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: colors.toggleActive,
        },
        toggleCircleLight: {
            left: 5,
        },
        toggleCircleDark: {
            right: 5,
        },
    });
}

export default LoginScreen;
