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

import setupDatabase from './db'
import { Platform } from 'react-native'

const AllClaim = ({ navigation, route }) => {
  const [claims, setClaims] = useState([])
  const [isCheckboxMode, setCheckboxMode] = useState(false)
  const [selectedClaims, setSelectedClaims] = useState(new Set()); // Track selected claims


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

  const renderClaimItem = ({ item }) => (
    <View style={styles.claimItemContainer}>
      <View style={styles.claimItemContent}>
        <TouchableOpacity
          onLongPress={() => handleLongPress(item.id)}
        >
          <Text style={styles.claimTitle}>{item.application}</Text>
        </TouchableOpacity>
        {isCheckboxMode && (
          <Checkbox
            value={selectedClaims.has(item.id)}
            onValueChange={() => handleCheckboxChange(item.id)}
            style={styles.checkbox}
          />
        )}
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
  );

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
        {isCheckboxMode && (
          <TouchableOpacity style={styles.claimShare} onPress={handleShare}>
            <Text style={styles.shareText}>Share Selected</Text>
          </TouchableOpacity>
        )}
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
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  claimShare: {
    backgroundColor: '#007BFF', // Blue background for the button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  shareText: {
    color: '#FFF', // White text color
    fontSize: 16,
    fontWeight: 'bold',
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
