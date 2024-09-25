import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import {
  tyreSizeData,
  tyreSizeMapping,
  plyRating,
  companyName,
} from './tyreData'

const defaultTyreSizes = tyreSizeData.map((item) => item.value)

const getTyreSizes = (segment) => {
  if (tyreSizeMapping[segment]) {
    return tyreSizeData.filter((item) =>
      tyreSizeMapping[segment].includes(item.value),
    )
  }
  return tyreSizeData
}

const createNsdData = () => {
  const data = []
  for (let i = 0; i <= 50; i++) {
    const value = (i / 100).toFixed(2)
    const label = value.toString()
    data.push({ label, value })
  }
  return data
}

const nsdData = {
  nsd1: createNsdData(),
  nsd2: createNsdData(),
  nsd3: createNsdData(),
}
const Form1 = ({ formData, onChange }) => {
  const [isFocus, setIsFocus] = useState({
    segment: false,
    tyreSize: false,
    plyRating: false,
  })
  const [focusState, setFocusState] = useState({
    nsd1: false,
    nsd2: false,
    nsd3: false,
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
        {Object.keys(nsdData).map((field) => (
          <View key={field}>
            <Text style={styles.inputLabel}>{field.toUpperCase()}</Text>
            <Dropdown
              style={[
                styles.dropdown,
                focusState[field] && { borderColor: 'blue' },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={nsdData[field]}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!focusState[field] ? 'Select item' : '...'}
              searchPlaceholder="Search..."
              value={formData[field]}
              onFocus={() => handleFocus(field)}
              onBlur={() => handleBlur(field)}
              onChange={(item) => handleChange(field, item.value)}
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
