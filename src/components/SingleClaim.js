import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import setupDatabase from './db'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import ImageView from 'react-native-image-viewing'

const SingleClaim = ({ route }) => {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { claimId } = route.params
  const [claim, setClaim] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    fetchClaimDetails()
  }, [])

  const fetchClaimDetails = async () => {
    try {
      const db = await setupDatabase()
      const claimData = await db.getFirstAsync(
        'SELECT * FROM claims WHERE id = ?',
        [claimId],
      )
      if (claimData.photos) {
        claimData.photos = JSON.parse(claimData.photos)
      } else {
        claimData.photos = []
      }
      setClaim(claimData)
      console.log('Fetched claim data:', claimData)
    } catch (error) {
      console.error('Error fetching claim details:', error)
    }
  }
  const handleImagePress = (index) => {
    setSelectedImageIndex(index)
    setIsImageViewVisible(true)
  }

  const generateCSV = async () => {
    const headers = [
      'Date',
      'Location',
      'Customer Name',
      'Segment',
      'Application',
      'Tyre Size',
      'Ply Rating',
      'Brand Name',
      'Company Name',
      'Serial Number',
      'Mould No',
      'NSD1',
      'NSD2',
      'NSD3',
      'Pattern',
      'Defect Area',
      'Defect Name',
      'Photos',
    ]
    const data = [
      headers,
      [
        claim.date,
        claim.location,
        claim.customerName,
        claim.segment,
        claim.application,
        claim.tyreSize,
        claim.plyRating,
        claim.brandName,
        claim.companyName,
        claim.serialNumber,
        claim.mouldNo,
        claim.nsd1,
        claim.nsd2,
        claim.nsd3,
        claim.pattern,
        claim.defectArea,
        claim.defectName,
        claim.photos.join(', '),
      ],
    ]

    const csv = data.map((row) => row.join(',')).join('\n')

    const fileUri = FileSystem.documentDirectory + 'claim.csv'
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    })

    return fileUri
  }

  const handleSave = async () => {
    const format = await new Promise((resolve) => {
      Alert.alert(
        'Choose Format',
        'Select the format you want to save the file as:',
        [
          { text: 'CSV', onPress: () => resolve('CSV') },
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
        ],
      )
    })

    if (!format) return

    try {
      let fileUri
      if (format === 'CSV') {
        fileUri = await generateCSV()
      }

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri)
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.')
      }
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  React.useLayoutEffect(() => {
    if (claim) {
      navigation.setOptions({
        title: claim.claimTitle,
        headerRight: () => (
          <Button onPress={handleSave} title="Save" color="#007bff" />
        ),
      })
    }
  }, [navigation, claim])

  if (!claim) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Location</Text>
        <Text style={styles.content}>{claim.location}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Location</Text>
        <Text style={styles.content}>
          {new Date(claim.dateSubmitted).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Customer Name</Text>
        <Text style={styles.content}>{claim.customerName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Segment</Text>
        <Text style={styles.content}>{claim.segment}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Application:</Text>
        <Text style={styles.content}>{claim.application}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Tyre Size:</Text>
        <Text style={styles.content}>{claim.tyreSize}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Ply Rating:</Text>
        <Text style={styles.content}>{claim.plyRating}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Brand Name:</Text>
        <Text style={styles.content}>{claim.brandName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Company Name:</Text>
        <Text style={styles.content}>{claim.companyName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Serial Number:</Text>
        <Text style={styles.content}>{claim.serialNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Mould No:</Text>
        <Text style={styles.content}>{claim.mouldNo}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>NSD1:</Text>
        <Text style={styles.content}>{claim.nsd1}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>NSD2:</Text>
        <Text style={styles.content}>{claim.nsd2}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>NSD3:</Text>
        <Text style={styles.content}>{claim.nsd3}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Pattern:</Text>
        <Text style={styles.content}>{claim.pattern}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Defect Area:</Text>
        <Text style={styles.content}>{claim.defectArea}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Defect Name:</Text>
        <Text style={styles.content}>{claim.defectName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Photos:</Text>
        <ScrollView horizontal style={styles.photoContainer}>
          {claim.photos.map((photoUri, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
            >
              <Image
                key={index}
                source={{ uri: photoUri }}
                style={styles.photo}
              />
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
  // Add more styles as needed
})

export default SingleClaim
