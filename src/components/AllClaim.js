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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Checkbox from 'expo-checkbox';
import AntDesign from '@expo/vector-icons/AntDesign';
import { DrawerActions } from '@react-navigation/native';


import setupDatabase from './db'
import { Platform } from 'react-native'

const AllClaim = ({ navigation, route }) => {
  const [claims, setClaims] = useState([])
  const [isCheckboxMode, setCheckboxMode] = useState(false)
  const [selectedClaims, setSelectedClaims] = useState(new Set()); // Track selected claims
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClaims() 
    })
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setCheckboxMode(false);
      setSelectedClaims(new Set());
    });   

return () => {
  unsubscribe();
  unsubscribeBlur();
};
}, [navigation ]);

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const db = await setupDatabase() // Wait for database setup to complete
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
    setCurrentPage(newPage);
  };
  const totalPages = Math.ceil(claims.length / itemsPerPage);
// Get claims for current page
const currentClaims = claims.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  const handleLongPress = (claimId) => {
    if (isCheckboxMode) {
      // If checkbox mode is already active, reset the state
      setCheckboxMode(false);
      setSelectedClaims(new Set());
    } else {
      // Activate checkbox mode and select the item
      setCheckboxMode(true);
      setSelectedClaims((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.add(claimId);
        return newSelected;
      });
    }
  };
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
      Alert.alert('No claims selected', 'Please select at least one claim to export.');
      return;
    }

    // Filter the selected claims
    const filteredClaims = claims.filter((claim) => selectedClaims.has(claim.id));

    // Create CSV
    const csv = [
      ['ID', 'Application', 'Location', 'Customer Name', 'Segment', 'Tyre Size', 'Ply Rating', 'Brand Name', 'Company Name', 'Serial Number', 'Mould No', 'NSD1', 'NSD2', 'NSD3', 'Pattern', 'Defect Area', 'Defect Name'],
      ...filteredClaims.map(claim => [
        claim.id, claim.application, claim.location, claim.customerName, claim.segment, claim.tyreSize, claim.plyRating, claim.brandName, claim.companyName, claim.serialNumber, claim.mouldNo, claim.nsd1, claim.nsd2, claim.nsd3, claim.pattern, claim.defectArea, claim.defectName
      ])
    ]
      .map(e => e.join(','))
      .join('\n');

    // Create file
    const fileUri = FileSystem.documentDirectory + 'claims.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv);

    // Share file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      Alert.alert('Sharing not available', 'Unable to share file.');
    }
  };
  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={styles.paginationButton}
        disabled={currentPage === 1}
        onPress={() => handlePageChange(currentPage - 1)}
      >
        <Text style={styles.paginationText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageIndicator}>{`${currentPage} / ${totalPages}`}</Text>
      <TouchableOpacity
        style={styles.paginationButton}
        disabled={currentPage === totalPages}
        onPress={() => handlePageChange(currentPage + 1)}
      >
        <Text style={styles.paginationText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
  const renderClaimItem = ({ item }) => (
    <View style={styles.claimItemWrapper}>
    <View style={styles.claimRow}>
      <Text style={styles.claimCell}>N000{item.id}</Text>
      <Text style={styles.claimCell}>{item.claimId}</Text>
      <Text style={styles.claimCell}>{item.segment}</Text>
      <Text style={styles.claimCell}>{item.size}</Text>
      <Text style={styles.claimCell}>{item.companyName}</Text>
      <Text style={styles.claimCell}>{item.brandName}</Text>
      {/* View Button Outside the Table */}
      <TouchableOpacity style={styles.viewButton} onPress={() => handleViewClaim(item.id)}>
        <AntDesign name="eye" size={18} color="white" />
      </TouchableOpacity>
    </View>

    {isCheckboxMode && (
      <Checkbox
        value={selectedClaims.has(item.id)}
        onValueChange={() => handleCheckboxChange(item.id)}
        style={styles.checkbox}
      />
    )}
  </View>
  )
  
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}></View>
    <View style={styles.claimHeading}>
      <Text style={styles.heading}>Scrap Analysis</Text>
    </View>
    
    {isCheckboxMode && (
      <TouchableOpacity style={styles.claimShare} onPress={handleShare}>
        <Text style={styles.shareText}>Share Selected</Text>
      </TouchableOpacity>
    )}

    {/* Column Headers */}
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>Issue No.</Text>
      <Text style={styles.headerCell}>Date</Text>
      <Text style={styles.headerCell}>Seg.</Text>
      <Text style={styles.headerCell}>Size</Text>
      <Text style={styles.headerCell}>Comp</Text>
      <Text style={styles.headerCell}>Brand</Text>
      <Text style={styles.headerCell}></Text>
    </View>

    {/* Claim List */}
    <FlatList
      style={styles.claimItems}
      data={currentClaims}  // Use currentClaims here
      renderItem={renderClaimItem}
      keyExtractor={(item) => item.id.toString()}
      extraData={currentClaims}  // Ensure FlatList updates correctly
    />
    
    {/* Pagination at the bottom */}
    {renderPagination()}
  </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    padding: 5,
    margin: 5,
  },
  header: {
    alignItems: 'left',
  },
  claimHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'left',
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#C0C0C0',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
    paddingHorizontal: 5,
    color: '#333',
  },
  claimItemWrapper: {
    marginBottom: 10,
  },
  claimRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'left',
  },
  claimCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'left',
    paddingHorizontal: 5,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
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
});

export default AllClaim
