// imageUploadService.js
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const uploadImage = async (uri) => {
  const storage = getStorage()
  const filename = uri.substring(uri.lastIndexOf('/') + 1) // Extract filename from URI
  const storageRef = ref(storage, `images/${filename}`) // Create a reference to the location in storage

  try {
    // Convert the image URI to a Blob
    const response = await fetch(uri)
    const blob = await response.blob()

    // Upload the image Blob to Firebase Storage
    await uploadBytes(storageRef, blob)

    // Get the public URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL // Return the public URL
  } catch (error) {
    throw error // Rethrow the error to handle it in the calling function
  }
}
