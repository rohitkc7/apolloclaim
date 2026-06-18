import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

const PendingApproval = () => (
  <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
    <View style={styles.content}>
      <Image
        source={require('../../assets/apollologo-1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.iconWrap}>
        <MaterialIcons name="hourglass-top" size={44} color="#E65100" />
      </View>

      <Text style={styles.title}>Account Pending</Text>
      <Text style={styles.body}>
        Your account is awaiting administrator approval. You will be able to access the
        app as soon as an admin reviews your request.
      </Text>

      <View style={styles.emailChip}>
        <MaterialIcons name="email" size={14} color="#5C2C92" />
        <Text style={styles.emailText} numberOfLines={1}>
          {auth.currentUser?.email}
        </Text>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut(auth)}>
        <MaterialIcons name="logout" size={16} color="#B71C1C" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#f5f5f8' },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  logo: { width: 160, height: 64, marginBottom: 36 },
  iconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#fff3e0', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#E65100', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  title: {
    fontSize: 26, fontWeight: '800', color: '#1a1a1a',
    marginBottom: 14, textAlign: 'center',
  },
  body: {
    fontSize: 15, color: '#666', textAlign: 'center',
    lineHeight: 23, marginBottom: 24,
  },
  emailChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f0e8ff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, marginBottom: 36,
  },
  emailText: { fontSize: 13, color: '#5C2C92', fontWeight: '600' },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fdecea', borderRadius: 14,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  signOutText: { color: '#B71C1C', fontWeight: '700', fontSize: 15 },
})

export default PendingApproval
