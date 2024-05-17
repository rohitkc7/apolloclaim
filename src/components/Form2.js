import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

const nsd1 = []
for (let i = 0; i <= 60; i++) {
  const label = i.toString()
  const value = (i / 10).toFixed(1)
  nsd1.push({ label, value })
}

const nsd2 = []
for (let i = 0; i <= 60; i++) {
  const label = i.toString()
  const value = (i / 10).toFixed(1)
  nsd2.push({ label, value })
}

const nsd3 = []

for (let i = 0; i <= 60; i++) {
  const label = i.toString()
  const value = (i / 10).toFixed(1)
  nsd3.push({ label, value })
}
const nsd4 = []

for (let i = 0; i <= 60; i++) {
  const label = i.toString()
  const value = (i / 10).toFixed(1)
  nsd4.push({ label, value })
}

const nsd5 = []

for (let i = 0; i <= 60; i++) {
  const label = i.toString()
  const value = (i / 10).toFixed(1)
  nsd5.push({ label, value })
}

const Form2 = ({ formData, onChange }) => {
  // const [valueNSD1, setValueNSD1] = useState(null)
  // const [valueNSD2, setValueNSD2] = useState(null)
  // const [valueNSD3, setValueNSD3] = useState(null)
  // const [valueNSD4, setValueNSD4] = useState(null)
  // const [valueNSD5, setValueNSD5] = useState(null)
  const [value, setValue] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      )
    }
    return null
  }
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
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={nsd1}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.nsd1}
          onChange={(item) => onChange('nsd1', item.value)}
        />
        <Text style={styles.inputLabel}>NSD2</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={nsd2}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.nsd2}
          onChange={(item) => onChange('nsd2', item.value)}
        />
        <Text style={styles.inputLabel}>NSD3</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={nsd3}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.nsd3}
          onChange={(item) => onChange('nsd3', item.value)}
        />
        <Text style={styles.inputLabel}>NSD4</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={nsd4}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.nsd4}
          onChange={(item) => onChange('nsd4', item.value)}
        />
        <Text style={styles.inputLabel}>NSD5</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={nsd5}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.nsd5}
          onChange={(item) => onChange('nsd5', item.value)}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingHorizontal: 20,
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
})
export default Form2
