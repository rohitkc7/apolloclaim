import { firestore } from '../../firebaseConfig' // Adjust the import based on your file structure
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  runTransaction,
  getDoc,
  setDoc,
} from 'firebase/firestore'

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
    } = formData

    const photosString = JSON.stringify(photos)

    console.log('Inserting claim with following data:', formData)
    const counterRef = doc(
      firestore,
      'Counters',
      'your-auto-generated-document-id',
    ) // Replace with your actual document ID

    // Read the current lastId outside of the transaction
    const counterDoc = await getDoc(counterRef)

    let lastId
    if (!counterDoc.exists()) {
      // If the document does not exist, initialize it
      console.error('Counter document does not exist! Initializing it now.')
      await setDoc(counterRef, { lastId: 0 })
      lastId = 0 // Initialize lastId
      console.log('Initialized counter with lastId: 0')
    } else {
      lastId = counterDoc.data().lastId || 0 // Default to 0 if lastId is undefined
      console.log('Current lastId:', lastId)
    }

    // Increment the lastId for the new claim
    lastId += 1

    // Run a transaction to create the new claim and update the counter
    await runTransaction(firestore, async (transaction) => {
      // Create the new claim document with the new sequential ID
      const claimRef = doc(firestore, 'claims', lastId.toString())
      await transaction.set(claimRef, {
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
        photos: photosString,
        date: new Date(),
      })

      // Update the counter document with the new last ID
      await transaction.update(counterRef, { lastId })
      console.log('Updated counter with new lastId:', lastId)
    })

    console.log('Claim saved successfully with ID:', lastId)
    return lastId.toString() // Return the new sequential ID
  } catch (error) {
    console.error('Failed to save claim:', error)
    throw error
  }
}

export { insertClaim }
