import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import setupDatabase from './db'
import { insertClaim } from './db.js'

const SingleClaim = ({ route }) => {
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

  React.useLayoutEffect(() => {
    if (claim) {
      navigation.setOptions({
        title: claim.claimTitle,
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
            <Image
              key={index}
              source={{ uri: photoUri }}
              style={styles.photo}
            />
          ))}
        </ScrollView>
      </View>
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
