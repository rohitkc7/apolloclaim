import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import ImageView from 'react-native-image-viewing'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const { width } = Dimensions.get('window')
const PHOTO_SIZE = (width - 80) / 3

const SectionCard = ({ icon, title, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <MaterialIcons name={icon} size={18} color="#5C2C92" />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
)

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || '—'}</Text>
  </View>
)

const Form3 = ({ formData }) => {
  const [imageViewVisible, setImageViewVisible] = useState(false)
  const [selectedIndex, setSelectedIndex]       = useState(0)

  const photos = formData.photos || []

  return (
    <View>
      <View style={styles.reviewBanner}>
        <MaterialIcons name="fact-check" size={20} color="#5C2C92" />
        <Text style={styles.reviewBannerText}>Review all details before submitting</Text>
      </View>

      <SectionCard icon="person-outline" title="Customer & Application">
        <Row label="Location"      value={formData.location} />
        <Row label="Customer Name" value={formData.customerName} />
        <Row label="Segment"       value={formData.segment} />
        <Row label="Application"   value={formData.application} />
      </SectionCard>

      <SectionCard icon="settings" title="Tyre Details">
        <Row label="Tyre Size"     value={formData.tyreSize} />
        <Row label="Ply Rating"    value={formData.plyRating} />
        <Row label="Company"       value={formData.companyName} />
        <Row label="Brand"         value={formData.brandName} />
        <Row label="Serial No."    value={formData.serialNumber} />
        <Row label="Mould No."     value={formData.mouldNo} />
        <View style={styles.nsdRow}>
          {['nsd1', 'nsd2', 'nsd3'].map(key => (
            <View key={key} style={styles.nsdChip}>
              <Text style={styles.nsdLabel}>{key.toUpperCase()}</Text>
              <Text style={styles.nsdValue}>{formData[key] || '—'}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard icon="report-problem" title="Defect Details">
        <Row label="Pattern"     value={formData.pattern} />
        <Row label="Defect Area" value={formData.defectArea} />
        <Row label="Defect Name" value={formData.defectName} />
      </SectionCard>

      {photos.length > 0 && (
        <SectionCard icon="photo-library" title={`Photos (${photos.length})`}>
          <View style={styles.photoGrid}>
            {photos.map((uri, i) => (
              <TouchableOpacity key={i} onPress={() => { setSelectedIndex(i); setImageViewVisible(true) }}>
                <Image source={{ uri }} style={styles.thumb} />
                <View style={styles.thumbOverlay}>
                  <MaterialIcons name="zoom-in" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>
      )}

      <ImageView
        images={photos.map(uri => ({ uri }))}
        imageIndex={selectedIndex}
        visible={imageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  reviewBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f0e8ff', borderRadius: 10, padding: 12,
    marginBottom: 14,
  },
  reviewBannerText: { color: '#5C2C92', fontWeight: '600', fontSize: 13, flex: 1 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 14, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },

  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#f8f8f8',
  },
  rowLabel: { fontSize: 13, color: '#888', flex: 1 },
  rowValue: { fontSize: 13, color: '#1a1a1a', fontWeight: '600', flex: 1, textAlign: 'right' },

  nsdRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  nsdChip: {
    flex: 1, alignItems: 'center', backgroundColor: '#f5f0ff',
    borderRadius: 10, paddingVertical: 10,
  },
  nsdLabel: { fontSize: 11, color: '#5C2C92', fontWeight: '700', marginBottom: 2 },
  nsdValue: { fontSize: 16, color: '#1a1a1a', fontWeight: '700' },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  thumb: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 10 },
  thumbOverlay: {
    position: 'absolute', bottom: 6, right: 6,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12,
    padding: 3,
  },
})

export default Form3
