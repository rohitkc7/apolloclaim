import Login from './src/components/Login'
import Signup from './src/components/Signup'
import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import HomeApollo from './src/components/HomeApollo'
import AllClaim from './src/components/AllClaim'
import AddClaim from './src/components/AddClaim'
import SingleClaim from './src/components/SingleClaim'
import EditClaim from './src/components/EditClaim'
import Fitment from './src/components/Fitment'
import FitmentTracking from './src/components/FitmentTracking'
import Profile from './src/components/Profile'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Toast from 'react-native-toast-message'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons' // or another icon library you prefer

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
    <Stack.Screen name="AllClaim" component={AllClaim} />
    <Stack.Screen name="SingleClaim" component={SingleClaim} />
    <Stack.Screen name="EditClaim" component={EditClaim} />
  </Stack.Navigator>
)

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="AllClaim"
    screenOptions={({ navigation }) => ({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            // Handle profile icon press - navigate to profile or show options
            navigation.navigate('Profile')
          }}
        >
          <Ionicons name="person-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    })}
  >
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
    <Drawer.Screen name="Scrap Summary" component={AllClaim} />
    <Drawer.Screen name="Fitment Survey" component={Fitment} />
    <Drawer.Screen name="Fitment Tracking" component={FitmentTracking} />
    <Drawer.Screen name="Login" component={Login} />
    <Drawer.Screen name="SignUp" component={Signup} />
    <Drawer.Screen name="Profile" component={Profile} />
  </Drawer.Navigator>
)

const App = () => {
  return (
    <NavigationContainer>
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
