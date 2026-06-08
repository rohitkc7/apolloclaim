import React, { useRef } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { segmentData } from './tyreData'

const Field = ({ label, children }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
)

const StyledInput = ({
  forwardRef,
  label,
  returnKeyType = 'next',
  onSubmitEditing,
  ...props
}) => (
  <Field label={label}>
    <TextInput
      ref={forwardRef}
      style={styles.input}
      placeholderTextColor="#bbb"
      returnKeyType={returnKeyType}
      blurOnSubmit={returnKeyType === 'done'}
      onSubmitEditing={onSubmitEditing}
      {...props}
    />
  </Field>
)

const Form = ({ formData, onChange }) => {
  const customerRef = useRef(null)
  const applicationRef = useRef(null)

  return (
    <View style={styles.card}>
      <StyledInput
        label="Location"
        placeholder="e.g. Birgunj,Madhesh Province"
        value={formData.location}
        onChangeText={(v) => onChange('location', v)}
        returnKeyType="next"
        onSubmitEditing={() => customerRef.current?.focus()}
      />

      <StyledInput
        forwardRef={customerRef}
        label="Customer Name"
        placeholder="Full name of the customer"
        value={formData.customerName}
        onChangeText={(v) => onChange('customerName', v)}
        returnKeyType="next"
        onSubmitEditing={() => applicationRef.current?.focus()}
      />

      <Field label="Segment">
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          inputSearchStyle={styles.searchInput}
          containerStyle={styles.dropdownContainer}
          data={segmentData}
          search
          maxHeight={280}
          labelField="label"
          valueField="value"
          placeholder="Select segment"
          searchPlaceholder="Search..."
          value={formData.segment}
          onChange={(item) => onChange('segment', item.value)}
        />
      </Field>

      <StyledInput
        forwardRef={applicationRef}
        label="Application"
        placeholder="e.g. Long Haul, City Bus"
        value={formData.application}
        onChangeText={(v) => onChange('application', v)}
        returnKeyType="done"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldWrap: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
  },
  dropdown: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fafafa',
  },
  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  placeholder: { fontSize: 15, color: '#bbb' },
  selectedText: { fontSize: 15, color: '#1a1a1a' },
  searchInput: { height: 40, fontSize: 14, borderColor: '#eee' },
})

export default Form
