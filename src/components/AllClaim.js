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
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { useFocusEffect } from '@react-navigation/native'

import { firestore } from '../../firebaseConfig' // Adjusting the path to access firebaseConfig.js
import { collection, getDocs } from 'firebase/firestore' // Import collection and getDocs

import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const AllClaim = ({ navigation, route }) => {
  const [claims, setClaims] = useState([])
  const [isCheckboxMode, setCheckboxMode] = useState(false)
  const [selectedClaims, setSelectedClaims] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClaims()
    })
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setCheckboxMode(false)
      setSelectedClaims(new Set())
    })

    return () => {
      unsubscribe()
      unsubscribeBlur()
    }
  }, [navigation])

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const claimsCollection = collection(firestore, 'claims') // Access the 'claims' collection
      const claimsSnapshot = await getDocs(claimsCollection) // Fetch documents
      const claimsData = claimsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Sort claimsData by ID numerically
      const sortedClaims = claimsData.sort(
        (a, b) => parseInt(a.id) - parseInt(b.id),
      )

      setClaims(sortedClaims)
    } catch (error) {
      console.error('Error fetching claims:', error)
    }
  }

  const handleViewClaim = (claimId) => {
    navigation.navigate('SingleClaim', { claimId })
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }
  const totalPages = Math.ceil(claims.length / itemsPerPage)

  const currentClaims = claims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleShare = async () => {
    if (selectedClaims.size === 0) {
      Alert.alert(
        'No claims selected',
        'Please select at least one claim to export.',
      )
      return
    }

    const filteredClaims = claims.filter((claim) =>
      selectedClaims.has(claim.id),
    )

    const csv = [
      [
        'ID',
        'Application',
        'Location',
        'Customer Name',
        'Segment',
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
      ],
      ...filteredClaims.map((claim) => [
        claim.id,
        claim.application,
        claim.location,
        claim.customerName,
        claim.segment,
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
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n')

    const fileUri = FileSystem.documentDirectory + 'claims.csv'
    await FileSystem.writeAsStringAsync(fileUri, csv)

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        UTI: 'public.comma-separated-values-text',
      })
    } else {
      Alert.alert('Sharing not available', 'Unable to share file.')
    }
  }
  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {currentPage !== 1 && (
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => handlePageChange(currentPage - 1)}
        >
          <MaterialIcons name="navigate-before" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.pageIndicator}>
        {`${currentPage} / ${totalPages}`}
      </Text>
      {currentPage !== totalPages && (
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => handlePageChange(currentPage + 1)}
        >
          <MaterialIcons name="navigate-next" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      {isCheckboxMode && (
        <TouchableOpacity style={styles.claimShare} onPress={handleShare}>
          <Text style={styles.shareText}>Share Selected</Text>
        </TouchableOpacity>
      )}

      {/* Column Headers */}
      <FlatList
        style={styles.claimItems}
        data={currentClaims}
        renderItem={({ item }) => (
          <View style={styles.claimCard}>
            <View style={styles.claimCardContent}>
              <Text style={styles.cardTitle}>Issue No: N000{item.id}</Text>
              <Text style={styles.cardDetail}>
                Date: {item.date?.toDate().toLocaleDateString()}
              </Text>
              <Text style={styles.cardDetail}>Segment: {item.segment}</Text>
              <Text style={styles.cardDetail}>Size: {item.tyreSize}</Text>
              <Text style={styles.cardDetail}>Company: {item.companyName}</Text>
              <Text style={styles.cardDetail}>Brand: {item.brandName}</Text>
            </View>
            {isCheckboxMode && (
              <CheckBox
                style={styles.checkbox}
                value={selectedItems.includes(item.id)}
                onValueChange={() => toggleSelection(item.id)}
              />
            )}
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewClaim(item.id)}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Pagination at the bottom */}
      {renderPagination()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
    padding: 5,
    margin: 5,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  paginationButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  paginationText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  claimCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  claimCardContent: {
    flexDirection: 'column',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },
  viewButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default AllClaim
