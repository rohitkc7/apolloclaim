import React from 'react'
import {  StyleSheet  } from 'react-native'
import AllClaim from './src/components/AllClaim'
import AddClaim from './src/components/AddClaim'
import SingleClaim from './src/components/SingleClaim'
import EditClaim from './src/components/EditClaim'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Toast from 'react-native-toast-message';


const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AllClaim">
        <Stack.Screen
          name="AllClaim"
          component={AllClaim}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddClaim" component={AddClaim} />
        <Stack.Screen name="SingleClaim" component={SingleClaim} />
        <Stack.Screen name="EditClaim" component={EditClaim} />
      </Stack.Navigator>
      <Toast />

    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
})

export default App
