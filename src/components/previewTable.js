import React from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Button } from 'react-native'
import { handleExportData } from './exportHelper'

const PreviewTable = ({ visible, data, onClose, onExport }) => {
  const renderHeader = () => (
    <View style={styles.row}>
      <Text style={styles.cell}>ID</Text>
      <Text style={styles.cell}>Application</Text>
      <Text style={styles.cell}>Location</Text>
      <Text style={styles.cell}>Customer Name</Text>
      <Text style={styles.cell}>Segment</Text>
      <Text style={styles.cell}>Tyre Size</Text>
      <Text style={styles.cell}>Ply Rating</Text>
      <Text style={styles.cell}>Brand Name</Text>
      <Text style={styles.cell}>Company Name</Text>
      <Text style={styles.cell}>Serial Number</Text>
      <Text style={styles.cell}>Mould No</Text>
      <Text style={styles.cell}>NSD1</Text>
      <Text style={styles.cell}>NSD2</Text>
      <Text style={styles.cell}>NSD3</Text>
      <Text style={styles.cell}>Pattern</Text>
      <Text style={styles.cell}>Defect Area</Text>
      <Text style={styles.cell}>Defect Name</Text>
      <Text style={styles.cell}>Date</Text>
    </View>
  )

  const renderRows = () =>
    data.map((claim, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.cell}>{claim.id}</Text>
        <Text style={styles.cell}>{claim.application}</Text>
        <Text style={styles.cell}>{claim.location}</Text>
        <Text style={styles.cell}>{claim.customerName}</Text>
        <Text style={styles.cell}>{claim.segment}</Text>
        <Text style={styles.cell}>{claim.tyreSize}</Text>
        <Text style={styles.cell}>{claim.plyRating}</Text>
        <Text style={styles.cell}>{claim.brandName}</Text>
        <Text style={styles.cell}>{claim.companyName}</Text>
        <Text style={styles.cell}>{claim.serialNumber}</Text>
        <Text style={styles.cell}>{claim.mouldNo}</Text>
        <Text style={styles.cell}>{claim.nsd1}</Text>
        <Text style={styles.cell}>{claim.nsd2}</Text>
        <Text style={styles.cell}>{claim.nsd3}</Text>
        <Text style={styles.cell}>{claim.pattern}</Text>
        <Text style={styles.cell}>{claim.defectArea}</Text>
        <Text style={styles.cell}>{claim.defectName}</Text>
        <Text style={styles.cell}>
          {claim.date ? claim.date.toDate().toLocaleDateString() : ''}
        </Text>
      </View>
    ))
  const handleExport = async () => {
    await handleExportData(data) // Call the export function with the data
  }
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalView}>
        <ScrollView horizontal>
          <View>
            {renderHeader()}
            <ScrollView style={styles.scrollableBody}>
              {renderRows()}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button title="Confirm Export" onPress={handleExport} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    minWidth: 100, // Set a minimum width for cells for better scrolling experience
    fontWeight: 'bold',
  },
  scrollableBody: {
    maxHeight: 800, // Set a max height for the vertical scrollable area
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
})

export default PreviewTable
