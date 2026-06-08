import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import XLSX from 'xlsx'
import { Alert } from 'react-native'

const MAX_PHOTOS = 3   // columns: Photo 1, Photo 2, Photo 3

const getPhotos = (claim) => {
  if (Array.isArray(claim.photos)) return claim.photos
  if (typeof claim.photos === 'string') {
    try { return JSON.parse(claim.photos) } catch { return [] }
  }
  return []
}

// Just return the URL text; hyperlinks will be added after sheet creation
const photoCell = (url) => {
  return url || ''
}

export const handleExportData = async (dataToExport) => {
  try {
    const photoHeaders = Array.from({ length: MAX_PHOTOS }, (_, i) => `Photo ${i + 1}`)

    const headers = [
      'ID', 'Date', 'Location', 'Customer Name', 'Segment', 'Application',
      'Tyre Size', 'Ply Rating', 'Brand Name', 'Company Name',
      'Serial Number', 'Mould No', 'NSD1', 'NSD2', 'NSD3',
      'Pattern', 'Defect Area', 'Defect Name',
      ...photoHeaders,
    ]

    const rows = dataToExport.map((claim) => {
      const photos = getPhotos(claim)
      const photoCells = Array.from({ length: MAX_PHOTOS }, (_, i) =>
        photos[i] ? photoCell(photos[i]) : '',
      )

      return [
        claim.id,
        claim.date ? claim.date.toDate().toLocaleDateString() : '',
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
        ...photoCells,
      ]
    })

    // ── Main data sheet ──────────────────────────────────────────────
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

    // Add hyperlinks to photo URLs
    // Photo columns start at column index 18 (column S in Excel)
    const photoColumnStart = 18
    rows.forEach((row, rowIdx) => {
      for (let photoIdx = 0; photoIdx < MAX_PHOTOS; photoIdx++) {
        const colIdx = photoColumnStart + photoIdx
        const cellRef = XLSX.utils.encode_col(colIdx) + (rowIdx + 2) // +2: skip header, 1-indexed
        const url = row[colIdx]
        if (url && typeof url === 'string' && url.startsWith('http')) {
          worksheet[cellRef] = {
            ...worksheet[cellRef],
            l: { Target: url, Tooltip: 'Click to view photo' },
            c: [{ t: 's', v: `📸 Photo ${photoIdx + 1}` }],
          }
        }
      }
    })

    // Column widths
    const colWidths = [
      { wch: 8  },  // ID
      { wch: 14 },  // Date
      { wch: 18 },  // Location
      { wch: 20 },  // Customer
      { wch: 14 },  // Segment
      { wch: 18 },  // Application
      { wch: 12 },  // Tyre Size
      { wch: 12 },  // Ply Rating
      { wch: 16 },  // Brand
      { wch: 20 },  // Company
      { wch: 16 },  // Serial
      { wch: 12 },  // Mould
      { wch: 8  },  // NSD1
      { wch: 8  },  // NSD2
      { wch: 8  },  // NSD3
      { wch: 16 },  // Pattern
      { wch: 18 },  // Defect Area
      { wch: 22 },  // Defect Name
      ...Array(MAX_PHOTOS).fill({ wch: 14 }),
    ]
    worksheet['!cols'] = colWidths

    // ── Google Sheets helper sheet ───────────────────────────────────
    // Each photo URL gets an =IMAGE() formula so Google Sheets renders
    // the image inline. User imports the file into Google Sheets and
    // this sheet will show the actual photos.
    const gsHeaders = ['ID', 'Customer Name', 'Date',
      ...Array.from({ length: MAX_PHOTOS }, (_, i) => `Photo ${i + 1}`)]

    const gsRows = dataToExport.map((claim) => {
      const photos = getPhotos(claim)
      const imageCells = Array.from({ length: MAX_PHOTOS }, (_, i) =>
        photos[i] ? { f: `IMAGE("${photos[i]}")` } : '',
      )
      return [
        claim.id,
        claim.customerName,
        claim.date ? claim.date.toDate().toLocaleDateString() : '',
        ...imageCells,
      ]
    })

    const gsSheet = XLSX.utils.aoa_to_sheet([gsHeaders, ...gsRows])
    gsSheet['!cols'] = [{ wch: 8 }, { wch: 20 }, { wch: 14 },
      ...Array(MAX_PHOTOS).fill({ wch: 22 })]
    // Tall rows so images have space (row height in 1/20 pt)
    gsSheet['!rows'] = [{ hpt: 20 }, ...gsRows.map(() => ({ hpt: 80 }))]

    // ── Assemble workbook ────────────────────────────────────────────
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims')
    XLSX.utils.book_append_sheet(workbook, gsSheet, 'Photos (Google Sheets)')

    const excelFile = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' })
    const fileName  = `ApolloClaims_${new Date().toISOString().slice(0, 10)}.xlsx`
    const fileUri   = FileSystem.documentDirectory + fileName

    await FileSystem.writeAsStringAsync(fileUri, excelFile, { encoding: 'base64' })

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Claims',
        UTI: 'com.microsoft.excel.xlsx',
      })
    } else {
      Alert.alert('Sharing not available', 'Unable to share the file on this device.')
    }
  } catch (error) {
    console.error('Export Error:', error)
    throw error
  }
}
