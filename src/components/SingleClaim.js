import React, { useState, useEffect } from 'react'
import {
  View, Text, Image, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import ImageView from 'react-native-image-viewing'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { firestore } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

const { width } = Dimensions.get('window')
const PHOTO_SIZE = (width - 80) / 3

const fmtDate = (ts) => {
  try {
    return ts?.toDate().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric',
    })
  } catch { return '—' }
}

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
    <Text style={styles.rowValue} numberOfLines={2}>{value || '—'}</Text>
  </View>
)

const SingleClaim = ({ route }) => {
  const [claim, setClaim]                     = useState(null)
  const [loading, setLoading]                 = useState(true)
  const [imageViewVisible, setImageViewVisible] = useState(false)
  const [selectedIndex, setSelectedIndex]     = useState(0)
  const { claimId } = route.params
  const navigation  = useNavigation()

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(firestore, 'claims', claimId))
        if (snap.exists()) {
          const data = snap.data()
          // photos is now stored as a Firestore array of URLs (no JSON.parse needed)
          data.photos = Array.isArray(data.photos) ? data.photos : []
          setClaim(data)
          navigation.setOptions({ title: `Claim #N${String(claimId).padStart(5, '0')}` })
        }
      } catch (e) {
        console.error('Error fetching claim:', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [claimId])

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#5C2C92" />
        <Text style={styles.loadingText}>Loading claim…</Text>
      </SafeAreaView>
    )
  }

  if (!claim) {
    return (
      <SafeAreaView style={styles.center}>
        <MaterialIcons name="error-outline" size={52} color="#ddd" />
        <Text style={styles.emptyTitle}>Claim not found</Text>
      </SafeAreaView>
    )
  }

  const photos = claim.photos || []

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero badge */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroIssue}>N{String(claimId).padStart(5, '0')}</Text>
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.heroRow}>
              <MaterialIcons name="calendar-today" size={13} color="#999" />
              <Text style={styles.heroDate}>{fmtDate(claim.date)}</Text>
            </View>
            <View style={styles.heroRow}>
              <MaterialIcons name="location-on" size={13} color="#999" />
              <Text style={styles.heroLocation}>{claim.location || '—'}</Text>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('EditClaim', { claimId })}
            >
              <MaterialIcons name="edit" size={14} color="#5C2C92" />
              <Text style={styles.editBtnText}>Edit Claim</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer & Application */}
        <SectionCard icon="person-outline" title="Customer & Application">
          <Row label="Customer Name" value={claim.customerName} />
          <Row label="Segment"       value={claim.segment} />
          <Row label="Application"   value={claim.application} />
        </SectionCard>

        {/* Tyre Details */}
        <SectionCard icon="settings" title="Tyre Details">
          <Row label="Tyre Size"    value={claim.tyreSize} />
          <Row label="Ply Rating"   value={claim.plyRating} />
          <Row label="Company Name" value={claim.companyName} />
          <Row label="Brand Name"   value={claim.brandName} />
          <Row label="Serial No."   value={claim.serialNumber} />
          <Row label="Mould No."    value={claim.mouldNo} />

          <View style={styles.nsdRow}>
            {['nsd1', 'nsd2', 'nsd3'].map(key => (
              <View key={key} style={styles.nsdChip}>
                <Text style={styles.nsdLabel}>{key.toUpperCase()}</Text>
                <Text style={styles.nsdValue}>{claim[key] || '—'}</Text>
              </View>
            ))}
          </View>
        </SectionCard>

        {/* Defect Details */}
        <SectionCard icon="report-problem" title="Defect Details">
          <Row label="Pattern"     value={claim.pattern} />
          <Row label="Defect Area" value={claim.defectArea} />
          <Row label="Defect Name" value={claim.defectName} />
        </SectionCard>

        {/* Photos */}
        {photos.length > 0 ? (
          <SectionCard icon="photo-library" title={`Photos (${photos.length})`}>
            <View style={styles.photoGrid}>
              {photos.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setSelectedIndex(i); setImageViewVisible(true) }}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri }} style={styles.thumb} />
                  <View style={styles.thumbOverlay}>
                    <MaterialIcons name="zoom-in" size={18} color="#fff" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </SectionCard>
        ) : (
          <SectionCard icon="photo-library" title="Photos">
            <View style={styles.noPhotos}>
              <MaterialIcons name="image-not-supported" size={32} color="#ddd" />
              <Text style={styles.noPhotosText}>No photos attached</Text>
            </View>
          </SectionCard>
        )}
      </ScrollView>

      <ImageView
        images={photos.map(uri => ({ uri }))}
        imageIndex={selectedIndex}
        visible={imageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  scroll: { padding: 16, paddingBottom: 32 },

  // States
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#f5f5f8' },
  loadingText: { color: '#999', fontSize: 14 },
  emptyTitle:  { fontSize: 16, color: '#aaa', fontWeight: '600' },

  // Hero
  hero: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  heroBadge: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: '#f0e8ff', alignItems: 'center', justifyContent: 'center',
  },
  heroIssue: { fontSize: 13, fontWeight: '800', color: '#5C2C92', textAlign: 'center' },
  heroMeta:  { flex: 1, gap: 6 },
  heroRow:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroDate:  { fontSize: 13, color: '#555', fontWeight: '500' },
  heroLocation: { fontSize: 13, color: '#555', fontWeight: '500', flex: 1 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8,
    backgroundColor: '#f0e8ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editBtnText: { fontSize: 12, color: '#5C2C92', fontWeight: '700' },

  // Section cards
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 14, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },

  // Rows
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f8f8f8',
  },
  rowLabel: { fontSize: 13, color: '#888', flex: 1 },
  rowValue: { fontSize: 13, color: '#1a1a1a', fontWeight: '600', flex: 1.2, textAlign: 'right' },

  // NSD chips
  nsdRow:  { flexDirection: 'row', gap: 10, marginTop: 12 },
  nsdChip: {
    flex: 1, alignItems: 'center', backgroundColor: '#f5f0ff',
    borderRadius: 10, paddingVertical: 10,
  },
  nsdLabel: { fontSize: 11, color: '#5C2C92', fontWeight: '700', marginBottom: 2 },
  nsdValue: { fontSize: 17, color: '#1a1a1a', fontWeight: '800' },

  // Photos
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 10 },
  thumbOverlay: {
    position: 'absolute', bottom: 6, right: 6,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: 3,
  },
  noPhotos: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  noPhotosText: { color: '#bbb', fontSize: 13 },
})

export default SingleClaim
