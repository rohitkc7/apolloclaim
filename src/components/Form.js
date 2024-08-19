import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'


const Form = ({ formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange(field, value)
  }

  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.inputLabel}>Location</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('location', text)}
        placeholder="Enter Location"
        value={formData.location}
      />

      <Text style={styles.inputLabel}>CustomerName</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('customerName', text)}
        placeholder="Enter Customer Name"
        value={formData.customerName}
      />
    </View>
  </SafeAreaView>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8, // Add border radius here
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  focused: {
    borderColor: 'blue',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})

export default Form
