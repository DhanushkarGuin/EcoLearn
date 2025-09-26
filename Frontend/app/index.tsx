import {View, StyleSheet} from "react-native";
import {Link} from "expo-router";

const Index = () =>{
  return(
    <View>
      <Link href="/signup" style={styles.signup}>Signup</Link>
      <Link href="/login" style={styles.signup}>Login</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  signup:{
    top:100
  }
})

export default Index;