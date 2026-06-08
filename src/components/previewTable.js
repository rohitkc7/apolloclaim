import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { handleExportData } from './exportHelper'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const { width } = Dimensions.get('window')

const COLUMNS = [
  { key: 'id',           label: 'ID',            width: 60  },
  { key: 'date',         label: 'Date',           width: 100 },
  { key: 'location',     label: 'Location',       width: 120 },
  { key: 'customerName', label: 'Customer',       width: 130 },
  { key: 'segment',      label: 'Segment',        width: 100 },
  { key: 'tyreSize',     label: 'Tyre Size',      width: 100 },
  { key: 'plyRating',    label: 'Ply Rating',     width: 90  },
  { key: 'brandName',    label: 'Brand',          width: 110 },
  { key: 'companyName',  label: 'Company',        width: 130 },
  { key: 'serialNumber', label: 'Serial No.',     width: 110 },
  { key: 'mouldNo',      label: 'Mould No.',      width: 100 },
  { key: 'nsd1',         label: 'NSD1',           width: 70  },
  { key: 'nsd2',         label: 'NSD2',           width: 70  },
  { key: 'nsd3',         label: 'NSD3',           width: 70  },
  { key: 'pattern',      label: 'Pattern',        width: 110 },
  { key: 'defectArea',   label: 'Defect Area',    width: 120 },
  { key: 'defectName',   label: 'Defect Name',    width: 140 },
]

const getCellValue = (claim, key) => {
  if (key === 'date') {
    return claim.date ? claim.date.toDate().toLocaleDateString() : '—'
  }
  return claim[key] ?? '—'
}

const PreviewTable = ({ visible, data, onClose }) => {
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      await handleExportData(data)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch {
      Alert.alert('Export Failed', 'There was an issue exporting the data. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const dateRange = () => {
    if (!data || data.length === 0) return null
    const dates = data
      .filter(c => c.date)
      .map(c => c.date.toDate())
      .sort((a, b) => a - b)
    if (dates.length === 0) return null
    const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    return `${fmt(dates[0])} – ${fmt(dates[dates.length - 1])}`
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Export Preview</Text>
            <Text style={styles.headerSub}>{data?.length ?? 0} records</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialIcons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Summary bar */}
        {data?.length > 0 && (
          <View style={styles.summaryBar}>
            <View style={styles.summaryChip}>
              <MaterialIcons name="list-alt" size={14} color="#5C2C92" />
              <Text style={styles.summaryText}>{data.length} Claims</Text>
            </View>
            {dateRange() && (
              <View style={styles.summaryChip}>
                <MaterialIcons name="date-range" size={14} color="#5C2C92" />
                <Text style={styles.summaryText}>{dateRange()}</Text>
              </View>
            )}
          </View>
        )}

        {/* Table */}
        {data?.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No claims to preview</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.tableWrapper}>
            <View>
              {/* Sticky header row */}
              <View style={[styles.row, styles.headerRow]}>
                {COLUMNS.map(col => (
                  <Text
                    key={col.key}
                    style={[styles.cell, styles.headerCell, { width: col.width }]}
                    numberOfLines={1}
                  >
                    {col.label}
                  </Text>
                ))}
              </View>

              {/* Data rows */}
              <ScrollView showsVerticalScrollIndicator style={styles.tableBody}>
                {data.map((claim, i) => (
                  <View key={i} style={[styles.row, i % 2 === 1 && styles.altRow]}>
                    {COLUMNS.map(col => (
                      <Text
                        key={col.key}
                        style={[styles.cell, { width: col.width }]}
                        numberOfLines={1}
                      >
                        {getCellValue(claim, col.key)}
                      </Text>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}

        {/* Footer actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.exportBtn,
              (exporting || data?.length === 0) && styles.exportBtnDisabled,
              exported && styles.exportBtnSuccess,
            ]}
            onPress={handleExport}
            disabled={exporting || data?.length === 0}
          >
            {exporting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : exported ? (
              <>
                <MaterialIcons name="check-circle" size={18} color="#fff" />
                <Text style={styles.exportBtnText}>Exported!</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="file-download" size={18} color="#fff" />
                <Text style={styles.exportBtnText}>Export Excel</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },

  // Header
  header: {
    backgroundColor: '#5C2C92',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Summary bar
  summaryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0e8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  summaryText: {
    fontSize: 12,
    color: '#5C2C92',
    fontWeight: '600',
  },

  // Table
  tableWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableBody: {
    maxHeight: 480,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  altRow: {
    backgroundColor: '#faf8ff',
  },
  headerRow: {
    backgroundColor: '#5C2C92',
  },
  cell: {
    paddingVertical: 11,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#333',
  },
  headerCell: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 15,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 15,
  },
  exportBtn: {
    flex: 2,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#5C2C92',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportBtnDisabled: {
    opacity: 0.5,
  },
  exportBtnSuccess: {
    backgroundColor: '#2e7d32',
  },
  exportBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
})

export default PreviewTable
