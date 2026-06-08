const CLOUD_NAME    = 'dl2h3cxfu'
const UPLOAD_PRESET = 'Apollo'
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

/**
 * Uploads a single local image URI to Cloudinary.
 * Returns a permanent public HTTPS URL accessible from any device.
 */
export const uploadImage = async (localUri) => {
  const formData = new FormData()

  formData.append('file', {
    uri: localUri,
    type: 'image/jpeg',
    name: `photo_${Date.now()}.jpg`,
  })
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'claims')

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  return data.secure_url  // permanent HTTPS URL, stored in Firestore
}

/**
 * Uploads multiple local photo URIs to Cloudinary in parallel.
 * Returns an array of permanent public URLs in the same order.
 */
export const uploadPhotos = async (localUris) => {
  if (!localUris || localUris.length === 0) return []
  return Promise.all(localUris.map(uploadImage))
}
