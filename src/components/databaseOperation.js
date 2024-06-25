import setupDatabase from './db'

const insertClaim = async (formData) => {
  try {
    const db = await setupDatabase()
    const {
      segment,
      application,
      tyreSize,
      plyRating,
      brandName,
      companyName,
      mouldNo,
      nsd1,
      nsd2,
      nsd3,
      nsd4,
      nsd5,
      pattern,
      defectArea,
      defectName,
      photos,
    } = formData

    const photosString = JSON.stringify(photos)
    console.log('Photos being saved:', photosString)

    const result = await db.runAsync(
      `
      INSERT INTO claims (
        segment,
        application,
        tyreSize,
        plyRating,
        brandName,
        companyName,
        mouldNo,
        nsd1,
        nsd2,
        nsd3,
        nsd4,
        nsd5,
        pattern,
        defectArea,
        defectName,
        photos
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        segment,
        application,
        tyreSize,
        plyRating,
        brandName,
        companyName,
        mouldNo,
        nsd1,
        nsd2,
        nsd3,
        nsd4,
        nsd5,
        pattern,
        defectArea,
        defectName,
        photosString,
      ],
    )

    console.log('Claim saved successfully with ID:', result.lastInsertRowId)
    return result.lastInsertRowId
  } catch (error) {
    console.error('Failed to save claim:', error)
    throw error // Propagate the error for handling at higher levels
  }
}

export { insertClaim }
