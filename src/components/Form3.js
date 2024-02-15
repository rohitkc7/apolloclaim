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

import * as ImagePicker from 'expo-image-picker'

const Form3 = ({ formData, onChange }) => {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status == !'granted') {
      Alert.alert('Permission denied'),
        `Sorry, we need camera roll permissions to upload Images.`
    } else {
      const result = await ImagePicker.launchImageLibraryAsync()
      if (!result.canceled) {
        setFile(result.uri)
        setError(null)
      }
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.inputLabel}>Defect Area</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('defectArea', text)}
          placeholder="Enter Defective Area"
          value={formData.defectArea}
        />
        <Text style={styles.inputLabel}>Defect Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('defectName', text)}
          placeholder="Enter Defective Name"
          value={formData.defectName}
        />
        {/* <Text style={styles.inputLabel}>Upload Pictures.</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChange('pic1', text)}
          placeholder="Enter Brand Name"
          value={formData.pic1}
        /> */}
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>Add Image:</Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>

        {file ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: file }} style={styles.image} />
          </View>
        ) : (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
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
    paddingLeft: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
