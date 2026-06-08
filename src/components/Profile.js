import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { auth, firestore } from '../../firebaseConfig'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { sendPasswordResetEmail, signOut } from 'firebase/auth'

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrap}>
      <MaterialIcons name={icon} size={18} color="#5C2C92" />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
)

const Profile = () => {
  const [userData, setUserData]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [claimCount, setClaimCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser
        if (!user) { setLoading(false); return }

        const [userSnap, claimsSnap] = await Promise.all([
          getDoc(doc(firestore, 'Users', user.uid)),
          getDocs(query(collection(firestore, 'claims'), where('userId', '==', user.uid))),
        ])

        if (userSnap.exists()) setUserData(userSnap.data())
        setClaimCount(claimsSnap.size)
      } catch (e) {
        console.error('Error fetching profile:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChangePassword = () => {
    Alert.alert(
      'Reset Password',
      `A password reset link will be sent to ${auth.currentUser?.email}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, auth.currentUser.email)
              Alert.alert('Sent', 'Check your inbox for the reset link.')
            } catch (e) {
              Alert.alert('Error', e.message)
            }
          },
        },
      ],
    )
  }

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut(auth) },
    ])
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C2C92" />
      </View>
    )
  }

  const displayName = userData?.username || auth.currentUser?.email?.split('@')[0] || 'User'
  const initials    = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.emailSub}>{auth.currentUser?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{claimCount}</Text>
            <Text style={styles.statLabel}>Claims{'\n'}Submitted</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Info</Text>
          <InfoRow icon="person-outline"  label="Username" value={userData?.username} />
          <InfoRow icon="email"           label="Email"    value={userData?.email ?? auth.currentUser?.email} />
        </View>

        {/* Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <TouchableOpacity style={styles.actionRow} onPress={handleChangePassword}>
            <View style={styles.actionIconWrap}>
              <MaterialIcons name="lock-reset" size={18} color="#5C2C92" />
            </View>
            <Text style={styles.actionText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color="#B71C1C" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  scroll: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Avatar
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatarCircle:  {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#5C2C92', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#5C2C92', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: '#fff' },
  displayName:    { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  emailSub:       { fontSize: 13, color: '#999', marginTop: 4 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statNumber: { fontSize: 32, fontWeight: '800', color: '#5C2C92' },
  statLabel:  { fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' },

  // Info card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardTitle: {
    fontSize: 12, fontWeight: '700', color: '#aaa',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 14 },
  infoIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f0e8ff', alignItems: 'center', justifyContent: 'center',
  },
  infoText:  { flex: 1 },
  infoLabel: { fontSize: 11, color: '#aaa', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '600', marginTop: 2 },

  // Action row
  actionRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 14,
  },
  actionIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f0e8ff', alignItems: 'center', justifyContent: 'center',
  },
  actionText: { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 4,
    borderWidth: 1.5, borderColor: '#fdecea',
  },
  logoutText: { fontSize: 15, color: '#B71C1C', fontWeight: '700' },
})

export default Profile
