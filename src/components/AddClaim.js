import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Form from './Form'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
import { insertClaim } from './databaseOperation'
import { uploadPhotos } from './imageUploadService'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import * as MediaLibrary from 'expo-media-library'
import { Timestamp } from 'firebase/firestore'
import { auth } from '../../firebaseConfig'

const STEPS = [
  { label: 'Customer',  icon: 'person-outline'      },
  { label: 'Tyre',      icon: 'settings-outlined'   },
  { label: 'Defect',    icon: 'camera-alt'           },
  { label: 'Review',    icon: 'fact-check'           },
]

const initialFormData = {
  location: '', customerName: '', segment: '', application: '',
  tyreSize: '', plyRating: '', brandName: '', companyName: '',
  serialNumber: '', mouldNo: '', nsd1: '', nsd2: '', nsd3: '',
  pattern: '', defectArea: '', defectName: '', photos: [],
}

const AddClaim = ({ navigation }) => {
  const [formData, setFormData]     = useState(initialFormData)
  const [currentPage, setCurrentPage] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      setFormData(initialFormData)
      setCurrentPage(1)
    }, []),
  )

  const handleFormChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const submitData = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      Toast.show({ type: 'error', text1: 'Not logged in', text2: 'Please log in to submit a claim.' })
      return
    }
    setSubmitting(true)
    try {
      // Upload photos to Firebase Storage → get permanent public URLs
      let photoUrls = []
      if (formData.photos?.length > 0) {
        Toast.show({ type: 'info', text1: 'Uploading photos…', text2: `${formData.photos.length} photo(s)` })
        photoUrls = await uploadPhotos(formData.photos)

        // Also save to device gallery
        const { status } = await MediaLibrary.requestPermissionsAsync()
        if (status === 'granted') {
          for (const uri of formData.photos) {
            await MediaLibrary.createAssetAsync(uri).catch(() => {})
          }
        }
      }

      await insertClaim({
        ...formData,
        photos: photoUrls,   // store cloud URLs, not local paths
        date: Timestamp.now(),
        userId: currentUser.uid,
      })
      setFormData(initialFormData)
      Toast.show({ type: 'success', text1: 'Submitted!', text2: 'Claim saved successfully.' })
      setTimeout(() => navigation.navigate('HomeApollo'), 1800)
    } catch (error) {
      console.error('Submit failed:', error)
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save claim. Try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const goNext = () => {
    if (currentPage < 4) setCurrentPage(p => p + 1)
    else submitData()
  }

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1)
  }

  const renderForm = () => {
    switch (currentPage) {
      case 1: return <Form formData={formData} onChange={handleFormChange} />
      case 2: return <Form1 formData={formData} onChange={handleFormChange} />
      case 3: return <Form2 formData={formData} onChange={handleFormChange} />
      case 4: return <Form3 formData={formData} />
      default: return null
    }
  }

  const isLastStep  = currentPage === 4
  const isFirstStep = currentPage === 1

  const handleDiscard = () => {
    Alert.alert(
      'Discard Claim?',
      'All entered data will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setFormData(initialFormData)
            setCurrentPage(1)
            navigation.navigate('HomeApollo')
          },
        },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>

      {/* Top header with discard */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
          <MaterialIcons name="close" size={18} color="#B71C1C" />
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>New Claim</Text>
        <View style={styles.topBarRight} />
      </View>

      {/* Progress stepper */}
      <View style={styles.stepper}>
        {STEPS.map((step, i) => {
          const stepNum   = i + 1
          const done      = stepNum < currentPage
          const active    = stepNum === currentPage
          return (
            <React.Fragment key={i}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, done && styles.stepDone, active && styles.stepActive]}>
                  {done
                    ? <MaterialIcons name="check" size={14} color="#fff" />
                    : <MaterialIcons name={step.icon} size={14} color={active ? '#fff' : '#aaa'} />
                  }
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
                  {step.label}
                </Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepConnector, done && styles.stepConnectorDone]} />
              )}
            </React.Fragment>
          )
        })}
      </View>

      {/* Step title */}
      <View style={styles.titleRow}>
        <Text style={styles.stepTitle}>{STEPS[currentPage - 1].label} Details</Text>
        <Text style={styles.stepCount}>Step {currentPage} of {STEPS.length}</Text>
      </View>

      {/* Form content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderForm()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky bottom navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.prevBtn, isFirstStep && styles.btnDisabled]}
          onPress={goPrev}
          disabled={isFirstStep}
        >
          <MaterialIcons name="arrow-back" size={18} color={isFirstStep ? '#ccc' : '#5C2C92'} />
          <Text style={[styles.prevBtnText, isFirstStep && styles.btnDisabledText]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, submitting && styles.btnDisabled]}
          onPress={goNext}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>
                {isLastStep ? 'Submit Claim' : currentPage === 3 ? 'Preview' : 'Next'}
              </Text>
              <MaterialIcons name={isLastStep ? 'check' : 'arrow-forward'} size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f8' },

  // Top header
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  discardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, backgroundColor: '#fdecea',
  },
  discardText: { fontSize: 13, fontWeight: '600', color: '#B71C1C' },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  topBarRight: { width: 80 },   // balance the discard button width

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#e8e8e8',
    alignItems: 'center', justifyContent: 'center',
  },
  stepDone:   { backgroundColor: '#5C2C92' },
  stepActive: { backgroundColor: '#5C2C92' },
  stepLabel:  { fontSize: 10, color: '#aaa', fontWeight: '500' },
  stepLabelActive: { color: '#5C2C92', fontWeight: '700' },
  stepConnector: {
    flex: 1, height: 2, backgroundColor: '#e8e8e8', marginBottom: 14, marginHorizontal: 4,
  },
  stepConnectorDone: { backgroundColor: '#5C2C92' },

  // Title
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  stepTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  stepCount: { fontSize: 12, color: '#888' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  prevBtn: {
    flex: 1, height: 50, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: '#5C2C92',
  },
  prevBtnText: { color: '#5C2C92', fontWeight: '600', fontSize: 15 },
  nextBtn: {
    flex: 2, height: 50, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#5C2C92',
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.4 },
  btnDisabledText: { color: '#ccc' },
})

export default AddClaim
