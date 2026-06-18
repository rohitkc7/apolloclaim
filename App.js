import { LogBox } from 'react-native'
LogBox.ignoreLogs([
  'Due to changes in Androids permission requirements, Expo Go can no longer provide full access to the media library',
])

import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator,
} from 'react-native'
import { NavigationContainer, DrawerActions, useNavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Toast from 'react-native-toast-message'
import { signOut } from 'firebase/auth'

import { auth } from './firebaseConfig'
import { UserProvider, useUser } from './src/context/UserContext'

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
import AdminPanel      from './src/components/AdminPanel'
import PendingApproval from './src/components/PendingApproval'

const Drawer    = createDrawerNavigator()
const Stack     = createStackNavigator()
const AuthStack = createStackNavigator()

// ─── Main stack — all content screens live here ────────────────────────────────
// This gives every screen a natural "back" through the stack.

const MainStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="HomeApollo"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="HomeApollo"      component={HomeApollo} />
    <Stack.Screen name="AddClaim"        component={AddClaim} />
    <Stack.Screen name="AllClaim"        component={AllClaim} />
    <Stack.Screen name="SingleClaim"     component={SingleClaim} />
    <Stack.Screen name="EditClaim"       component={EditClaim} />
    <Stack.Screen name="Fitment"         component={Fitment} />
    <Stack.Screen name="FitmentTracking" component={FitmentTracking} />
    <Stack.Screen name="Profile"         component={Profile} />
    <Stack.Screen name="AdminPanel"      component={AdminPanel} />
  </Stack.Navigator>
)

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login"  component={Login} />
    <AuthStack.Screen name="Signup" component={Signup} />
  </AuthStack.Navigator>
)

// ─── Drawer items ─────────────────────────────────────────────────────────────
// stackScreen: the name registered in MainStackNavigator

const BASE_ITEMS = [
  { label: 'Home',                 stackScreen: 'HomeApollo',      icon: 'home'          },
  { label: 'Scrap Analysis',       stackScreen: 'AddClaim',        icon: 'assignment-add' },
  { label: 'Complaint Management', stackScreen: 'AllClaim',        icon: 'list-alt'      },
  { label: 'Scrap Summary',        stackScreen: 'AllClaim',        icon: 'bar-chart'     },
  { label: 'Fitment Survey',       stackScreen: 'Fitment',         icon: 'fact-check'    },
  { label: 'Fitment Tracking',     stackScreen: 'FitmentTracking', icon: 'track-changes' },
]
const ADMIN_ITEM = {
  label: 'User Management', stackScreen: 'AdminPanel', icon: 'admin-panel-settings',
}

// ─── Custom Drawer ─────────────────────────────────────────────────────────────

