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
import Checkbox from 'expo-checkbox'
import AntDesign from '@expo/vector-icons/AntDesign'
import { DrawerActions } from '@react-navigation/native'

import setupDatabase from './db'
import { Platform } from 'react-native'

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
      const db = await setupDatabase()
      const rows = await db.getAllAsync('SELECT * FROM claims')
      setClaims(rows)
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
  const handleLongPress = (claimId) => {
    if (isCheckboxMode) {
      setCheckboxMode(false)
      setSelectedClaims(new Set())
    } else {
      setCheckboxMode(true)
      setSelectedClaims((prevSelected) => {
        const newSelected = new Set(prevSelected)
        newSelected.add(claimId)
        return newSelected
      })
    }
  }
  const handleCheckboxChange = (claimId) => {
    setSelectedClaims((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(claimId)) {
        newSelected.delete(claimId)
      } else {
        newSelected.add(claimId)
      }
      return newSelected
    })
  }
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
      <TouchableOpacity
        style={styles.paginationButton}
        disabled={currentPage === 1}
        onPress={() => handlePageChange(currentPage - 1)}
      >
        <Text style={styles.paginationText}>Previous</Text>
      </TouchableOpacity>
      <Text
        style={styles.pageIndicator}
      >{`${currentPage} / ${totalPages}`}</Text>
      <TouchableOpacity
        style={styles.paginationButton}
        disabled={currentPage === totalPages}
        onPress={() => handlePageChange(currentPage + 1)}
      >
        <Text style={styles.paginationText}>Next</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.claimHeading}>
        {/* <Text style={styles.heading}>Scrap Analysis</Text> */}
      </View>

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
                Date: {new Date(item.dateSubmitted).toLocaleDateString()}
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
  header: {
    alignItems: 'left',
  },

  claimItemWrapper: {
    marginBottom: 10,
  },
  checkbox: {
    marginLeft: 10,
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
  checkbox: {
    position: 'absolute',
    right: 10,
    top: 10,
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
