import React, { useRef } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { tyreSizeData, tyreSizeMapping, plyRating, companyName } from './tyreData'

const getTyreSizes = (segment) =>
  tyreSizeMapping[segment] ? tyreSizeData.filter(i => tyreSizeMapping[segment].includes(i.value)) : tyreSizeData

const Field = ({ label, children }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
)

const StyledInput = ({ forwardRef, label, returnKeyType = 'next', onSubmitEditing, ...props }) => (
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

const DropField = ({ label, data, value, onChange, placeholder }) => (
  <Field label={label}>
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selectedText}
      inputSearchStyle={styles.searchInput}
      containerStyle={styles.dropdownContainer}
      data={data}
      search
      maxHeight={280}
      labelField="label"
      valueField="value"
      placeholder={placeholder || 'Select item'}
      searchPlaceholder="Search..."
      value={value}
      onChange={item => onChange(item.value)}
    />
  </Field>
)

const Form1 = ({ formData, onChange }) => {
  const brandRef  = useRef(null)
  const serialRef = useRef(null)
  const mouldRef  = useRef(null)
  const nsd2Ref   = useRef(null)
  const nsd3Ref   = useRef(null)

  return (
    <View style={styles.card}>
      <DropField
        label="Tyre Size"
        data={getTyreSizes(formData.segment)}
        value={formData.tyreSize}
        onChange={v => onChange('tyreSize', v)}
        placeholder="Select tyre size"
      />

      <DropField
        label="Ply Rating"
        data={plyRating}
        value={formData.plyRating}
        onChange={v => onChange('plyRating', v)}
        placeholder="Select ply rating"
      />

      <DropField
        label="Company Name"
        data={companyName}
        value={formData.companyName}
        onChange={v => onChange('companyName', v)}
        placeholder="Select company"
      />

      <StyledInput
        forwardRef={brandRef}
        label="Brand Name"
        placeholder="e.g. Apollo, CEAT"
        value={formData.brandName}
        onChangeText={v => onChange('brandName', v)}
        onSubmitEditing={() => serialRef.current?.focus()}
      />

      <StyledInput
        forwardRef={serialRef}
        label="Serial Number"
        placeholder="Tyre serial number"
        value={formData.serialNumber}
        onChangeText={v => onChange('serialNumber', v)}
        onSubmitEditing={() => mouldRef.current?.focus()}
      />

      <StyledInput
        forwardRef={mouldRef}
        label="Mould No."
        placeholder="Mould number"
        value={formData.mouldNo}
        onChangeText={v => onChange('mouldNo', v)}
        onSubmitEditing={() => {}}
      />

      {/* NSD row */}
      <Field label="NSD Readings (mm)">
        <View style={styles.nsdRow}>
          {[
            { field: 'nsd1', placeholder: 'NSD 1', ref: null,    next: nsd2Ref },
            { field: 'nsd2', placeholder: 'NSD 2', ref: nsd2Ref, next: nsd3Ref },
            { field: 'nsd3', placeholder: 'NSD 3', ref: nsd3Ref, next: null    },
          ].map(({ field, placeholder, ref, next }) => (
            <TextInput
              key={field}
              ref={ref}
              style={styles.nsdInput}
              placeholder={placeholder}
              placeholderTextColor="#bbb"
              keyboardType="decimal-pad"
              returnKeyType={next ? 'next' : 'done'}
              blurOnSubmit={!next}
              value={formData[field]}
              onChangeText={v => onChange(field, v)}
              onSubmitEditing={() => next?.current?.focus()}
            />
          ))}
        </View>
      </Field>
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
    fontSize: 13, fontWeight: '600', color: '#555',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4,
  },
  input: {
    height: 48, borderWidth: 1.5, borderColor: '#e8e8e8',
    borderRadius: 10, paddingHorizontal: 14, fontSize: 15,
    color: '#1a1a1a', backgroundColor: '#fafafa',
  },
  dropdown: {
    height: 48, borderWidth: 1.5, borderColor: '#e8e8e8',
    borderRadius: 10, paddingHorizontal: 14, backgroundColor: '#fafafa',
  },
  dropdownContainer: { borderRadius: 12, borderWidth: 1, borderColor: '#e8e8e8' },
  placeholder: { fontSize: 15, color: '#bbb' },
  selectedText: { fontSize: 15, color: '#1a1a1a' },
  searchInput: { height: 40, fontSize: 14, borderColor: '#eee' },

  nsdRow: { flexDirection: 'row', gap: 10 },
  nsdInput: {
    flex: 1, height: 48, borderWidth: 1.5, borderColor: '#e8e8e8',
    borderRadius: 10, paddingHorizontal: 10, fontSize: 15,
    color: '#1a1a1a', backgroundColor: '#fafafa', textAlign: 'center',
  },
})

export default Form1
