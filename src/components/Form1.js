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
const tyreSizeData = [
  { label: '7.00-15', value: '7.00-15' },
  { label: '7.00-16', value: '7.00-16' },
  { label: '7.50-16', value: '7.50-16' },
  { label: '8.25-16', value: '8.25-16' },
  { label: '10.00-20', value: '10.00-20' },
  { label: '11.00-20', value: '11.00-20' },
  { label: '12.00-20', value: '12.00-20' },
  { label: '14.00-20', value: '14.00-20' },
  { label: '295/95D20', value: '295/95D20' },
  { label: '8.25-20', value: '8.25-20' },
  { label: '9.00-20', value: '9.00-20' },
  { label: '10.00R20', value: '10.00R20' },
  { label: '295/80R22.5', value: '295/80R22.5' },
  { label: '295/90R20', value: '295/90R20' },
  { label: '9.00R20', value: '9.00R20' },
  { label: '8.25R20', value: '8.25R20' },
  { label: '145 R12 LT', value: '145 R12 LT' },
  { label: '165 R14 LT', value: '165 R14 LT' },
  { label: '215/75 R16', value: '215/75 R16' },
  { label: '7.00 R15', value: '7.00 R15' },
  { label: '7.00 R16', value: '7.00 R16' },
  { label: '215/75 R15', value: '215/75 R15' },
  { label: '215/75 R17.5', value: '215/75 R17.5' },
  { label: '225/75 R17.5', value: '225/75 R17.5' },
  { label: '235/75 R17.5', value: '235/75 R17.5' },
  { label: '7.50 R16', value: '7.50 R16' },
  { label: '215/75 R15', value: '215/75 R15' },
]

const plyRating = [
  { label: '8', value: '8' },
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '16' },
  { label: '18', value: '18' },
  { label: '20', value: '20' },
]

const Form1 = ({ formData, onChange }) => {
  const [valueSegment, setValueSegment] = useState(null)
  const [valueTyreSize, setValueTyreSize] = useState(null)
  const [valuePlyRating, setValuePlyRating] = useState(null)
  const [value, setValue] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  const handleSegmentChange = (segmentValue) => {
    onChange('segment', segmentValue)
  }

  const handleTyreSizeChange = (tyreSizeValue) => {
    onChange('tyreSize', tyreSizeValue) // Update formData with selected tyreSize
  }

  const handlePlyRatingChange = (plyRatingValue) => {
    onChange('plyRating', plyRatingValue) // Update formData with selected plyRating
  }

  const renderLabel = () => {
    if (valueSegment || isFocus) {
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
        <Text style={styles.inputLabel}>Segment</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={segmentData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={valueSegment}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => handleSegmentChange(item.value)}
        />
        <Text style={styles.inputLabel}>Application</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('application', text)}
          placeholder="Enter Application Name"
          value={formData.application}
        />
        <Text style={styles.inputLabel}>Tyre Size</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={tyreSizeData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={valueTyreSize}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => handleTyreSizeChange(item.value)}
        />
        <Text style={styles.inputLabel}>Ply Rating</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={plyRating}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placehoder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={valuePlyRating}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => handlePlyRatingChange(item.value)}
        />

        <Text style={styles.inputLabel}>Company Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('companyName', text)}
          placeholder="Enter Company Name"
          value={formData.companyName}
        />
        <Text style={styles.inputLabel}>Brand Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('brandName', text)}
          placeholder="Enter Brand Name"
          value={formData.brandName}
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

export default Form1
