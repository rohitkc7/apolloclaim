import { Alert } from 'react-native'

export const previewData = (data, callback) => {
  Alert.alert('Preview Claims', JSON.stringify(data, null, 2), [
    { text: 'Confirm Export', onPress: () => callback(data) },
    { text: 'Cancel', style: 'cancel' },
  ])
}
