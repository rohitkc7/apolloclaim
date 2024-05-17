import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('apollo.db')

db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        segment TEXT,
        application TEXT,
        tyreSize TEXT,
        plyRating TEXT,
        brandName TEXT,
        companyName TEXT,
        mouldNo TEXT,
        nsd1 TEXT,
        nsd2 TEXT,
        nsd3 TEXT,
        nsd4 TEXT,
        nsd5 TEXT,
        pattern TEXT,
        defectArea TEXT,
        defectName TEXT,
        pic1 TEXT
      )`,
    [],
    () => {
      console.log('Table claims created successfully.')
    },
    (error) => {
      console.error('Error creating table claims:', error)
    },
  )
})

export default db
