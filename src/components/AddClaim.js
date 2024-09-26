import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import Form from './Form'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
import { insertClaim } from './databaseOperation'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import * as MediaLibrary from 'expo-media-library'

const initialFormData = {
  location: '',
  customerName: '',
  segment: '',
  application: '',
  tyreSize: '',
  plyRating: '',
  brandName: '',
  companyName: '',
  serialNumber: '',
  mouldNo: '',
  nsd1: '',
  nsd2: '',
  nsd3: '',
  pattern: '',
  defectArea: '',
  defectName: '',
  photos: [],
  date: '',
}

const AddClaim = ({ navigation }) => {
  const [formData, setFormData] = useState(initialFormData)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    resetForm()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      resetForm()
    }, []),
  )

  const resetForm = () => {
    setFormData(initialFormData)
    setCurrentPage(1)
  }

  const handleFormChange = (fieldName, value) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }))
  }

  const handlePhotoSelection = (photoBase64) => {
    setFormData((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, photoBase64],
    }))
  }

  const submitData = async () => {
    try {
      const date = new Date().toISOString()
      const updatedFormData = { ...formData, date }

      console.log('Form Data:', updatedFormData)

      // Check if photos exist and save them to the gallery
      if (updatedFormData.photos && updatedFormData.photos.length > 0) {
        await savePhotosToGallery(updatedFormData.photos)
      }

      const insertId = await insertClaim(updatedFormData)
      setFormData(initialFormData)

      Toast.show({
        text1: 'Success',
        text2: 'Claim saved successfully!',
        type: 'success',
      })

      setTimeout(() => {
        navigation.navigate('HomeApollo')
      }, 2000)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const savePhotosToGallery = async (photos) => {
    const { status } = await MediaLibrary.requestPermissionsAsync()

    if (status === 'granted') {
      try {
        for (let photoUri of photos) {
          await MediaLibrary.createAssetAsync(photoUri)
        }
        console.log('Photos saved to gallery!')
      } catch (error) {
        console.error('Error saving photo to gallery:', error)
      }
    } else {
      console.log('Gallery permission not granted')
    }
  }

  const renderFormTitle = () => {
    switch (currentPage) {
      case 1:
        return 'Customer and Application Details'
      case 2:
        return 'Tyre Details'
      case 3:
        return 'Complaint Detail and Pictures'
      case 4:
        return 'Preview and Submit'
      default:
        'Fill the details to add new Claim'
    }
  }

  const renderForm = () => {
    switch (currentPage) {
      case 1:
        return <Form formData={formData} onChange={handleFormChange} />
      case 2:
        return <Form1 formData={formData} onChange={handleFormChange} />
      case 3:
        return (
          <Form2
            formData={formData}
            onChange={handleFormChange}
            onPhotoSelect={handlePhotoSelection}
          />
        )
      case 4:
        return <Form3 formData={formData} onChange={handleFormChange} />
      default:
        return null
    }
  }

  const validateForm1 = () => {
    const emptyFields = []

    if (!formData.location) emptyFields.push('Location')
    if (!formData.customerName) emptyFields.push('Customer Name')
    if (!formData.segment) emptyFields.push('Segment')
    if (!formData.application) emptyFields.push('Application')

    if (emptyFields.length > 0) {
      const message = `${emptyFields.join(', ')} ${
        emptyFields.length > 1 ? 'are' : 'is'
      } required!`
      Toast.show({
        text1: 'Error',
        text2: message,
        type: 'error',
      })
      return false
    }
    return true
  }
  const validateForm2 = () => {
    const emptyFields = []

    if (!formData.tyreSize) emptyFields.push('Tyre Size')
    if (!formData.plyRating) emptyFields.push('Ply Rating')
    if (!formData.companyName) emptyFields.push('Company Name')
    if (!formData.brandName) emptyFields.push('Brand Name')
    if (!formData.serialNumber) emptyFields.push('Serial Number')
    if (!formData.mouldNo) emptyFields.push('Mould No')
    if (!formData.nsd1) emptyFields.push('NSD 1')
    if (!formData.nsd2) emptyFields.push('NSD 2')
    if (!formData.nsd3) emptyFields.push('NSD 3')

    if (emptyFields.length > 0) {
      const message = `${emptyFields.join(', ')} ${
        emptyFields.length > 1 ? 'are' : 'is'
      } required!`
      Toast.show({
        text1: 'Error',
        text2: message,
        type: 'error',
      })
      return false
    }
    return true
  }

  const validateForm3 = () => {
    const emptyFields = []

    if (!formData.pattern) emptyFields.push('Pattern')
    if (!formData.defectArea) emptyFields.push('Defect Area')
    if (!formData.defectName) emptyFields.push('Defect Name')

    if (emptyFields.length > 0) {
      const message = `${emptyFields.join(', ')} ${
        emptyFields.length > 1 ? 'are' : 'is'
      } required!`
      Toast.show({
        text1: 'Error',
        text2: message,
        type: 'error',
      })
      return false
    }
    return true
  }
  const validateAllForms = () => {
    return validateForm1() && validateForm2() && validateForm3()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View>
          <Text style={styles.titleText}>{renderFormTitle()}</Text>
          {renderForm()}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={
              currentPage === 4
                ? () => {
                    if (validateAllForms()) {
                      submitData() // Full validation before submit
                    }
                  }
                : () => {
                    if (currentPage === 1 && validateForm1()) {
                      setCurrentPage(2) // Move to form 2
                    } else if (currentPage === 2 && validateForm2()) {
                      setCurrentPage(3) // Move to form 3
                    } else if (currentPage === 3 && validateForm3()) {
                      setCurrentPage(4) // Move to preview/submit
                    }
                  }
            }
          >
            <Text style={styles.buttonText}>
              {currentPage === 4
                ? 'Submit'
                : currentPage === 3
                  ? 'Preview'
                  : 'Next'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {},
  titleText: {
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#5C2C92',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 40,
    margin: 20,
    marginTop: 40,
  },
  prevButton: {
    backgroundColor: '#5C2C92',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 40,
    margin: 20,
    marginTop: 2,
  },
  buttonText: {
    color: 'white',
  },
})

export default AddClaim
