// screens/CalculatorScreen.js

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

const { width, height } = Dimensions.get('window');

const Keypad = ({handleUnknownProductfromKeypad}) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const pressQueue = useRef([]); // Queue to hold button presses
  const processing = useRef(false); // Flag to check if processing is ongoing
  const db = useSQLiteContext();

  // Function to process the next button press in the queue
 const processQueue = () => {
   if (pressQueue.current.length > 0 && !processing.current) {
     processing.current = true;
     const nextValue = pressQueue.current.shift(); // Get the next value from the queue

     // Call handlePress with the next value and process it
     handlePress(nextValue);

     // Small delay before processing the next item
     setTimeout(() => {
       processing.current = false;
       processQueue(); // Process the next item in the queue
     }, 50); // Adjust delay if needed
   }
 };

 // Function to handle button presses (enqueue them for processing)
 const enqueuePress = (value) => {
   pressQueue.current.push(value);
   processQueue(); // Start processing the queue
 };




   // Handle button presses with debounce logic
    const handlePress = (value) => {
      if (value === 'C') {
        setInput('');
      } else if (value === 'DEL') {
        handleDelete();
      } else if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
      } else {
        setInput((prev) => prev + value); // Update input
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    };


    // Start or reset the debounce timer whenever input changes
     useEffect(() => {
       if (debounceTimeout) clearTimeout(debounceTimeout);

       // Only proceed if input meets the condition: at least 4 characters and starts with "0"
       if (input.length >= 4 && input.startsWith('0')) {
         const timeout = setTimeout(() => {
           searchProductById(); // Call search if no input change in 2 seconds
         }, 2000);

         setDebounceTimeout(timeout);

         return () => clearTimeout(timeout);
       }
     }, [input]);


  // Function to search product by product ID after a delay
  const searchProductById = async () => {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM detailsfacture
         WHERE deleted = 0
           AND productid = ?
           AND id IN (
             SELECT MAX(id)
             FROM detailsfacture
             WHERE deleted = 0
               AND productid = ?
             GROUP BY productid
           )`,
        [input, input]
      );
      handleUnknownProductfromKeypad(result);
      // Process result as needed
      console.log("Product details:", result);
      console.log("input:", input);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Function to handle delete button press
 const handleDelete = () => {
   if (input.length > 0) {
     setInput((prev) => prev.slice(0, -1));
   }
 };

  // Calculate the result with operator precedence
  const calculateResult = (expression) => {
     try {
       // Sanitize input to prevent code injection
       const sanitizedInput = expression.replace(/[^-()\d/*+.]/g, '');
       const evalResult = Function(`"use strict"; return (${sanitizedInput})`)();
       setResult(evalResult.toFixed(2));
     } catch (error) {
       setResult('');
     }
   };

  // Use useEffect to calculate result automatically when input changes
  useEffect(() => {
    if (input) {
      calculateResult(input);
    } else {
      setResult('');
    }
  }, [input]);

  // Define calculator buttons
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C','DEL', '0'],
  ];

  const styless = StyleSheet.create({
    ButtonCreatInvoiceContainer: {
      left: 0,
      flex:0.1,
      right: 0,
      bottom: 0,
    alignSelf: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop:10,
    },

    creatinvoicebutton :{
      backgroundColor:result === '' ? '#f2f2f2' : '#3682B3',
      borderRadius: 20,
      borderColor:'transparent',
      flex: 1,
     marginHorizontal:10,

   // Space between buttons when both are shown
    },
  });

  return (
    <Layout style={styles.container}>
      {/* Display Area */}
      <View style={styles.displayContainer}>
        <Text category="h1" style={styles.inputText}>
          {input || '0'}
        </Text>
      </View>

      {/* Buttons Area */}
      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((button) => {
              // Determine button styles
              let buttonStyle = styles.button;
              let textStyle = styles.buttonText;
              let status = 'basic';

              if (button === '+') {
                buttonStyle = { ...buttonStyle, ...styles.addButton };
                textStyle = { ...textStyle, ...styles.addButtonText };
                status = 'primary';
              } else if (['/', '*', '-', '+'].includes(button)) {
                buttonStyle = { ...buttonStyle, ...styles.operatorButton };
                textStyle = { ...textStyle, ...styles.operatorButtonText };
              } else if (button === 'C') {
                buttonStyle = { ...buttonStyle, ...styles.clearButton };
                textStyle = { ...textStyle, ...styles.clearButtonText };
                status = 'danger';
              } else if (button === 'DEL') {
                buttonStyle = { ...buttonStyle, ...styles.deleteButton };
                textStyle = { ...textStyle, ...styles.deleteButtonText };
              }else if (button === '') {
                buttonStyle = { ...buttonStyle, ...styles.shadowButton };
                textStyle = { ...textStyle, ...styles.textShadowButton };
              } else {
                buttonStyle = { ...buttonStyle, ...styles.numberButton };
                textStyle = { ...textStyle, ...styles.numberButtonText };
              }

              return (
                <TouchableOpacity
                  key={button}
                  style={buttonStyle}
                  onPress={() => handlePress(button)}
                  activeOpacity={0.7}
                >
                  <Text style={textStyle}>{button}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  displayContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 20,
  },
  inputText: {
    color: '#333333',
    fontSize: 48,
    textAlign: 'right',
  },
  resultText: {
    color: '#666666',
    fontSize: 32,
    textAlign: 'right',
    marginTop: 10,
  },
  buttonsContainer: {
    flex: 5,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    width: (width - 60) / 4,
    height: (width - 100) / 4,
    borderRadius: 12,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    margin:5,
    marginHorizontal:10,
  },
  addButton: {
    width: (width - 80) / 4,
    height: (height * 0.5) / 5,
    backgroundColor: '#333333',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  operatorButton: {
    backgroundColor: '#333333',
  },
  deleteButton: {
   backgroundColor: '#ff9900',
 },
 shadowButton:{
   backgroundColor:'#F6F6F6',
 },
 textShadowButton:{
   color:'#F6F6F6',
 },
  operatorButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#D15D5D',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  numberButton: {
    backgroundColor: '#b7b7b7',
  },
  numberButtonText: {
    color: '#333333',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default Keypad;