const CustomDrawer = (props) => {
  const { navigation } = props
  const { authUser, userProfile, isAdmin } = useUser()

  // Track which stack screen is currently active so we can highlight the right item.
  const activeScreen = useNavigationState(state => {
    const homeRoute = state?.routes?.find(r => r.name === 'Home')
    if (!homeRoute?.state) return 'HomeApollo'
    const s = homeRoute.state
    return s.routes[s.index ?? 0]?.name ?? 'HomeApollo'
  })

  const displayName = userProfile?.username || authUser?.email?.split('@')[0] || 'User'
  const initials    = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const drawerItems = isAdmin ? [...BASE_ITEMS, ADMIN_ITEM] : BASE_ITEMS

  const goTo = (stackScreen) => {
    // Navigate into the Home stack then close the drawer.
    navigation.navigate('Home', { screen: stackScreen })
    navigation.dispatch(DrawerActions.closeDrawer())
  }

  const handleLogout = () => {
    signOut(auth)
    navigation.dispatch(DrawerActions.closeDrawer())
  }

  return (
    <View style={styles.drawerRoot}>
      {/* Purple header */}
      <View style={styles.drawerHeader}>
        <Image
          source={require('./assets/apollologo-1.png')}
          style={styles.drawerLogo}
          resizeMode="contain"
        />
        <View style={styles.drawerUser}>
          <View style={[styles.drawerAvatar, isAdmin && styles.drawerAvatarAdmin]}>
            <Text style={styles.drawerAvatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.drawerNameRow}>
              <Text style={styles.drawerUserName} numberOfLines={1}>{displayName}</Text>
              {isAdmin && (
                <View style={styles.drawerAdminBadge}>
                  <MaterialIcons name="shield" size={9} color="#5C2C92" />
                  <Text style={styles.drawerAdminBadgeText}>ADMIN</Text>
                </View>
              )}
            </View>
            <Text style={styles.drawerUserEmail} numberOfLines={1}>{authUser?.email}</Text>
          </View>
        </View>
      </View>

      {/* Menu items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
        showsVerticalScrollIndicator={false}
      >
        {drawerItems.map((item, i) => {
          const isActive    = activeScreen === item.stackScreen
          const isAdminItem = item.stackScreen === 'AdminPanel'
          return (
            <TouchableOpacity
              key={`${item.stackScreen}-${i}`}
              style={[styles.drawerItem, isActive && styles.drawerItemActive]}
              onPress={() => goTo(item.stackScreen)}
            >
              <View style={[
                styles.drawerItemIcon,
                isActive     && styles.drawerItemIconActive,
                isAdminItem  && styles.drawerItemIconAdmin,
              ]}>
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={isActive ? '#fff' : isAdminItem ? '#1565C0' : '#5C2C92'}
                />
              </View>
              <Text style={[
                styles.drawerItemLabel,
                isActive    && styles.drawerItemLabelActive,
                isAdminItem && styles.drawerItemLabelAdmin,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.drawerFooterItem} onPress={() => goTo('Profile')}>
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

// ─── Drawer Navigator ──────────────────────────────────────────────────────────
// Only ONE screen here — Home — which is the entire stack.
// The drawer is purely a navigation panel; all back-stack logic lives in MainStackNavigator.

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: { width: 300, backgroundColor: 'transparent' },
    }}
  >
    <Drawer.Screen name="Home" component={MainStackNavigator} />
  </Drawer.Navigator>
)

// ─── App root ─────────────────────────────────────────────────────────────────

const AppRoot = () => {
  const { authUser, isApproved, loadingProfile } = useUser()

  if (authUser === undefined || (authUser !== null && loadingProfile)) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#5C2C92" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {!authUser
        ? <AuthNavigator />
        : !isApproved
          ? <PendingApproval />
          : <DrawerNavigator />}
      <Toast />
    </NavigationContainer>
  )
}

const App = () => (
  <UserProvider>
    <AppRoot />
  </UserProvider>
)

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f8' },

  drawerRoot: {
    flex: 1, backgroundColor: '#fff',
    borderTopRightRadius: 24, borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  drawerHeader: {
    backgroundColor: '#5C2C92', paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20,
  },
  drawerLogo: { width: 140, height: 50, marginBottom: 20 },
  drawerUser: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  drawerAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  drawerAvatarAdmin: { backgroundColor: 'rgba(255,255,255,0.35)', borderWidth: 1.5, borderColor: '#fff' },
  drawerAvatarText:  { fontSize: 16, fontWeight: '800', color: '#fff' },
  drawerNameRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  drawerUserName:    { fontSize: 15, fontWeight: '700', color: '#fff', flexShrink: 1 },
  drawerAdminBadge:  {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2,
  },
  drawerAdminBadgeText: { fontSize: 9, fontWeight: '800', color: '#5C2C92', letterSpacing: 0.4 },
  drawerUserEmail:      { fontSize: 12, color: 'rgba(255,255,255,0.65)' },

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
  drawerItemIconAdmin:  { backgroundColor: '#e3f2fd' },
  drawerItemLabel:       { fontSize: 14, color: '#333', fontWeight: '500' },
  drawerItemLabelActive: { color: '#5C2C92', fontWeight: '700' },
  drawerItemLabelAdmin:  { color: '#1565C0', fontWeight: '600' },

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
