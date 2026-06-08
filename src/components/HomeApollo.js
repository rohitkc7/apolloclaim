import React, { useEffect, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  ScrollView, Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { auth, firestore } from '../../firebaseConfig'
import { collection, query, where, getDocs } from 'firebase/firestore'

const { width } = Dimensions.get('window')
const CARD_SIZE = (width - 48 - 12) / 2   // 2 columns, 16px side padding, 12px gap

const MODULES = [
  {
    title: 'Scrap Analysis',
    subtitle: 'Submit a new claim',
    screen: 'Scrap Analysis',
    icon: 'assignment-add',
    color: '#5C2C92',
    bg: '#f0e8ff',
  },
  {
    title: 'Complaint Mgmt',
    subtitle: 'View all claims',
    screen: 'Complaint Management',
    icon: 'list-alt',
    color: '#1565C0',
    bg: '#e8f0fe',
  },
  {
    title: 'Fitment Survey',
    subtitle: 'Record fitment data',
    screen: 'Fitment Survey',
    icon: 'fact-check',
    color: '#2E7D32',
    bg: '#e8f5e9',
  },
  {
    title: 'Fitment Tracking',
    subtitle: 'Track tyre status',
    screen: 'Fitment Tracking',
    icon: 'track-changes',
    color: '#E65100',
    bg: '#fff3e0',
  },
]

const HomeApollo = ({ navigation }) => {
  const [greeting, setGreeting]     = useState('')
  const [username, setUsername]     = useState('')
  const [recentCount, setRecentCount] = useState(null)

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    // Get display name from email
    const emailName = user.email?.split('@')[0] ?? ''
    setUsername(emailName.charAt(0).toUpperCase() + emailName.slice(1))

    // Count this user's claims from last 30 days
    const since = new Date(); since.setDate(since.getDate() - 30)
    getDocs(query(
      collection(firestore, 'claims'),
      where('userId', '==', user.uid),
    ))
      .then(snap => setRecentCount(snap.size))
      .catch(() => {})
  }, [])

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.username}>{username || 'Welcome'} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => navigation.openDrawer()}
          >
            <MaterialIcons name="menu" size={26} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* Stats banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statsLeft}>
            <Image
              source={require('../../assets/apollologo-1.png')}
              style={styles.bannerLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.statsRight}>
            <Text style={styles.statsNumber}>
              {recentCount === null ? '—' : recentCount}
            </Text>
            <Text style={styles.statsLabel}>Your Total{'\n'}Claims</Text>
          </View>
        </View>

        {/* Module grid */}
        <Text style={styles.sectionTitle}>Modules</Text>
        <View style={styles.grid}>
          {MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.screen}
              style={[styles.moduleCard, { backgroundColor: mod.bg }]}
              onPress={() => navigation.navigate(mod.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.moduleIcon, { backgroundColor: mod.color }]}>
                <MaterialIcons name={mod.icon} size={26} color="#fff" />
              </View>
              <Text style={[styles.moduleTitle, { color: mod.color }]}>{mod.title}</Text>
              <Text style={styles.moduleSubtitle}>{mod.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick action */}
        <Text style={styles.sectionTitle}>Quick Action</Text>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('Scrap Analysis')}
          activeOpacity={0.85}
        >
          <View style={styles.quickActionLeft}>
            <MaterialIcons name="add-circle-outline" size={28} color="#fff" />
            <View>
              <Text style={styles.quickActionTitle}>Submit New Claim</Text>
              <Text style={styles.quickActionSub}>Record a tyre defect now</Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward" size={22} color="#fff" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  scroll: { padding: 20, paddingBottom: 32 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24,
  },
  greeting:  { fontSize: 14, color: '#888' },
  username:  { fontSize: 24, fontWeight: '800', color: '#1a1a1a', marginTop: 2 },
  menuBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },

  // Stats banner
  statsBanner: {
    backgroundColor: '#5C2C92', borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 28,
    shadowColor: '#5C2C92', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  statsLeft:   { flex: 1 },
  bannerLogo:  { width: 140, height: 60 },
  statsRight:  { alignItems: 'flex-end' },
  statsNumber: { fontSize: 42, fontWeight: '900', color: '#fff', lineHeight: 46 },
  statsLabel:  { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'right', marginTop: 2 },

  // Section title
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#aaa',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14,
  },

  // Module grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  moduleCard: {
    width: CARD_SIZE, borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  moduleIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  moduleTitle:    { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  moduleSubtitle: { fontSize: 12, color: '#888' },

  // Quick action
  quickAction: {
    backgroundColor: '#5C2C92', borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#5C2C92', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  quickActionLeft:  { flexDirection: 'row', alignItems: 'center', gap: 14 },
  quickActionTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  quickActionSub:   { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
})

export default HomeApollo
