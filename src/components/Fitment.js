import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const Fitment = ({ navigation }) => (
  <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={22} color="#1a1a1a" />
      </TouchableOpacity>
      <Text style={styles.title}>Fitment Survey</Text>
    </View>

    <View style={styles.center}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="fact-check" size={44} color="#2E7D32" />
      </View>
      <Text style={styles.comingSoon}>Coming Soon</Text>
      <Text style={styles.sub}>Fitment survey feature is under development.</Text>
    </View>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f8' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f5f5f8', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  iconWrap: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  comingSoon: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  sub:        { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 21 },
})

export default Fitment
