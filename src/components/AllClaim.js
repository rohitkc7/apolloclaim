import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'

import setupDatabase from './db'
import { insertClaim } from './databaseOperation'
import { Platform } from 'react-native'

const AllClaim = ({ navigation, route }) => {
  const [claims, setClaims] = useState([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClaims() // Fetch claims data when the page is focused
    })
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const db = await setupDatabase() // Wait for database setup to complete
      const rows = await db.getAllAsync('SELECT * FROM claims')
      setClaims(rows) // Set the fetched claims to the state
    } catch (error) {
      console.error('Error fetching claims:', error)
    }
  }

  const handleAddClaim = () => {
    navigation.navigate('AddClaim')
  }

  const handleViewClaim = (claimId) => {
    navigation.navigate('SingleClaim', { claimId })
  }

  const handleEditClaim = (claimId) => {
    navigation.navigate('EditClaim', { claimId })
  }

  const handleDeleteClaim = (claimId) => {
    Alert.alert(
      'Delete Claim',
      'Are you sure you want to delete this claim?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            deleteClaim(claimId)
          },
        },
      ],
      { cancelable: true },
    )
  }
  const deleteClaim = async (claimId) => {
    try {
      const db = await setupDatabase() // Wait for database setup to complete
      const result = await db.runAsync('DELETE FROM claims WHERE id = ?', [
        claimId,
      ])
      if (result.changes > 0) {
        console.log('Claim deleted successfully')
        fetchClaims() // Refresh claims after deletion
      } else {
        console.log('No claim found with ID:', claimId)
      }
    } catch (error) {
      console.error('Error deleting claim:', error)
    }
  }
  const renderClaimItem = ({ item }) => (
    <View style={styles.claimItemContainer}>
      <View style={styles.claimItemContent}>
        <Text style={styles.claimTitle}>{item.application}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditClaim(item.id)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewClaim(item.id)}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteClaim(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/apollo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.claimButton} onPress={handleAddClaim}>
          <Text style={styles.buttonText}>Add Claim</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.claimHeading}>
        <Text style={styles.heading}>Claims</Text>
      </View>
      <FlatList
        data={claims}
        renderItem={renderClaimItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={claims}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  claimHeading: {
    padding: 10,
  },
  logo: {
    width: 80,
    height: 80,
    margin: 20,
    flexDirection: 'column',
  },
  claimButton: {
    backgroundColor: '#5C2C92',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 40,
    margin: 20,
    marginTop: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  claimItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  claimTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  claimItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  claimItemContent: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  claimTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
export default AllClaim
