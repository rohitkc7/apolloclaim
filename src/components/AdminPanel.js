import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { firestore } from '../../firebaseConfig'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { useUser } from '../context/UserContext'

const fmtDate = (iso) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '—' }
}

const UserCard = ({ user, onApprove, onRevoke, onPromote, onDemote }) => {
  const isAdminRole = user.role === 'admin'
  const isApproved  = user.approved || isAdminRole
  const initials = (user.username || user.email || '?')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <View style={styles.card}>
      {/* Top row: avatar + info + status dot */}
      <View style={styles.cardTop}>
        <View style={[styles.avatar, isAdminRole && styles.avatarAdmin]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.username || 'Unnamed'}
            </Text>
            {isAdminRole && (
              <View style={styles.adminBadge}>
                <MaterialIcons name="shield" size={9} color="#fff" />
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
            {user.isSelf && (
              <View style={styles.selfBadge}>
                <Text style={styles.selfBadgeText}>YOU</Text>
              </View>
            )}
          </View>
          <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
          <Text style={styles.userSince}>Joined {fmtDate(user.createdAt)}</Text>
        </View>

        <View style={[styles.statusDot, isApproved ? styles.dotGreen : styles.dotOrange]} />
      </View>

      {/* Status chip */}
      <View style={[styles.statusChip, isApproved ? styles.chipGreen : styles.chipOrange]}>
        <MaterialIcons
          name={isApproved ? 'check-circle' : 'hourglass-empty'}
          size={12}
          color={isApproved ? '#2E7D32' : '#E65100'}
        />
        <Text style={[styles.chipText, isApproved ? styles.chipTextGreen : styles.chipTextOrange]}>
          {isApproved ? 'Approved' : 'Pending Approval'}
        </Text>
      </View>

      {/* Action buttons */}
      {!user.isSelf && (
        <View style={styles.actions}>
          {isAdminRole ? (
            <TouchableOpacity style={[styles.btn, styles.btnOrange]} onPress={() => onDemote(user)}>
              <MaterialIcons name="person-remove" size={14} color="#E65100" />
              <Text style={[styles.btnText, { color: '#E65100' }]}>Remove Admin</Text>
            </TouchableOpacity>
          ) : (
            <>
              {isApproved ? (
                <TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => onRevoke(user)}>
                  <MaterialIcons name="block" size={14} color="#B71C1C" />
                  <Text style={[styles.btnText, { color: '#B71C1C' }]}>Revoke</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.btn, styles.btnPurple]} onPress={() => onApprove(user)}>
                  <MaterialIcons name="check" size={14} color="#fff" />
                  <Text style={[styles.btnText, { color: '#fff' }]}>Approve</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.btn, styles.btnBlue]} onPress={() => onPromote(user)}>
                <MaterialIcons name="admin-panel-settings" size={14} color="#1565C0" />
                <Text style={[styles.btnText, { color: '#1565C0' }]}>Make Admin</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  )
}

const AdminPanel = () => {
  const { userProfile } = useUser()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(firestore, 'Users'))
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        // Pending first, then approved users, then admins
        .sort((a, b) => {
          const score = (u) => u.role === 'admin' ? 2 : u.approved ? 1 : 0
          return score(a) - score(b)
        })
      setUsers(data)
    } catch {
      Alert.alert('Error', 'Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const patchUser = async (uid, fields, msg) => {
    try {
      await setDoc(doc(firestore, 'Users', uid), fields, { merge: true })
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, ...fields } : u))
      Alert.alert('Done', msg)
    } catch {
      Alert.alert('Error', 'Action failed. Please try again.')
    }
  }

  const handleApprove = (user) =>
    Alert.alert('Approve User', `Grant access to ${user.username || user.email}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => patchUser(user.id, { approved: true }, `${user.username || user.email} has been approved.`) },
    ])

  const handleRevoke = (user) =>
    Alert.alert('Revoke Access', `Remove access for ${user.username || user.email}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Revoke', style: 'destructive', onPress: () => patchUser(user.id, { approved: false }, `Access revoked.`) },
    ])

  const handlePromote = (user) =>
    Alert.alert('Make Admin', `Promote ${user.username || user.email} to admin? They will have full access.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Promote', onPress: () => patchUser(user.id, { role: 'admin', approved: true }, `${user.username || user.email} is now an admin.`) },
    ])

  const handleDemote = (user) =>
    Alert.alert('Remove Admin', `Remove admin privileges from ${user.username || user.email}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => patchUser(user.id, { role: 'user' }, `Admin role removed.`) },
    ])

  const pendingCount = users.filter(u => !u.approved && u.role !== 'admin').length

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>User Management</Text>
          <Text style={styles.headerSub}>{users.length} registered users</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchUsers}>
          <MaterialIcons name="refresh" size={22} color="#5C2C92" />
        </TouchableOpacity>
      </View>

      {/* Pending banner */}
      {pendingCount > 0 && !loading && (
        <View style={styles.pendingBanner}>
          <MaterialIcons name="info-outline" size={16} color="#E65100" />
          <Text style={styles.pendingBannerText}>
            {pendingCount} user{pendingCount > 1 ? 's' : ''} waiting for approval
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#5C2C92" />
          <Text style={styles.loadingText}>Loading users…</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="group" size={56} color="#ddd" />
          <Text style={styles.emptyText}>No registered users found</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={u => u.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchUsers}
          refreshing={loading}
          renderItem={({ item }) => (
            <UserCard
              user={{ ...item, isSelf: item.id === userProfile?.uid }}
              onApprove={handleApprove}
              onRevoke={handleRevoke}
              onPromote={handlePromote}
              onDemote={handleDemote}
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  list:   { padding: 14, paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  headerSub:   { fontSize: 13, color: '#999', marginTop: 2 },
  refreshBtn:  {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f0e8ff', alignItems: 'center', justifyContent: 'center',
  },

  // Pending banner
  pendingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff3e0', paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#ffe0b2',
  },
  pendingBannerText: { fontSize: 13, color: '#E65100', fontWeight: '600' },

  loadingText: { color: '#999', fontSize: 14 },
  emptyText:   { color: '#aaa', fontSize: 15, marginTop: 8 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#5C2C92', alignItems: 'center', justifyContent: 'center',
  },
  avatarAdmin: { backgroundColor: '#1565C0' },
  avatarText:  { fontSize: 16, fontWeight: '800', color: '#fff' },
  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' },
  userName:    { fontSize: 15, fontWeight: '700', color: '#1a1a1a', flexShrink: 1 },
  adminBadge:  {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#1565C0', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  adminBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  selfBadge:  {
    backgroundColor: '#5C2C92', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  selfBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  userEmail: { fontSize: 12, color: '#888', marginBottom: 2 },
  userSince: { fontSize: 11, color: '#bbb' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  dotGreen:  { backgroundColor: '#4CAF50' },
  dotOrange: { backgroundColor: '#FF9800' },

  // Status chip
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10,
  },
  chipGreen:  { backgroundColor: '#e8f5e9' },
  chipOrange: { backgroundColor: '#fff3e0' },
  chipText:        { fontSize: 12, fontWeight: '700' },
  chipTextGreen:   { color: '#2E7D32' },
  chipTextOrange:  { color: '#E65100' },

  // Buttons
  actions: { flexDirection: 'row', gap: 8 },
  btn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 9, borderRadius: 10,
  },
  btnText:   { fontSize: 13, fontWeight: '700' },
  btnPurple: { backgroundColor: '#5C2C92' },
  btnRed:    { backgroundColor: '#fdecea' },
  btnBlue:   { backgroundColor: '#e3f2fd' },
  btnOrange: { backgroundColor: '#fff3e0' },
})

export default AdminPanel
