import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { auth, firestore } from '../../firebaseConfig'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { sendPasswordResetEmail, signOut } from 'firebase/auth'
import { useUser } from '../context/UserContext'

const InfoRow = ({ icon, label, value, iconBg = '#f0e8ff', iconColor = '#5C2C92' }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIconWrap, { backgroundColor: iconBg }]}>
      <MaterialIcons name={icon} size={17} color={iconColor} />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
)

const ActionRow = ({ icon, label, color = '#5C2C92', bg = '#f0e8ff', onPress, destructive }) => (
  <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.actionIconWrap, { backgroundColor: bg }]}>
      <MaterialIcons name={icon} size={17} color={color} />
    </View>
    <Text style={[styles.actionLabel, destructive && styles.actionLabelDestructive]}>{label}</Text>
    <MaterialIcons name="chevron-right" size={20} color="#ddd" />
  </TouchableOpacity>
)

const Profile = ({ navigation }) => {
  const { userProfile, isAdmin, isApproved } = useUser()
  const [claimCount, setClaimCount] = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) { setLoading(false); return }

    getDocs(query(
      collection(firestore, 'claims'),
      where('userId', '==', user.uid),
    ))
      .then(snap => setClaimCount(snap.size))
      .catch(() => setClaimCount(0))
      .finally(() => setLoading(false))
  }, [])

  const handleChangePassword = () => {
    Alert.alert(
      'Reset Password',
      `A reset link will be sent to ${auth.currentUser?.email}`,
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

  const displayName = userProfile?.username || auth.currentUser?.email?.split('@')[0] || 'User'
  const initials    = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : '—'

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Purple hero banner ──────────────────────────── */}
        <View style={styles.hero}>
          {/* Back button */}
          <TouchableOpacity style={styles.heroBackBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Avatar */}
          <View style={[styles.avatarRing, isAdmin && styles.avatarRingAdmin]}>
            <View style={[styles.avatarCircle, isAdmin && styles.avatarCircleAdmin]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          </View>

          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroEmail}>{auth.currentUser?.email}</Text>

          {/* Role + approval badges */}
          <View style={styles.heroBadges}>
            {isAdmin ? (
              <View style={styles.badgeAdmin}>
                <MaterialIcons name="shield" size={12} color="#fff" />
                <Text style={styles.badgeAdminText}>ADMINISTRATOR</Text>
              </View>
            ) : (
              <View style={styles.badgeUser}>
                <MaterialIcons name="person" size={12} color="#5C2C92" />
                <Text style={styles.badgeUserText}>USER</Text>
              </View>
            )}
            {isApproved && !isAdmin && (
              <View style={styles.badgeApproved}>
                <MaterialIcons name="check-circle" size={12} color="#2E7D32" />
                <Text style={styles.badgeApprovedText}>APPROVED</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Stats row ──────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <MaterialIcons name="assignment" size={20} color="#5C2C92" />
            </View>
            <Text style={styles.statNumber}>{claimCount ?? '—'}</Text>
            <Text style={styles.statLabel}>Claims{'\n'}Submitted</Text>
          </View>

          <View style={[styles.statCard, styles.statCardMiddle]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#e8f5e9' }]}>
              <MaterialIcons name="calendar-month" size={20} color="#2E7D32" />
            </View>
            <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{memberSince.split(' ')[0]}</Text>
            <Text style={styles.statLabel}>{memberSince.split(' ')[1] || ''}{'\n'}Joined</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: isAdmin ? '#e3f2fd' : '#f0e8ff' }]}>
              <MaterialIcons
                name={isAdmin ? 'admin-panel-settings' : 'verified-user'}
                size={20}
                color={isAdmin ? '#1565C0' : '#5C2C92'}
              />
            </View>
            <Text style={[styles.statNumber, { fontSize: 14, color: isAdmin ? '#1565C0' : '#5C2C92' }]}>
              {isAdmin ? 'Admin' : 'User'}
            </Text>
            <Text style={styles.statLabel}>Account{'\n'}Role</Text>
          </View>
        </View>

        {/* ── Account Info ───────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Info</Text>
          <InfoRow
            icon="person-outline"
            label="Username"
            value={userProfile?.username}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="email"
            label="Email"
            value={userProfile?.email ?? auth.currentUser?.email}
            iconBg="#e8f0fe"
            iconColor="#1565C0"
          />
        </View>

        {/* ── Security ───────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <ActionRow
            icon="lock-reset"
            label="Change Password"
            onPress={handleChangePassword}
          />
        </View>

        {/* ── Admin section (admin only) ─────────────────── */}
        {isAdmin && (
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: '#1565C0' }]}>Administration</Text>
            <ActionRow
              icon="admin-panel-settings"
              label="User Management"
              color="#1565C0"
              bg="#e3f2fd"
              onPress={() => navigation.navigate('AdminPanel')}
            />
            <View style={styles.divider} />
            <ActionRow
              icon="list-alt"
              label="View All Claims"
              color="#1565C0"
              bg="#e3f2fd"
              onPress={() => navigation.navigate('AllClaim')}
            />
          </View>
        )}

        {/* ── Sign Out ───────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <MaterialIcons name="logout" size={18} color="#B71C1C" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Apollo Claims v1.0.1</Text>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  scroll: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f8' },

  // ── Hero banner
  hero: {
    backgroundColor: '#5C2C92',
    alignItems: 'center',
    paddingTop: 16, paddingBottom: 32, paddingHorizontal: 24,
  },
  heroBackBtn: {
    alignSelf: 'flex-start',
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatarRingAdmin: { borderColor: '#FFD700' },
  avatarCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarCircleAdmin: { backgroundColor: 'rgba(255,215,0,0.2)' },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: '#fff' },
  heroName:  { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14 },
  heroBadges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },

  badgeAdmin: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeAdminText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  badgeUser: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  badgeUserText: { color: '#5C2C92', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  badgeApproved: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#e8f5e9',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  badgeApprovedText: { color: '#2E7D32', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },

  // ── Stats row
  statsRow: {
    flexDirection: 'row', gap: 0,
    marginHorizontal: 16, marginTop: -16, marginBottom: 16,
  },
  statCard: {
    flex: 1, backgroundColor: '#fff', alignItems: 'center',
    paddingVertical: 18, paddingHorizontal: 8,
    borderRadius: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    borderRightWidth: 1, borderRightColor: '#f0f0f0',
  },
  statCardMiddle: {},
  statIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f0e8ff',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#5C2C92', lineHeight: 26 },
  statLabel:  { fontSize: 11, color: '#aaa', marginTop: 3, textAlign: 'center', lineHeight: 15 },

  // ── Cards
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 14,
    paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardTitle: {
    fontSize: 12, fontWeight: '700', color: '#aaa',
    textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6,
  },
  divider: { height: 1, backgroundColor: '#f5f5f5', marginHorizontal: 16 },

  // Info row
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 14 },
  infoIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoText:  { flex: 1 },
  infoLabel: { fontSize: 11, color: '#bbb', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '600', marginTop: 2 },

  // Action row
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, gap: 14,
  },
  actionIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionLabel:            { flex: 1, fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
  actionLabelDestructive: { color: '#B71C1C' },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginHorizontal: 16, marginTop: 4,
    borderWidth: 1.5, borderColor: '#fdecea',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  logoutText: { fontSize: 15, color: '#B71C1C', fontWeight: '700' },

  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 20 },
})

export default Profile
