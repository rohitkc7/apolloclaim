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

const initialFormData = {
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
};

const AddClaim = ({ navigation }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentPage(1);
  };

  const handleFormChange = (fieldName, value) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const handlePhotoSelection = (photoBase64) => {
    setFormData((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, photoBase64],
    }));
  };

  const submitData = async () => {
    try {
      console.log('Form Data:', formData);
      const insertId = await insertClaim(formData);
      navigation.navigate('AllClaim');
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case 1:
        return <Form formData={formData} onChange={handleFormChange}/>;
      case 2:
        return <Form1 formData={formData} onChange={handleFormChange} />;
      case 3:
        return <Form2 formData={formData} onChange={handleFormChange} />;
      case 4:
        return (
          <Form3
            formData={formData}
            onChange={handleFormChange}
            onPhotoSelect={handlePhotoSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View>
          <Text style={styles.titleText}>Fill the details to add new Claims.</Text>
          {renderForm()}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={currentPage === 4 ? submitData : () => setCurrentPage((prev) => Math.min(prev + 1, 4))}
          >
            <Text style={styles.buttonext}>{currentPage === 4 ? 'Submit' : 'Next'}</Text>
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
  );
};
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
