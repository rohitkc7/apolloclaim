import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'

// Stepper Component
const NSDStepper = ({ field, value, onChange }) => {
  // Increment or decrement the value by 0.1
  const handleIncrement = () => {
    const newValue = Math.min(50.0, parseFloat(value || 0) + 0.1).toFixed(1)
    onChange(field, newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(0.1, parseFloat(value || 0) - 0.1).toFixed(1)
    onChange(field, newValue)
  }

  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity onPress={handleDecrement} style={styles.stepperButton}>
        <Text style={styles.stepperText}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={value}
        editable={false} // Disable manual input for consistency
        placeholder="Enter NSD"
      />
      <TouchableOpacity onPress={handleIncrement} style={styles.stepperButton}>
        <Text style={styles.stepperText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  stepperText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: 100,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
  },
})

export default NSDStepper
