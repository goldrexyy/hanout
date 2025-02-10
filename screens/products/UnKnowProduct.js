import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Avatar, Layout, Button } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed

const { width } = Dimensions.get('window');

const UnknowProduct = ({ AddProduct, codes, inputRef2 }) => {
  const [product, setProduct] = useState({
    codes: codes || '',
    name: '',
    price: '',
    quantity:1,
  });

  const handleAddToList = () => {
    // Logic to add product to the list
    console.log('Product added to list:', product);
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff', // White background
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: 8,
      color: '#FF4C4C', // Red color for emphasis
    },
    infoText: {
      fontSize: 16,
      marginBottom: 16,
      textAlign: 'center',
      color: '#555555', // Dark gray for better readability
    },
    avatar: {
      marginBottom: 16,
    },
    formContainer: {
      width: '100%',
    },
    input: {
      borderWidth: 1,
      borderColor: '#e4e9f2',
      borderRadius: 8,
      padding: 8,
      marginBottom: 12,
    },
    ButtonCreatInvoiceContainer: {


  color:'#fff',

    },
    creatinvoicebutton :{
      backgroundColor:product.name && product.price  ? '#3682B3' : '#f2f2f2',
      borderRadius: 50,
      color:'#fff',

   // Space between buttons when both are shown
    },
  });

  return (
    <Layout style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name="warning-outline" size={24} color="#FF4C4C" />
        <Text style={styles.title}>Product Not Found</Text>
      </View>
      <Text style={styles.infoText}>Add info to include this product in your list:</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="EAN Product"
          value={product.codes}
          style={styles.input}
          disabled
        />
        <TextInput
         ref={inputRef2}
          placeholder="Name Product"
          value={product.name}
          onChangeText={(value) => setProduct({ ...product, name: value })}
          style={styles.input}
        />
        <TextInput
          placeholder="Price Product"
          value={product.price}
          onChangeText={(value) => setProduct({ ...product, price: value })}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.ButtonCreatInvoiceContainer}>
          <Button
            style={[styles.creatinvoicebutton]} // Full width when focused is false
             onPress={() => AddProduct(product)} // Use an arrow function to call handleAddToList
            disabled={!product.codes || !product.name || !product.price}
          >
          Add to list
           </Button>
        </View>
      </View>
    </Layout>
  );
};



export default UnknowProduct;
