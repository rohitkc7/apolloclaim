import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import * as ImagePicker from 'expo-image-picker'

const patternData = [
  { label: 'RIB', value: 'rib' },
  { label: 'Steer', value: 'steer' },
  { label: 'LUG', value: 'lug' },
  { label: 'Semilug', value: 'semilug' },
  { label: 'Block', value: 'block' },
]

const defectAreaData = [
  { label: 'SIDEWALL', value: 'sidewall' },
  { label: 'BEAD', value: 'bead' },
  { label: 'TREAD', value: 'tread' },
  { label: 'INTERIOR', value: 'interior' },
]

const defectNameData = [
  { label: 'Sidewall Impact', value: 'sidewall-impact' },
  { label: 'Rim damage (Non lock ring side - Bead Area)', value: 'rim-damage' },
  { label: 'Broken bead', value: 'broken-bead' },
  { label: 'Tread through cut / Subsequent burst', value: 'tread-through-cut' },
  { label: 'Deflation damage', value: 'deflation-damage' },
  {
    label: 'Mounting/Demounting damage (Bead Area)',
    value: 'mounting-demounting-damage',
  },
  {
    label: 'Sidewall Bulge due to Impact /Injury',
    value: 'sidewall-bulge-impact',
  },
  { label: 'Tread impact', value: 'tread-impact' },
  { label: 'Sidewall through cut', value: 'sidewall-through-cut' },
  {
    label: 'Tread Shoulder Bulge / Subsequent Burst',
    value: 'tread-shoulder-bulge',
  },
  { label: 'Sidewall Scoring / Dual touching', value: 'sidewall-scoring' },
  { label: 'Bead Bulge / Burst', value: 'bead-bulge-burst' },
  { label: 'Sidewall Bulge', value: 'sidewall-bulge' },
  { label: 'Breaker / Belt Bulge', value: 'breaker-belt-bulge' },
  { label: 'Turn-up bulge / Crack', value: 'turn-up-bulge-crack' },
  { label: 'Casing Unwrap', value: 'casing-unwrap' },
  { label: 'Lockring damage (Bead Area)', value: 'lockring-damage' },
  {
    label: 'Circumferential crack at shoulder / SWOT',
    value: 'circumferential-crack-shoulder',
  },
  { label: 'Tread / Crown bulge', value: 'tread-crown-bulge' },
  { label: 'Loose / Wild bead wire', value: 'loose-wild-bead-wire' },
  { label: 'Innerliner bulge', value: 'innerliner-bulge' },
  {
    label: 'Foreign material cured in interior',
    value: 'foreign-material-cured',
  },
  { label: 'Chafer bulge/ Sepearation', value: 'chafer-bulge-separation' },
  { label: 'Rim digging (Bead Area)', value: 'rim-digging' },
  { label: 'Burnt bead', value: 'burnt-bead' },
  {
    label: 'Sidewall bulge - PCR (open carcass splice)',
    value: 'sidewall-bulge-pcr',
  },
  { label: 'Loose cords in innerliner', value: 'loose-cords-innerliner' },
  {
    label: 'Open / Leakage / Pinch splice in Tube',
    value: 'open-leakage-pinch-splice-tube',
  },
  { label: 'Rat bitten Tube', value: 'rat-bitten-tube' },
  {
    label: 'Ply bulge at shoulder (Interior) /Burst',
    value: 'ply-bulge-shoulder-interior',
  },
  {
    label: 'Neglected Tread Cut (Non Through)',
    value: 'neglected-tread-cut-non-through',
  },
  {
    label: 'Sidewall throughvented (Pinhole)',
    value: 'sidewall-throughvented',
  },
  {
    label: 'Crack near rim cushion / Rim Line Crack',
    value: 'crack-near-rim-cushion',
  },
  {
    label: 'Mold Fold / Buckled / Wrinkled Material (Tube)',
    value: 'mold-fold-buckled-wrinkled-tube',
  },
  { label: 'Blisters in sidewall', value: 'blisters-in-sidewall' },
  {
    label: 'Sidewall damaged in transit',
    value: 'sidewall-damaged-in-transit',
  },
  { label: 'Flow crack in sidewall', value: 'flow-crack-sidewall' },
  {
    label: 'Pin Holes / Micro Holes (Tube)',
    value: 'pin-holes-micro-holes-tube',
  },
  {
    label: 'Tyre failure  caused by complaint in tube',
    value: 'tyre-failure-caused-by-complaint-in-tube',
  },
  {
    label: 'Sidewall bulge due to undulation',
    value: 'sidewall-bulge-due-to-undulation',
  },
  {
    label: 'Valve shaft out of base (Metal to Rubber)',
    value: 'valve-shaft-out-of-base',
  },
]

const Form3 = ({ formData, onChange, onPic1Change }) => {
  const [value, setValue] = useState(null)
  const [isFocus, setIsFocus] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [camera, setCamera] = useState(null)

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
        <Text style={styles.inputLabel}>Pattern</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={patternData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.pattern}
          onChange={(item) => onChange('pattern', item.value)}
        />
        <Text style={styles.inputLabel}>Defect Area</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={defectAreaData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.defectArea}
          onChange={(item) => onChange('defectArea', item.value)}
        />
        <Text style={styles.inputLabel}>Defect Name</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={defectNameData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={formData.defectName}
          onChange={(item) => onChange('defectName', item.value)}
        />
      </View>
      {/* <View style={styles.container}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View> */}
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 16,
  },
})
export default Form3
