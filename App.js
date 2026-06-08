import { LogBox } from 'react-native'
LogBox.ignoreLogs([
  'Due to changes in Androids permission requirements, Expo Go can no longer provide full access to the media library',
])

import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer, DrawerActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Toast from 'react-native-toast-message'
import { onAuthStateChanged, signOut } from 'firebase/auth'

import { auth } from './firebaseConfig'
import HomeApollo      from './src/components/HomeApollo'
import AllClaim        from './src/components/AllClaim'
import AddClaim        from './src/components/AddClaim'
import SingleClaim     from './src/components/SingleClaim'
import EditClaim       from './src/components/EditClaim'
import Fitment         from './src/components/Fitment'
import FitmentTracking from './src/components/FitmentTracking'
import Profile         from './src/components/Profile'
import Login           from './src/components/Login'
import Signup          from './src/components/Signup'

const Drawer = createDrawerNavigator()
const Stack  = createStackNavigator()
const AuthStack = createStackNavigator()

// ─── Navigators ──────────────────────────────────────────────────────────────

const MainStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="HomeApollo"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="HomeApollo"  component={HomeApollo} />
    <Stack.Screen name="AddClaim"    component={AddClaim}
      options={{ headerShown: true, title: 'New Claim', headerBackTitle: '' }} />
    <Stack.Screen name="AllClaim"    component={AllClaim}
      options={{ headerShown: true, title: 'All Claims', headerBackTitle: '' }} />
    <Stack.Screen name="SingleClaim" component={SingleClaim}
      options={{ headerShown: true, headerBackTitle: '' }} />
    <Stack.Screen name="EditClaim"   component={EditClaim}
      options={{ headerShown: true, title: 'Edit Claim', headerBackTitle: '' }} />
  </Stack.Navigator>
)

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login"  component={Login} />
    <AuthStack.Screen name="Signup" component={Signup} />
  </AuthStack.Navigator>
)

// ─── Custom Drawer Content ────────────────────────────────────────────────────

const DRAWER_ITEMS = [
  { label: 'Home',                 screen: 'Home',                 icon: 'home'          },
  { label: 'Scrap Analysis',       screen: 'Scrap Analysis',       icon: 'assignment-add' },
  { label: 'Complaint Management', screen: 'Complaint Management', icon: 'list-alt'      },
  { label: 'Scrap Summary',        screen: 'Scrap Summary',        icon: 'bar-chart'     },
  { label: 'Fitment Survey',       screen: 'Fitment Survey',       icon: 'fact-check'    },
  { label: 'Fitment Tracking',     screen: 'Fitment Tracking',     icon: 'track-changes' },
]

const CustomDrawer = (props) => {
  const { state, navigation } = props
  const activeRouteName = state.routes[state.index]?.name
  const user = auth.currentUser
  const displayName = user?.email?.split('@')[0] ?? 'User'
  const initials    = displayName.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    signOut(auth)
    navigation.dispatch(DrawerActions.closeDrawer())
  }

  return (
    <View style={styles.drawerRoot}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <Image
          source={require('./assets/apollologo-1.png')}
          style={styles.drawerLogo}
          resizeMode="contain"
        />
        <View style={styles.drawerUser}>
          <View style={styles.drawerAvatar}>
            <Text style={styles.drawerAvatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.drawerUserName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.drawerUserEmail} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Menu items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
        showsVerticalScrollIndicator={false}
      >
        {DRAWER_ITEMS.map((item) => {
          const isActive = activeRouteName === item.screen
          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.drawerItem, isActive && styles.drawerItemActive]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.drawerItemIcon, isActive && styles.drawerItemIconActive]}>
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={isActive ? '#fff' : '#5C2C92'}
                />
              </View>
              <Text style={[styles.drawerItemLabel, isActive && styles.drawerItemLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.drawerFooterItem}
          onPress={() => { navigation.navigate('Profile'); navigation.dispatch(DrawerActions.closeDrawer()) }}
        >
          <MaterialIcons name="person-outline" size={20} color="#555" />
          <Text style={styles.drawerFooterLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.drawerFooterItem, styles.logoutItem]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#B71C1C" />
          <Text style={styles.logoutLabel}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Drawer Navigator ─────────────────────────────────────────────────────────

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: { width: 300, backgroundColor: 'transparent' },
    }}
  >
    <Drawer.Screen name="Home"                 component={MainStackNavigator} />
    <Drawer.Screen name="Scrap Analysis"       component={AddClaim} />
    <Drawer.Screen name="Complaint Management" component={AllClaim} />
    <Drawer.Screen name="Scrap Summary"        component={AllClaim} />
    <Drawer.Screen name="Fitment Survey"       component={Fitment} />
    <Drawer.Screen name="Fitment Tracking"     component={FitmentTracking} />
    <Drawer.Screen name="Profile"              component={Profile} />
  </Drawer.Navigator>
)

// ─── Root App ─────────────────────────────────────────────────────────────────

const App = () => {
  const [user, setUser]       = useState(undefined) // undefined = still checking

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return unsub
  }, [])

  if (user === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f8' }}>
        <ActivityIndicator size="large" color="#5C2C92" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthNavigator />}
      <Toast />
    </NavigationContainer>
  )
}

// ─── Drawer Styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  drawerRoot: {
    flex: 1, backgroundColor: '#fff',
    borderTopRightRadius: 24, borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  drawerHeader: {
    backgroundColor: '#5C2C92', paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20,
  },
  drawerLogo:  { width: 140, height: 50, marginBottom: 20 },
  drawerUser:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  drawerAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  drawerAvatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  drawerUserName:   { fontSize: 15, fontWeight: '700', color: '#fff' },
  drawerUserEmail:  { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  drawerScroll: { paddingHorizontal: 12, paddingTop: 12 },
  drawerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 12, marginBottom: 2,
  },
  drawerItemActive: { backgroundColor: '#f0e8ff' },
  drawerItemIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#f0e8ff', alignItems: 'center', justifyContent: 'center',
  },
  drawerItemIconActive: { backgroundColor: '#5C2C92' },
  drawerItemLabel:       { fontSize: 14, color: '#333', fontWeight: '500' },
  drawerItemLabelActive: { color: '#5C2C92', fontWeight: '700' },

  drawerFooter: {
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    paddingHorizontal: 12, paddingVertical: 16, gap: 4,
  },
  drawerFooterItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12,
  },
  drawerFooterLabel: { fontSize: 14, color: '#555', fontWeight: '500' },
  logoutItem: {},
  logoutLabel: { fontSize: 14, color: '#B71C1C', fontWeight: '600' },
})

export default App
