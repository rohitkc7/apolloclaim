import { firestore } from '../../firebaseConfig' // Adjust the import based on your file structure
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'

// Function to insert a new claim into Firestore
const insertClaim = async (formData) => {
  try {
    const {
      location,
      customerName,
      segment,
      application,
      tyreSize,
      plyRating,
      brandName,
      companyName,
      serialNumber,
      mouldNo,
      nsd1,
      nsd2,
      nsd3,
      pattern,
      defectArea,
      defectName,
      photos,
      date, // Add the date field if you want to store it
    } = formData

    const photosString = JSON.stringify(photos) // Assuming photos is an array

    console.log('Inserting claim with following data:', formData)

    // Adding document to the 'claims' collection
    const docRef = await addDoc(collection(firestore, 'claims'), {
      location,
      customerName,
      segment,
      application,
      tyreSize,
      plyRating,
      brandName,
      companyName,
      serialNumber,
      mouldNo,
      nsd1,
      nsd2,
      nsd3,
      pattern,
      defectArea,
      defectName,
      photos: photosString, // Store photos as a string
      date: new Date(), // Store current date and time
    })

    console.log('Claim saved successfully with ID:', docRef.id)
    return docRef.id // Return the document ID
  } catch (error) {
    console.error('Failed to save claim:', error)
    throw error
  }
}

// Function to update an existing claim in Firestore
const updateClaim = async (claimId, formData) => {
  try {
    const {
      location,
      customerName,
      segment,
      application,
      tyreSize,
      plyRating,
      brandName,
      companyName,
      serialNumber,
      mouldNo,
      nsd1,
      nsd2,
      nsd3,
      pattern,
      defectArea,
      defectName,
      photos,
      date, // Add the date field if you want to store it
    } = formData

    const photosString = JSON.stringify(photos) // Assuming photos is an array

    const claimRef = doc(firestore, 'claims', claimId) // Reference to the document

    await updateDoc(claimRef, {
      location,
      customerName,
      segment,
      application,
      tyreSize,
      plyRating,
      brandName,
      companyName,
      serialNumber,
      mouldNo,
      nsd1,
      nsd2,
      nsd3,
      pattern,
      defectArea,
      defectName,
      photos: photosString, // Store photos as a string
      date: new Date(), // Update the date
    })

    console.log('Claim updated successfully with ID:', claimId)
  } catch (error) {
    console.error('Failed to update claim:', error)
    throw error
  }
}

export { insertClaim, updateClaim }
