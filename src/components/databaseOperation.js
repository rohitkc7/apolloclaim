import { firestore } from '../../firebaseConfig'
import {
  collection,
  doc,
  updateDoc,
  runTransaction,
  getDoc,
  setDoc,
} from 'firebase/firestore'

const COUNTER_REF = doc(firestore, 'Counters', 'claims')

const insertClaim = async (formData) => {
  const {
    location, customerName, segment, application, tyreSize,
    plyRating, brandName, companyName, serialNumber, mouldNo,
    nsd1, nsd2, nsd3, pattern, defectArea, defectName, photos,
    date, userId,
  } = formData

  // Counter read AND increment are both inside the transaction
  // to prevent two simultaneous submissions getting the same ID.
  let newId
  await runTransaction(firestore, async (transaction) => {
    const counterSnap = await transaction.get(COUNTER_REF)
    const lastId = counterSnap.exists() ? (counterSnap.data().lastId || 0) : 0
    newId = lastId + 1

    const claimRef = doc(firestore, 'claims', newId.toString())
    transaction.set(claimRef, {
      location, customerName, segment, application, tyreSize,
      plyRating, brandName, companyName, serialNumber, mouldNo,
      nsd1, nsd2, nsd3, pattern, defectArea, defectName,
      photos,   // array of Cloudinary URLs
      date,
      userId,
    })
    transaction.set(COUNTER_REF, { lastId: newId })
  })

  return newId.toString()
}

const updateClaim = async (claimId, formData) => {
  const {
    location, customerName, segment, application, tyreSize,
    plyRating, brandName, companyName, serialNumber, mouldNo,
    nsd1, nsd2, nsd3, pattern, defectArea, defectName, photos,
  } = formData

  const claimRef = doc(firestore, 'claims', claimId.toString())
  await updateDoc(claimRef, {
    location, customerName, segment, application, tyreSize,
    plyRating, brandName, companyName, serialNumber, mouldNo,
    nsd1, nsd2, nsd3, pattern, defectArea, defectName,
    photos,   // array of Cloudinary URLs (not JSON string)
  })
}

export { insertClaim, updateClaim }
