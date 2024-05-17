import * as SQLite from 'expo-sqlite'
import db from './db'

const insertClaim = (formData, onSuccess, onError) => {
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
    pic1,
  } = formData

  db.transaction(
    (tx) => {
      console.log('transaction started')
      console.log(
        'Values:',
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
        pic1,
      )

      tx.executeSql(
        'INSERT INTO claims (segment, application, tyreSize, plyRating,  brandName, companyName, mouldNo, nsd1, nsd2, nsd3, nsd4, nsd5, pattern, defectArea, defectName, pic1) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)',
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
          pic1,
        ],
        (_, results) => {
          onSuccess(results.insertId)
        },
        (_, error) => {
          onError(error)
        },
      )
    },
    (error) => {
      onError(error)
    },
    () => {
      console.log('Transaction completed successfully')
      console.log('')
    },
  )
}

export { insertClaim }
