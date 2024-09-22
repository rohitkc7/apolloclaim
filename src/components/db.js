import * as SQLite from 'expo-sqlite'

const setupDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('databaseName', {
    useNewConnection: true,
  })

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY NOT NULL,
      location TEXT,
      customerName TEXT,
      segment TEXT,
      application TEXT,
      tyreSize TEXT,
      plyRating TEXT,
      brandName TEXT,
      companyName TEXT,
      serialNumber TEXT,
      mouldNo TEXT,
      nsd1 TEXT,
      nsd2 TEXT,
      nsd3 TEXT,
      pattern TEXT,
      defectArea TEXT,
      defectName TEXT,
      photos TEXT
    );
  `)
  return db
}

export default setupDatabase
