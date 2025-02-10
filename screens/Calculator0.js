// screens/CalculatorScreen.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const CalculatorScreen = ({AddtoInvoice}) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  // Handle button presses
  const handlePress = (value) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      handleDelete();
    } else if (['+', '-', '*', '/'].includes(value)) {
      handleOperator(value);
    } else {
      setInput((prev) => prev + value);
    }
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };


  // Function to handle operator input
  const handleOperator = (operator) => {
    if (input === '') return; // Prevent starting with an operator

    const lastChar = input[input.length - 1];

    if (['+', '-', '*', '/'].includes(lastChar)) {
      // Replace the last operator if the last character is an operator
      setInput((prev) => prev.slice(0, -1) + operator);
    } else {
      // Append the operator to the input if it's valid
      setInput((prev) => prev + operator);
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
    ['','DEL'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['C', '0', '.', '+'],
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
        <Text category="h3" style={styles.resultText}>
          {result !== '' ? `= ${result}` : ''}
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

      {/* Total Section */}
      <View style={styless.ButtonCreatInvoiceContainer}>
        <Button
          style={[
            styless.creatinvoicebutton,
            {
              backgroundColor: result === '' ? '#f9f9f9' : '#3682B3', // Disabled color if no products, otherwise check isPressed
            },
          ]}
          onPress={() => AddtoInvoice(result)}
          disabled={result === ''} // Disable if no products
        >
          AJOUTER • {result} DH TVA (20%)
        </Button>
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: (width - 100) / 4,
    height: (width - 100) / 4,
    borderRadius: 12,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
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

export default CalculatorScreen;
