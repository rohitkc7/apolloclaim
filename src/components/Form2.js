import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

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
const Form2 = ({ formData, onChange }) => {
  const [focusState, setFocusState] = useState({
    nsd1: false,
    nsd2: false,
    nsd3: false,
  });
  const handleFocus = (field) => {
    setFocusState((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusState((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value) => {
    onChange(field, value);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
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
  );
};

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
