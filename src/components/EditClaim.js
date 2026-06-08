import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRoute, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { firestore } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { updateClaim } from './databaseOperation'
import { uploadPhotos } from './imageUploadService'
import Form  from './Form'
import Form1 from './Form1'
import Form2 from './Form2'

const EditClaim = () => {
  const route      = useRoute()
  const navigation = useNavigation()
  const { claimId } = route.params

  const [claimData, setClaimData] = useState({
    location: '', customerName: '', segment: '', application: '',
    tyreSize: '', plyRating: '', brandName: '', companyName: '',
    serialNumber: '', mouldNo: '', nsd1: '', nsd2: '', nsd3: '',
    pattern: '', defectArea: '', defectName: '', photos: [],
  })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(firestore, 'claims', claimId.toString()))
        if (snap.exists()) {
          const d = snap.data()
          setClaimData({
            location:     d.location     || '',
            customerName: d.customerName || '',
            segment:      d.segment      || '',
            application:  d.application  || '',
            tyreSize:     String(d.tyreSize  || ''),
            plyRating:    d.plyRating    || '',
            brandName:    d.brandName    || '',
            companyName:  d.companyName  || '',
            serialNumber: d.serialNumber || '',
            mouldNo:      d.mouldNo      || '',
            nsd1:         String(d.nsd1  || ''),
            nsd2:         String(d.nsd2  || ''),
            nsd3:         String(d.nsd3  || ''),
            pattern:      d.pattern      || '',
            defectArea:   d.defectArea   || '',
            defectName:   d.defectName   || '',
            photos:       Array.isArray(d.photos) ? d.photos : [],
          })
        }
      } catch (e) {
        console.error('Error fetching claim:', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [claimId])

  const handleChange = (field, value) =>
    setClaimData(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      // Upload any new local photos (local URIs start with file://)
      const existingUrls = claimData.photos.filter(p => p.startsWith('http'))
      const newLocals    = claimData.photos.filter(p => !p.startsWith('http'))
      const uploadedUrls = newLocals.length > 0 ? await uploadPhotos(newLocals) : []
      const finalPhotos  = [...existingUrls, ...uploadedUrls]

      await updateClaim(claimId, { ...claimData, photos: finalPhotos })
      Toast.show({ type: 'success', text1: 'Saved', text2: 'Claim updated successfully.' })
      setTimeout(() => navigation.goBack(), 1500)
    } catch (e) {
      console.error('Update failed:', e)
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save changes.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    Alert.alert('Discard Changes?', 'Any unsaved edits will be lost.', [
      { text: 'Keep Editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#5C2C92" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
          <MaterialIcons name="close" size={18} color="#B71C1C" />
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Claim</Text>
        <View style={{ width: 80 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Customer & Application</Text>
          <Form  formData={claimData} onChange={handleChange} />

          <Text style={styles.sectionLabel}>Tyre Details</Text>
          <Form1 formData={claimData} onChange={handleChange} />

          <Text style={styles.sectionLabel}>Defect & Photos</Text>
          <Form2 formData={claimData} onChange={handleChange} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <>
                <MaterialIcons name="check" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
          }
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f8' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  discardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, backgroundColor: '#fdecea',
  },
  discardText: { fontSize: 13, fontWeight: '600', color: '#B71C1C' },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },

  scroll: { padding: 16, gap: 8, paddingBottom: 24 },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: '#aaa',
    textTransform: 'uppercase', letterSpacing: 0.6,
    marginTop: 8, marginBottom: 4,
  },

  footer: {
    padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  saveBtn: {
    height: 52, borderRadius: 14, backgroundColor: '#5C2C92',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})

export default EditClaim
