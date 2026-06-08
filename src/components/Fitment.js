import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Fitment = () => {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <Text style={styles.placeholder}>Fitment Survey</Text>
        <Text style={styles.sub}>Coming soon</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeholder: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  sub:    { fontSize: 14, color: '#aaa' },
})

export default Fitment
