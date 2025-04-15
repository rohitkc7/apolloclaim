import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ImageView from 'react-native-image-viewing'
import { firestore } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

const SingleClaim = ({ route }) => {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [claim, setClaim] = useState(null)
  const { claimId } = route.params
  const navigation = useNavigation()

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const claimRef = doc(firestore, 'claims', claimId)
        const claimSnapshot = await getDoc(claimRef)

        if (claimSnapshot.exists()) {
          const claimData = claimSnapshot.data()
          claimData.photos = claimData.photos
            ? JSON.parse(claimData.photos)
            : []
          setClaim(claimData)
        } else {
          console.log('No such claim found!')
        }
      } catch (error) {
        console.error('Error fetching claim details:', error)
      }
    }

    fetchClaimDetails()
  }, [claimId])

  useEffect(() => {
    if (claim) {
      navigation.setOptions({
        title: claim.claimTitle,
      })
    }
  }, [claim, navigation])

  const handleImagePress = (index) => {
    setSelectedImageIndex(index)
    setIsImageViewVisible(true)
  }

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  )

  if (!claim) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderSection('Location', claim.location)}
      {renderSection('Date', claim.date?.toDate().toLocaleDateString())}
      {renderSection('Customer Name', claim.customerName)}
      {renderSection('Segment', claim.segment)}
      {renderSection('Application', claim.application)}
      {renderSection('Tyre Size', claim.tyreSize)}
      {renderSection('Ply Rating', claim.plyRating)}
      {renderSection('Brand Name', claim.brandName)}
      {renderSection('Company Name', claim.companyName)}
      {renderSection('Serial Number', claim.serialNumber)}
      {renderSection('Mould No', claim.mouldNo)}
      {renderSection('NSD1', claim.nsd1)}
      {renderSection('NSD2', claim.nsd2)}
      {renderSection('NSD3', claim.nsd3)}
      {renderSection('Pattern', claim.pattern)}
      {renderSection('Defect Area', claim.defectArea)}
      {renderSection('Defect Name', claim.defectName)}
      <View style={styles.section}>
        <Text style={styles.title}>Photos:</Text>
        <ScrollView horizontal style={styles.photoContainer}>
          {claim.photos.map((photoUri, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
            >
              <Image source={{ uri: photoUri }} style={styles.photo} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ImageView
        images={claim.photos.map((uri) => ({ uri }))}
        imageIndex={selectedImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  photoContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
})

export default SingleClaim
