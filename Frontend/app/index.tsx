import {View, StyleSheet} from "react-native";
import {Link} from "expo-router";

const Index = () =>{
  return(
    <View>
      <Link href="/signup" style={styles.signup}>Signup</Link>
      <Link href="/login" style={styles.signup}>Login</Link>
      <Link href="/continueAs" style={styles.signup}>Continue As</Link>
      <Link href="/PointsBalance" style={styles.signup}>PointsBalancePage</Link>
      <Link href="/carbonFootprint" style={styles.signup}>CarbonFootprint</Link>
      <Link href="/photo_clicker" style={styles.signup}>Plantograhy</Link>
      <Link href="/StudentPage" style={styles.signup}>StudentPage</Link>
      <Link href="/Student-events" style={styles.signup}>StudentEventsPage</Link>
      <Link href="/Teacher" style={styles.signup}>TeacherPage</Link>
      <Link href="/Teacher-Provide-points" style={styles.signup}>TeacherProvidePointsPage</Link>
      <Link href="/TeacherManage-events" style={styles.signup}>TeacherEvents</Link>
      <Link href="/School" style={styles.signup}>SchoolPage</Link>
      <Link href="/School-Provide-points" style={styles.signup}>SchoolProvidePointsPage</Link>
      <Link href="/SchoolOrganize-events" style={styles.signup}>SchoolEvents</Link>
      <Link href="/Rewards" style={styles.signup}>RewardsPage</Link>
      <Link href="/Profile" style={styles.signup}>ProfilePage</Link>
      <Link href="/notifications" style={styles.signup}>NotificationsPage</Link>
      <Link href="/GamePlayers" style={styles.signup}>GamePlayers</Link>
      <Link href="/GameList" style={styles.signup}>Games</Link>
      
      
      
      <Link href="/disasterGame" style={styles.signup}>DisasterGame</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  signup:{
    top:100
  }
})

export default Index;