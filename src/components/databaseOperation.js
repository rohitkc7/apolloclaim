import * as SQLite from 'expo-sqlite'
import db from './db'
//const db = SQLite.openDatabase('apollo.db')

// db.transaction((tx) => {
//   tx.executeSql(
//     'CREATE TABLE IF NOT EXISTS claims (id INTEGER PRIMARY KEY AUTOINCREMENT, claimTitle TEXT, tyreSize TEXT, brandName TEXT, companyName TEXT, serialNumber INTEGER, mouldNo INTEGER, nsd1 INTEGER, nsd2 INTEGER, nsd3 INTEGER, nsd4 INTEGER, nsd5 INTEGER, defectArea TEXT, defectName TEXT)',
//   )
// })

const insertClaim = (formData, onSuccess, onError) => {
  const {
    claimTitle,
    tyreSize,
    brandName,
    companyName,
    serialNumber,
    mouldNo,
    nsd1,
    nsd2,
    nsd3,
    nsd4,
    nsd5,
    defectArea,
    defectName,
  } = formData

  db.transaction(
    (tx) => {
      console.log('transaction started')
      tx.executeSql(
        'INSERT INTO claims (claimTitle, tyreSize, brandName, companyName, serialNumber, mouldNo, nsd1, nsd2, nsd3, nsd4, nsd5, defectArea, defectName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          claimTitle,
          tyreSize,
          brandName,
          companyName,
          serialNumber,
          mouldNo,
          nsd1,
          nsd2,
          nsd3,
          nsd4,
          nsd5,
          defectArea,
          defectName,
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
    },
  )
}

export { insertClaim }
