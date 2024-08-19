import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { updateClaim } from './databaseOperation' 
import Toast from 'react-native-toast-message';

import Form from './Form'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'

import setupDatabase from './db'

const EditClaim = ({}) => {
  const route = useRoute()
  const navigation = useNavigation()

  const { claimId } = route.params

  const [claimData, setClaimData] = useState({
    location:'',
    customerName:'',
    segment: '',
    application: '',
    tyreSize: '',
    plyRating: '',
    brandName: '',
    companyName: '',
    serialNumber:'',
    mouldNo: '',
    nsd1: '',
    nsd2: '',
    nsd3: '',
    pattern: '',
    defectArea: '',
    defectName: '',
    photos: [],
  })
  useEffect(() => {
    fetchClaimDetails()
  }, [])

  const fetchClaimDetails = async () => {
    try {
      const db = await setupDatabase()
      const result = await db.getFirstAsync(
        'SELECT * FROM claims WHERE id = ?',
        [claimId],
      )

      if (result) {
        const updatedClaimData = {
          location: result.location || '',
          customerName: result.customerName ||'',
          segment: result.segment || '',
          application: result.application || '',
          tyreSize: String(result.tyreSize) || '',
          plyRating: result.plyRating || '',
          brandName: result.brandName || '',
          companyName: result.companyName || '',
          serialNumber: result.serialNumber|| '',
          mouldNo: result.mouldNo || '',
          nsd1: String(result.nsd1) || '',
          nsd2: String(result.nsd2) || '',
          nsd3: String(result.nsd3) || '',
          pattern: result.pattern || '',
          defectArea: result.defectArea || '',
          defectName: result.defectName || '',
          photos: result.photos ? JSON.parse(result.photos) : [],
        }
        setClaimData(updatedClaimData)
      }
    } catch (error) {
      console.error('Error fetching claim details:', error)
    }
  }
  const handleInputChange = (fieldName, value) => {
    setClaimData({
      ...claimData,
      [fieldName]: value,
    })
  }
  const handlePhotoChange = (newPhotos) => {
    setClaimData({
      ...claimData,
      photos: newPhotos,
    })
  }

  const handlePhotoDelete = (index) => {
    const newPhotos = claimData.photos.filter((_, i) => i !== index)
    setClaimData({
      ...claimData,
      photos: newPhotos,
    })
  }
  // Use handleInputChange as the change handler for all forms
  const handleFormChange = handleInputChange
  const handleForm1Change = handleInputChange
  const handleForm2Change = handleInputChange

  const handleSaveChanges = async () => {
    try {
      await updateClaim(claimId, claimData)
      console.log('Claim updated successfully')
          // Show success message
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Success',
      text2: 'Claim updated successfully',
      visibilityTime: 2000, // Duration in milliseconds
    });

    // Navigate back after showing the message
    setTimeout(() => {
      navigation.navigate('AllClaim');
    }, 2000); // Make sure this matches the visibilityTime for smooth experience

    } catch (error) {
      console.error('Error updating claim:', error)
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Form formData={claimData} onChange={handleFormChange} />
        <Form1 formData={claimData} onChange={handleForm1Change} />
        <Form2 formData={claimData} onChange={handleForm2Change} />
        <Form3
          formData={claimData}
          onChange={handleInputChange}
          onPhotoChange={handlePhotoChange}
        />
        <View style={styles.photoSection}>
          {claimData.photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity onPress={() => handlePhotoDelete(index)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.saveChanges}
          onPress={handleSaveChanges}
        >
          <Text style={styles.buttonText}>Update Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  saveChanges: {
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
  buttonText: {
    color: 'white',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  photoSection: {
    marginTop: 20,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
})

export default EditClaim
