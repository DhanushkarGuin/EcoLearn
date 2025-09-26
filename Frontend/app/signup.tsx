import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import React, {useState} from "react";

const Index = () =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return(
  <View>
    <View style={styles.mainContainer}>
      <Image source={require("../assets/images/signupPageBackground.png")} />
      <Text style={styles.title}>EcoLearn</Text>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Signup</Text>
        <View style={styles.inputContainer}>
          <TextInput
          style={styles.emailInput}
          placeholder="Enter Email...."
          value={email}
          onChangeText={setEmail}
          />
          <TextInput
          style={styles.passwordInput}
          placeholder="Password...."
          value={password}
          onChangeText={setPassword}
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.signupButtonContainer}>
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>
          <Text style={styles.alreadyText}>Already have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.loginButton}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
  );
}


const lightColors = {
  inputColor: '#D9D9D9',
  textColor: '#2A363B',
  backgroundColor: '#F8F6F6',
  buttonColor: '#F5D061',
  loginLinkColor: '#CF4647'
}

const darkColors = {
  inputColor: '#D9D9D9',
  textColor: '#2A363B',
  backgroundColor: '#000000',
  buttonColor: '#F5D061',
  loginLinkColor: '#CF4647'
}

const styles = StyleSheet.create({
  mainContainer:{},
  title:{
    position: "absolute",
    fontFamily:'Poppins-Regular',
    fontSize:24,
    left: 20,
    top:40,
    color: lightColors.textColor
  },
  signupContainer:{},
  inputContainer:{},
  emailInput:{
    color: lightColors.textColor,
    fontFamily:'Poppins-Regular',
    backgroundColor: lightColors.inputColor,
    borderRadius: 15,
    fontSize: 16,
    paddingLeft:20,
    width:355,
    left:10,
    top:12
  },
  passwordInput:{
    color: lightColors.textColor,
    fontFamily:'Poppins-Regular',
    backgroundColor: lightColors.inputColor,
    borderRadius: 15,
    fontSize: 16,
    paddingLeft:20,
    width:355,
    left:10,
    top:20
  },
  signupText:{
    color: lightColors.textColor,
    fontFamily:'Poppins-Regular',
    fontSize:24,
    left:15,
    top:5
  },
  buttons:{},
  signupButtonContainer:{
    backgroundColor: lightColors.buttonColor,
    borderRadius:10,
    paddingInline:20,
    paddingBlock:5,
    width:97,
    left:10,
    top: 25
  },
  signupButtonText:{
    color: lightColors.textColor,
    fontSize: 16,
    fontFamily:'Poppins-Regular'
  },
  alreadyText:{
    color: lightColors.textColor,
    fontFamily:'Poppins-Regular',
    left: 145,
    top: -5,
    fontSize: 16,
  },
  loginButton:{
    fontFamily:'Poppins-Regular',
    left: 315,
    top:-12,
    fontSize: 16,
    color: lightColors.loginLinkColor
  }
})
export default Index;