import React, { createContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Papa from 'papaparse';

// Create a context to store CSV data
export const CSVContext = createContext();

export const CSVProvider = ({ children }) => {
  const [csvData, setCSVData] = useState(null);

  // Load CSV file once
  const loadCSV = async () => {
    const csvPath = FileSystem.asset('assets/codes.csv');
    const csvContent = await FileSystem.readAsStringAsync(csvPath);

    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        complete: (result) => resolve(result.data),
        error: (error) => reject(error),
      });
    });
  };

  useEffect(() => {
    if (!csvData) {
      loadCSV().then((data) => {
        setCSVData(data);
      }).catch((error) => {
        console.error("Error loading CSV:", error);
      });
    }
  }, []);

  return (
    <CSVContext.Provider value={csvData}>
      {children}
    </CSVContext.Provider>
  );
};
