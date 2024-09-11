import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

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

const companyName =[
  {label: 'Apollo' , value: 'Apollo'},
  {label: 'MRF' , value: 'MRF'},
  {label: 'JK', vlaue: 'JK'},
  {label: 'CEAT', value: 'CEAT'},
  {label: 'MAXXIS', value: 'MAXXIS'},
  {label: 'Bridgestone', value: 'Bridgestone'},
  {label: 'Goodyear', value: 'Goodyear'},
  {label: 'Continental', value: 'Continental'},
  {label: 'Others', value: 'Others'},
]

const createNsdData = () => {
  const data = [];
  for (let i = 0; i <= 50; i++) {
    const label = i.toString();
    const value = (i / 10).toFixed(1);
    data.push({ label, value });
  }
  return data;
};

const nsdData = {
  nsd1: createNsdData(),
  nsd2: createNsdData(),
  nsd3: createNsdData(),
};
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
  });

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
        data={tyreSizeData}
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
        style={[styles.dropdown, isFocus.plyRating && { borderColor: 'blue' }]}
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
        style={[styles.dropdown, isFocus.companyName && { borderColor: 'blue' }]}
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
              style={[styles.dropdown, focusState[field] && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={nsdData[field]} // Access data from the object
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
