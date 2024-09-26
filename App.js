import Login from './src/components/Login'
import Signup from './src/components/Signup'
import React from 'react'
import { StyleSheet, Image } from 'react-native'
import HomeApollo from './src/components/HomeApollo'
import AllClaim from './src/components/AllClaim'
import AddClaim from './src/components/AddClaim'
import SingleClaim from './src/components/SingleClaim'
import EditClaim from './src/components/EditClaim'
import Fitment from './src/components/Fitment'
import FitmentTracking from './src/components/FitmentTracking'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Toast from 'react-native-toast-message'
import { createDrawerNavigator } from '@react-navigation/drawer'
import NetInfo from '@react-native-community/netinfo'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const MainStackNavigator = () => (
  <Stack.Navigator initialRouteName="HomeApollo">
    <Stack.Screen
      name="HomeApollo"
      component={HomeApollo}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="AddClaim" component={AddClaim} />
    <Stack.Screen name="SingleClaim" component={SingleClaim} />
    <Stack.Screen name="EditClaim" component={EditClaim} />
    <Stack.Screen name="AllClaim" component={AllClaim} />
  </Stack.Navigator>
)

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="AllClaim">
    <Drawer.Screen
      name="Home"
      component={MainStackNavigator}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Image
            source={require('./assets/apollo.jpg')}
            style={[styles.logo, { width: 240, height: size }]}
            resizeMode="contain"
          />
        ),
        title: '',
      }}
    />
    <Drawer.Screen name="Scrap Analysis" component={AddClaim} />
    <Drawer.Screen name="Complaint Management" component={AllClaim} />
    <Drawer.Screen name="Fitment Survey" component={Fitment} />
    <Drawer.Screen name="Fitment Tracking" component={FitmentTracking} />
    <Drawer.Screen name="Login" component={Login} />
    <Drawer.Screen name="SignUp" component={Signup} />
  </Drawer.Navigator>
)

const App = () => {
  const [isConnected, setIsConnected] = useState(true)

  // Set up NetInfo to monitor internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected)
    })

    // Clean up the listener
    return () => {
      unsubscribe()
    }
  }, [])
  return (
    <NavigationContainer>
      {/* Show connectivity warning if no internet */}
      {!isConnected && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>No internet connection</Text>
        </View>
      )}
      <DrawerNavigator />
      <Toast />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  logo: {
    width: 100,
    height: 50,
  },
})

export default App
