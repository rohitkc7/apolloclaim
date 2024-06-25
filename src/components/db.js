import * as SQLite from 'expo-sqlite'

const setupDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('databaseName')
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY NOT NULL,
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
      photos TEXT
    );
  `)
  return db
}

export default setupDatabase
