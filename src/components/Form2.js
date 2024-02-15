import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'

const Form2 = ({ formData, onChange }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.inputLabel}>Mould No.</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('mouldNo', text)}
          placeholder="Enter Mould No."
          value={formData.mouldNo}
        />
        <Text style={styles.inputLabel}>NSD1</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('nsd1', text)}
          placeholder="Enter NSD1"
          value={formData.nsd1}
        />
        <Text style={styles.inputLabel}>NSD2</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('nsd2', text)}
          placeholder="Enter NSD2"
          value={formData.nsd2}
        />
        <Text style={styles.inputLabel}>NSD3</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('nsd3', text)}
          placeholder="Enter NSD3"
          value={formData.nsd3}
        />
        <Text style={styles.inputLabel}>NSD4</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('nsd4', text)}
          placeholder="Enter NSD4"
          value={formData.nsd4}
        />
        <Text style={styles.inputLabel}>NSD5</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('nsd5', text)}
          placeholder="Enter NSD5"
          value={formData.nsd5}
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
  titleText: {
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold',
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
export default Form2
