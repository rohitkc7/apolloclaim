import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { firestore } from '../../firebaseConfig' // Adjusting the path to access firebaseConfig.js
import { collection, getDocs } from 'firebase/firestore' // Import collection and getDocs
import DateTimePicker from '@react-native-community/datetimepicker'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { previewData } from './previewHelper'
import { handleExportData } from './exportHelper'
import PreviewTable from './previewTable'

const AllClaim = ({ navigation, route }) => {
  const [claims, setClaims] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClaims, setSelectedClaims] = useState(new Set())
  const itemsPerPage = 5
  const [isModalVisible, setModalVisible] = useState(false)
  const [isDateRangePickerVisible, setDateRangePickerVisible] = useState(false)

  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false)
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false)
  // Add state to manage the preview visibility and data
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewClaims, setPreviewClaims] = useState([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClaims()
    })
    const unsubscribeBlur = navigation.addListener('blur', () => {
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

  const openExportPrompt = () => {
    Alert.alert(
      'Export Options',
      'Do you want to export all data or selected data?',
      [
        {
          text: 'All',
          onPress: () => {
            setPreviewClaims(claims) // Set the claims for preview
            setPreviewVisible(true) // Show the preview modal
          },
        },
        {
          text: 'Selected',
          onPress: () => setDateRangePickerVisible(true),
        },
      ],
    )
  }

  const handleDateRangeSelection = () => {
    const filteredClaims = claims.filter((claim) => {
      const claimDate = claim.date?.toDate()
      return claimDate && claimDate >= fromDate && claimDate <= toDate
    })

    if (filteredClaims.length === 0) {
      Alert.alert('No Data', 'No claims found in the selected date range.')
      return
    }

    // Set the preview claims data and make the preview visible
    setPreviewClaims(filteredClaims)
    setPreviewVisible(true) // Show the preview modal
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={openExportPrompt}
        >
          <Text style={styles.buttonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {isDateRangePickerVisible && (
        <Modal
          visible={isDateRangePickerVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalView}>
            <Text style={styles.datePickerLabel}>Select Date Range</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setFromDatePickerVisible(true)}
            >
              <Text style={styles.buttonText}>
                From: {fromDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {isFromDatePickerVisible && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setFromDate(date || fromDate)
                  setFromDatePickerVisible(false)
                }}
              />
            )}

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setToDatePickerVisible(true)}
            >
              <Text style={styles.buttonText}>To: {toDate.toDateString()}</Text>
            </TouchableOpacity>
            {isToDatePickerVisible && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setToDate(date || toDate)
                  setToDatePickerVisible(false)
                }}
              />
            )}
            <Button
              title="Export Selected Claims"
              onPress={handleDateRangeSelection}
            />
            <Button
              title="Close"
              onPress={() => setDateRangePickerVisible(false)}
            />
          </View>
        </Modal>
      )}
      <PreviewTable
        visible={previewVisible}
        data={previewClaims}
        onClose={() => setPreviewVisible(false)}
      />
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
  exportButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
  },
  datePickerButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
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
