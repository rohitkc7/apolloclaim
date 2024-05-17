import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'

import db from './db'

const EditClaim = ({}) => {
  const route = useRoute()
  const navigation = useNavigation()

  const { claimId } = route.params

  const [claimData, setClaimData] = useState({
    segment: '',
    application: '',
    tyreSize: '',
    plyRating: '',
    brandName: '',
    companyName: '',
    mouldNo: '',
    nsd1: '',
    nsd2: '',
    nsd3: '',
    nsd4: '',
    nsd5: '',
    pattern: '',
    defectArea: '',
    defectName: '',
  })
  useEffect(() => {
    fetchClaimDetails()
  }, [])

  const fetchClaimDetails = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM claims WHERE id = ?',
        [claimId],
        (_, { rows }) => {
          const fetchedClaimData = rows._array[0]
          const updatedClaimData = {
            segment: fetchedClaimData.segment || '',
            application: fetchedClaimData.application || '',
            tyreSize: String(fetchedClaimData.tyreSize) || '',
            plyRating: fetchedClaimData.plyRating || '',
            brandName: fetchedClaimData.brandName || '',
            companyName: fetchedClaimData.companyName || '',
            mouldNo: fetchedClaimData.mouldNo || '',
            nsd1: String(fetchedClaimData.nsd1) || '',
            nsd2: String(fetchedClaimData.nsd2) || '',
            nsd3: String(fetchedClaimData.nsd3) || '',
            nsd4: String(fetchedClaimData.nsd4) || '',
            nsd5: String(fetchedClaimData.nsd5) || '',
            pattern: fetchedClaimData.pattern || '',
            defectArea: fetchedClaimData.defectArea || '',
            defectName: fetchedClaimData.defectName || '',
          }
          setClaimData(updatedClaimData)
        },
        (_, error) => {
          console.error('Error fetching claim details:', error)
        },
      )
    })
  }
  const handleInputChange = (fieldName, value) => {
    setClaimData({
      ...claimData,
      [fieldName]: value,
    })
  }
  // Use handleInputChange as the change handler for all forms
  const handleForm1Change = handleInputChange
  const handleForm2Change = handleInputChange
  const handleForm3Change = handleInputChange

  const handleSaveChanges = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE claims SET segment=?, application=?, tyreSize=?, plyRating=?, brandName=?, companyName=?, mouldNo=?, nsd1=?, nsd2=?, nsd3=?, nsd4=?, nsd5=?, pattern=?, defectArea=?, defectName=? WHERE id=?',
        [
          claimData.segment,
          claimData.application,
          claimData.tyreSize,
          claimData.plyRating,
          claimData.brandName,
          claimData.companyName,
          claimData.mouldNo,
          claimData.nsd1,
          claimData.nsd2,
          claimData.nsd3,
          claimData.nsd4,
          claimData.nsd5,
          claimData.pattern,
          claimData.defectArea,
          claimData.defectName,
          claimId,
        ],
        (_, result) => {
          console.log('Claim updated successfully')
          navigation.navigate('AllClaim')
        },
        (_, error) => {
          console.error('Error updating claim:', error)
        },
      )
    })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Form1 formData={claimData} onChange={handleForm1Change} />
        <Form2 formData={claimData} onChange={handleForm2Change} />
        <Form3 formData={claimData} onChange={handleForm3Change} />
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
})

export default EditClaim
