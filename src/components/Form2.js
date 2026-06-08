import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { patternData, defectAreaData, defectNameData } from './tyreData'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'

const { width } = Dimensions.get('window')
const PHOTO_SIZE = (width - 60) / 3

const DropdownField = ({ label, data, value, onChange }) => {
  const [isFocus, setIsFocus] = useState(false)
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#5C2C92' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={value}
        onChange={(item) => onChange(item.value)}
      />
    </>
  )
}

const CameraScreen = ({ onClose, onPhotoTaken }) => {
  const [facing, setFacing] = useState('back')
  const [capturing, setCapturing] = useState(false)
  const insets = useSafeAreaInsets()
  const cameraRef = useRef(null)

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return
    setCapturing(true)
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 })
      onPhotoTaken(photo.uri)
    } catch (e) {
      console.error('Failed to take photo:', e)
    } finally {
      setCapturing(false)
    }
  }

  return (
    <View style={styles.cameraScreen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        ref={cameraRef}
      />

      {/* Top bar */}
      <View style={[styles.cameraTopBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.cameraIconBtn} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraIconBtn}
          onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
        >
          <MaterialIcons name="flip-camera-android" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom controls */}
      <View style={[styles.cameraBottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.shutterBtn, capturing && styles.shutterBtnDisabled]}
          onPress={takePhoto}
          disabled={capturing}
          activeOpacity={0.8}
        >
          {capturing
            ? <ActivityIndicator color="#5C2C92" size="small" />
            : <View style={styles.shutterInner} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Form2 = ({ formData, onChange }) => {
  const [showCamera, setShowCamera] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const [photos, setPhotos] = useState(formData.photos || [])
  const [filteredDefectNames, setFilteredDefectNames] = useState([])

  const handleDefectAreaChange = (value) => {
    onChange('defectArea', value)
    setFilteredDefectNames(defectNameData.filter(d => d.defectArea === value))
    onChange('defectName', '')
  }

  const addPhotos = (uris) => {
    const newPhotos = [...photos, ...uris]
    setPhotos(newPhotos)
    onChange('photos', newPhotos)
  }

  const handlePhotoTaken = (filePath) => {
    addPhotos([filePath])
    setShowCamera(false)
  }

  const handlePickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Please allow photo library access in your device settings.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    })
    if (!result.canceled && result.assets?.length > 0) {
      addPhotos(result.assets.map(a => a.uri))
    }
  }

  const removePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index)
    setPhotos(updated)
    onChange('photos', updated)
  }

  if (!permission) return <View />

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off-outline" size={48} color="#999" />
        <Text style={styles.permissionText}>Camera access is required to add photos</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DropdownField
        label="Pattern"
        data={patternData}
        value={formData.pattern}
        onChange={(value) => onChange('pattern', value)}
      />
      <DropdownField
        label="Defect Area"
        data={defectAreaData}
        value={formData.defectArea}
        onChange={handleDefectAreaChange}
      />
      <DropdownField
        label="Defect Name"
        data={filteredDefectNames}
        value={formData.defectName}
        onChange={(value) => onChange('defectName', value)}
      />

      {/* Photos section */}
      <View style={styles.photoSection}>
        <View style={styles.photoSectionHeader}>
          <Text style={styles.inputLabel}>Photos</Text>
          {photos.length > 0 && (
            <Text style={styles.photoCount}>{photos.length} photo{photos.length !== 1 ? 's' : ''}</Text>
          )}
        </View>

        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoThumb}>
              <Image source={{ uri }} style={styles.thumbImage} />
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={() => removePhoto(index)}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Entypo name="circle-with-cross" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Camera tile */}
          <TouchableOpacity style={styles.addPhotoTile} onPress={() => setShowCamera(true)}>
            <Ionicons name="camera-outline" size={28} color="#5C2C92" />
            <Text style={styles.addPhotoText}>Camera</Text>
          </TouchableOpacity>

          {/* Library tile */}
          <TouchableOpacity style={[styles.addPhotoTile, styles.libraryTile]} onPress={handlePickFromLibrary}>
            <MaterialIcons name="photo-library" size={28} color="#1565C0" />
            <Text style={[styles.addPhotoText, styles.libraryText]}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showCamera} animationType="slide" statusBarTranslucent>
        <CameraScreen
          onClose={() => setShowCamera(false)}
          onPhotoTaken={handlePhotoTaken}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  placeholderStyle: { fontSize: 15, color: '#999' },
  selectedTextStyle: { fontSize: 15, color: '#1a1a1a' },
  inputSearchStyle: { height: 40, fontSize: 15 },

  // Photo section
  photoSection: { marginTop: 8, marginBottom: 20 },
  photoSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoCount: { fontSize: 13, color: '#5C2C92', fontWeight: '600' },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoThumb: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
  },
  addPhotoTile: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#5C2C92',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f5ff',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 12,
    color: '#5C2C92',
    fontWeight: '600',
  },
  libraryTile: {
    borderColor: '#1565C0',
    backgroundColor: '#f0f4ff',
  },
  libraryText: {
    color: '#1565C0',
  },

  // Permission screen
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  permissionText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: '#5C2C92',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // Camera screen
  cameraScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  cameraIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  shutterBtnDisabled: {
    opacity: 0.6,
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
})

export default Form2
