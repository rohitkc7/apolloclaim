import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
  Modal,
} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { Camera, CameraType } from 'expo-camera/legacy'
import * as FileSystem from 'expo-file-system'
import { patternData, defectAreaData, defectNameData } from './tyreData'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Entypo from '@expo/vector-icons/Entypo'

const DropdownField = ({ label, data, value, onChange }) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={value}
        onChange={(item) => onChange(item.value)}
      />
    </>
  )
}
const Form3 = ({ formData, onChange, onPic1Change }) => {
  const [showCamera, setShowCamera] = useState(false)
  const [type, setType] = useState(CameraType.back)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [photos, setPhotos] = useState(formData.photos || [])
  const [filteredDefectNames, setFilteredDefectNames] = useState([])

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )
  }

  const toggleCameraType = () => {
    setType((prevType) =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    )
  }

  const takePhoto = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync({ base64: true })
      const fileName = `photo_${Date.now()}.jpg`
      const filePath = `${FileSystem.documentDirectory}${fileName}`

      await FileSystem.writeAsStringAsync(filePath, photo.base64, {
        encoding: FileSystem.EncodingType.Base64,
      })

      const newPhotos = [...photos, filePath]
      setPhotos(newPhotos)
      onChange('photos', newPhotos)
      setShowCamera(false)
    }
  }

  let cameraRef

  const handleDefectAreaChange = (value) => {
    onChange('defectArea', value)

    const filteredNames = defectNameData.filter(
      (defect) => defect.defectArea === value,
    )
    setFilteredDefectNames(filteredNames)

    onChange('defectName', '')
  }

  // Function to remove a photo
  const removePhoto = (index) => {
    const updatedPhotos = [...photos]
    updatedPhotos.splice(index, 1)
    setPhotos(updatedPhotos)
    onChange('photos', updatedPhotos)
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
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
      </View>
      <View style={styles.cameraContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.text}>Click a Photo</Text>
        </TouchableOpacity>
        {photos.length > 0 && (
          <ScrollView horizontal style={styles.photoContainer}>
            {photos.slice(0, 3).map((photoUri, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removePhoto(index)}
                >
                  <Entypo name="circle-with-cross" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Modal visible={showCamera} transparent={false} animationType="slide">
        <View style={styles.modalContainer}>
          <Camera
            style={styles.fullScreenCamera}
            type={type}
            ratio="4:3"
            zoom={0}
            ref={(ref) => {
              cameraRef = ref
            }}
          >
            <View style={styles.fullScreenButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <MaterialIcons
                  name="flip-camera-android"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <EvilIcons name="camera" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="exit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  focused: {
    borderColor: 'blue',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  fullScreenCamera: {
    flex: 1,
  },
  fullScreenButtonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  photoContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  removeIcon: {
    position: 'absolute',
    top: 0,
    right: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 2,
  },
})
export default Form3
