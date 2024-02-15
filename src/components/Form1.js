import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'

const Form1 = ({ formData, onChange }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.inputLabel}>Claim Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('claimTitle', text)}
          placeholder="Claim Title"
          value={formData.claimTitle}
        />
        <Text style={styles.inputLabel}>Tyre Size</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('tyreSize', text)}
          placeholder="Enter Tyre Size"
          value={formData.tyreSize}
        />

        <Text style={styles.inputLabel}>Brand Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('brandName', text)}
          placeholder="Enter Brand Name"
          value={formData.brandName}
        />
        <Text style={styles.inputLabel}>Company Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('companyName', text)}
          placeholder="Enter Company Name"
          value={formData.companyName}
        />
        <Text style={styles.inputLabel}>Serial Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('serialNumber', text)}
          placeholder="Enter Serial Number"
          value={formData.serialNumber}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  logo: {
    width: 80,
    height: 80,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputLabel: {
    paddingLeft: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})
export default Form1
