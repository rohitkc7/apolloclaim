import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { insertClaim } from './databaseOperation.js'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'

const AddClaim = ({ navigation }) => {
  const [formData, setFormData] = useState({
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
    pic1: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => {
    setFormData({
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
      pic1: '',
    })
    setCurrentPage(1)
  }, [])

  const nextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1)
    }
  }
  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleFormChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    })
  }

  const submitData = () => {
    console.log('Submit data')
    insertClaim(
      formData,
      (insertId) => {
        console.log('Claim saved successfully')
        navigation.navigate('AllClaim')
      },
      (error) => {
        console.error('Failed to save:', error)
      },
    )
  }

  const renderForm = () => {
    switch (currentPage) {
      case 1:
        return <Form1 formData={formData} onChange={handleFormChange} />
      case 2:
        return <Form2 formData={formData} onChange={handleFormChange} />
      case 3:
        return (
          <Form3
            formData={formData}
            onChange={handleFormChange}
            onPic1Change={(uri) => setFormData({ ...formData, pic1: uri })}
          />
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View>
          <Text style={styles.titleText}>
            Fill the details to add new Claims.
          </Text>
          {renderForm()}
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={currentPage === 3 ? submitData : nextPage}
        >
          <Text style={styles.buttonText}>
            {currentPage === 3 ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={previousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
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
