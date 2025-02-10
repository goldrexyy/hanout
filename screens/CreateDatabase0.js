import { useEffect,useState  } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

const initializeDatabase = async(db) => {
    try {
        await db.execAsync(
           `CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            brand TEXT,
            quantity INTEGER,
            price REAL,
            stock INTEGER,
            nearbySold INTEGER,
            timesSold INTEGER,
            avatar TEXT,
            ean TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`);

          await db.execAsync(
            `CREATE TABLE IF NOT EXISTS clients (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              avatar TEXT,
              birthDate TEXT,
              description TEXT,
              sex TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);

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

              await db.execAsync(
                `CREATE TABLE IF NOT EXISTS detailsfacture (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  factureId TEXT,
                  productId TEXT,
                  quantity INTEGER,
                  price REAL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`);


        console.log('Database initialized !');
    } catch (error) {
        console.log('Error while initializing the database : ', error);
    }
      return null;
};

export default CreateDatabase;
