import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet , Image} from 'react-native';
import ImageView from 'react-native-image-viewing';


const Form3 = ({ formData, onSubmit }) => {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setIsImageViewVisible(true);
  };
  return (
    <View>
    <View style={styles.previewContainer}>
      {Object.keys(formData).map((key) => (
        <View key={key} style={styles.previewItem}>
          <Text style={styles.previewLabel}>{key}:</Text>
          {key === 'photos' && Array.isArray(formData[key]) ? (
            <View style={styles.photosContainer}>
              {formData[key].map((photoUri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(index)}
                >
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.imagePreview}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.previewValue}>{formData[key]}</Text>
          )}
        </View>
      ))}
    </View>

    <ImageView
      images={formData.photos.map((uri) => ({ uri }))}
      imageIndex={selectedImageIndex}
      visible={isImageViewVisible}
      onRequestClose={() => setIsImageViewVisible(false)}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    padding: 20,
  },
  previewItem: {
    marginBottom: 10,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewValue: {
    fontSize: 16,
    marginLeft: 10,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Form3;
