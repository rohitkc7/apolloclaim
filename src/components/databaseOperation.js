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

    console.log(
      'Inserting claim with following data:', formData
    )


    const result = await db.runAsync(
      `
      INSERT INTO claims (
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
        photos
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `,
      [
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
        photosString,
      ],
    )

    console.log('Claim saved successfully with ID:', result.lastInsertRowId)
    return result.lastInsertRowId
  } catch (error) {
    console.error('Failed to save claim:', error)
    throw error 
  }
}

export { insertClaim }
