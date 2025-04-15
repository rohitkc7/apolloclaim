import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import XLSX from 'xlsx'
import { Alert } from 'react-native'

export const handleExportData = async (dataToExport) => {
  try {
    const excelData = [
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
        'Date',
      ],
      ...dataToExport.map((claim) => [
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
        claim.date ? claim.date.toDate().toLocaleDateString() : '',
      ]),
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims')
    const excelFile = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' })
    const fileUri = FileSystem.documentDirectory + 'claims.xlsx'

    await FileSystem.writeAsStringAsync(fileUri, excelFile, {
      encoding: FileSystem.EncodingType.Base64,
    })

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Share Excel file',
        UTI: 'com.microsoft.excel.xlsx',
      })
    } else {
      Alert.alert('Sharing not available', 'Unable to share file.')
    }
  } catch (error) {
    console.error('Export Error:', error)
    Alert.alert('Export Failed', 'There was an issue exporting the data.')
  }
}
