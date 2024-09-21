import setupDatabase from './db'

const insertClaim = async (formData) => {
  try {
    const db = await setupDatabase()
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
    const dateSubmitted = new Date().toISOString() // Get the current date in ISO format

    console.log('Inserting claim with following data:', formData)
    const result = await db.runAsync(
      `
      INSERT INTO claims (
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
        dateSubmitted
      )
      VALUES (? , ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,? )
      `,
      [
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
        photosString,
        dateSubmitted,
      ],
    )

    console.log('Claim saved successfully with ID:', result.lastInsertRowId)
    return result.lastInsertRowId
  } catch (error) {
    console.error('Failed to save claim:', error)
    throw error
  }
}
const updateClaim = async (claimId, formData) => {
  try {
    const db = await setupDatabase()
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

    const result = await db.runAsync(
      `
      UPDATE claims 
      SET location=?, customerName=?, segment=?, application=?, tyreSize=?, plyRating=?, brandName=?, companyName=?, serialNumber=?, mouldNo=?, nsd1=?, nsd2=?, nsd3=?, pattern=?, defectArea=?, defectName=?, photos=? 
      WHERE id=?
      `,
      [
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
        photosString,
        claimId,
      ],
    )
    return result
  } catch (error) {
    console.error('Failed to update claim:', error)
    throw error
  }
}

export { insertClaim, updateClaim }
