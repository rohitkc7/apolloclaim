import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import {
  tyreSizeData,
  tyreSizeMapping,
  plyRating,
  companyName,
} from './tyreData'

const getTyreSizes = (segment) => {
  if (tyreSizeMapping[segment]) {
    return tyreSizeData.filter((item) =>
      tyreSizeMapping[segment].includes(item.value),
    )
  }
  return tyreSizeData
}

const Form1 = ({ formData, onChange }) => {
  const [isFocus, setIsFocus] = useState({
    segment: false,
    tyreSize: false,
    plyRating: false,
  })

  const handleNsdChange = (field, value) => {
    // Directly update form data on change
    onChange(field, value)
  }

  const handleFocus = (field) => {
    setIsFocus((prev) => ({ ...prev, [field]: true }))
  }

  const handleChange = (field, value) => {
    onChange(field, value)
  }
  const handleBlur = (field) => {
    setIsFocus((prev) => ({ ...prev, [field]: false }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.inputLabel}>Tyre Size</Text>
        <Dropdown
          style={[styles.dropdown, isFocus.tyreSize && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={getTyreSizes(formData.segment)}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus.tyreSize ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={formData.tyreSize}
          onFocus={() => handleFocus('tyreSize')}
          onBlur={() => handleBlur('tyreSize')}
          onChange={(item) => handleChange('tyreSize', item.value)}
        />

        <Text style={styles.inputLabel}>Ply Rating</Text>
        <Dropdown
          style={[
            styles.dropdown,
            isFocus.plyRating && { borderColor: 'blue' },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={plyRating}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus.plyRating ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={formData.plyRating}
          onFocus={() => handleFocus('plyRating')}
          onBlur={() => handleBlur('plyRating')}
          onChange={(item) => handleChange('plyRating', item.value)}
        />
        <Text style={styles.inputLabel}>Company Name</Text>
        <Dropdown
          style={[
            styles.dropdown,
            isFocus.companyName && { borderColor: 'blue' },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={companyName}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus.plyRating ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={formData.companyName}
          onFocus={() => handleFocus('companyName')}
          onBlur={() => handleBlur('companyName')}
          onChange={(item) => handleChange('companyName', item.value)}
        />
        <Text style={styles.inputLabel}>Brand Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('brandName', text)}
          placeholder="Enter Brand Name"
          value={formData.brandName}
        />
        <Text style={styles.inputLabel}>Serial Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('serialNumber', text)}
          placeholder="Enter Serial Number"
          value={formData.serialNumber}
        />
        <Text style={styles.inputLabel}>Mould No.</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('mouldNo', text)}
          placeholder="Enter Mould No."
          value={formData.mouldNo}
        />
        {/* NSD Input Fields */}
        {['nsd1', 'nsd2', 'nsd3'].map((field) => (
          <View key={field} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{field.toUpperCase()}</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="Enter value"
              value={formData[field]} // Use formData for values directly
              onChangeText={(value) => handleNsdChange(field, value)} // Update directly
            />
          </View>
        ))}
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
    borderRadius: 8,
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
