
import { useEffect } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

const CreateDatabase = async() => {
const { db } = useSQLiteContext(); // Access the database context
  try {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS factures (
        id TEXT PRIMARY KEY,
        idunique TEXT,
        companyname TEXT,
        dueDate TEXT,
        dueTime TEXT,
        subtotal REAL,
        taxRate REAL,
        taxAmount REAL,
        paid BOOLEAN,
        total REAL,
        lat REAL,
        long REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);


      console.log('Database initialized !');
  } catch (error) {
      console.log('Error while initializing the database : ', error);
  }
    return null;
};



export default CreateDatabase;
