import * as SQLite from 'expo-sqlite'
import { openDatabase } from 'expo-sqlite'

const db = SQLite.openDatabase('apollo.db')

db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS claims (id INTEGER PRIMARY KEY AUTOINCREMENT, claimTitle TEXT, tyreSize TEXT, brandName TEXT, companyName TEXT, serialNumber INTEGER, mouldNo INTEGER, nsd1 INTEGER, nsd2 INTEGER, nsd3 INTEGER, nsd4 INTEGER, nsd5 INTEGER, defectArea TEXT, defectName TEXT, image TEXT)',
  )
})

export default db
