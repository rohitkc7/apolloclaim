import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
const segmentData = [
  { label: 'TBB', value: 'TBB' },
  { label: 'TBR', value: 'TBR' },
  { label: 'LTB', value: 'LTB' },
  { label: 'LTR', value: 'LTR' },
  { label: 'SCV', value: 'SCV' },
  { label: 'PCR', value: 'PCR' },
  { label: '2W', value: '2W' },
  { label: 'T,rear', value: 'T_REAR' },
  { label: 'T,front', value: 'T_FRONT' },
  { label: 'OTR', value: 'OTR' },
]
const Form = ({ formData, onChange }) => {
  const [isFocus, setIsFocus] = useState({
    segment: false,
    tyreSize: false,
    plyRating: false,
  })

  const handleFocus = (field) => {
    setIsFocus((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field) => {
    setIsFocus((prev) => ({ ...prev, [field]: false }))
  }


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
       <Text style={styles.inputLabel}>Segment</Text>
      <Dropdown
        style={[styles.dropdown, isFocus.segment && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={segmentData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus.segment ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={formData.segment}
        onFocus={() => handleFocus('segment')}
        onBlur={() => handleBlur('segment')}
        onChange={(item) => handleChange('segment', item.value)}
      />

      <Text style={styles.inputLabel}>Application</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('application', text)}
        placeholder="Enter Application Name"
        value={formData.application}
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
