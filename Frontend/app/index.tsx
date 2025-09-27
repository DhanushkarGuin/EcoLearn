import {View, StyleSheet} from "react-native";
import {Link} from "expo-router";

const Index = () =>{
  return(
    <View>
      <Link href="/signup" style={styles.signup}>Signup</Link>
      <Link href="/login" style={styles.signup}>Login</Link>
      <Link href="/continueAs" style={styles.signup}>Continue As</Link>
      <Link href="/photo_clicker" style={styles.signup}>Plantograhy</Link>
      <Link href="/StudentPage" style={styles.signup}>StudentPage</Link>
      <Link href="/Teacher" style={styles.signup}>TeacherPage</Link>
      <Link href="/School" style={styles.signup}>SchoolPage</Link>
      <Link href="/Rewards" style={styles.signup}>RewardsPage</Link>
      <Link href="/PointsBalance" style={styles.signup}>PointsBalancePage</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  signup:{
    top:100
  }
})

export default Index;