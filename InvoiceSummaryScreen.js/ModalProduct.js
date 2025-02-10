import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Input, Button, Toggle } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';


const { width } = Dimensions.get('window');



// Modal to show product details
const ModalProduct = ({ isVisible, product, onClose, onUpdate }) => {
  const [localPrice, setLocalPrice] = useState(product.price || ''); // Local state for input field

  const [price, setPrice] = useState(product.price || ''); // Initialize with default value


  const handleUpdate = () => {
      const updatedPrice = parseFloat(localPrice); // Parse the local price value
      console.log('price', localPrice);
      onUpdate({ ...product, price: updatedPrice }); // Pass updated data to HomeScreen
      onClose(); // Close the modal
      setLocalPrice("");
    };
  return (

    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      >

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={{ uri: product.avatar }} style={styles.avatar} />
          <Text style={styles.modalTitle}>{product.name}</Text>
          <Text style={styles.modalSubTitle}>{product.brand}</Text>

          <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Price in Dh:</Text>
            <Text style={styles.tableValue}>{product.price} Dh TTC (20%)</Text>
          </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>New Price in Dh:</Text>
              <Input
              value={localPrice}
              onChangeText={(text) => setLocalPrice(text)} // Update local state
              keyboardType="numeric"
              placeholder="Enter new price"
              style={styles.input}
            />
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Times Sold:</Text>
              <Text style={styles.tableValue}>{product.timesSold} times</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Stock Available:</Text>
              <Text style={styles.tableValue}>{product.stock} available</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Nearby Sales:</Text>
              <Text style={styles.tableValue}>{product.nearbySales} Dh</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
          <Button style={styles.Buttons} title="Update Price" onPress={handleUpdate}>Change Price</Button>
          <View style={styles.divider}/>
          <Button style={styles.Buttons} title="Close" onPress={onClose}>Cancel</Button>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent background
  },

  Buttons:{

    textColor:'white',
  },
  modalContent: {
    width: width * 0.8,
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: width * 0.03,
  },
  input: {
    marginBottom: width * 0.03,
    backgroundColor:'#fff',
    color:'red',
    textColor:'red',
    labelStyle:'red',
  },
  label:{
    color:'#fff',
  },
  toggleContainer: {
    width: '100%',
    marginBottom: width * 0.03,
  },
  toggleLabel: {
    fontSize: width * 0.04,
    marginBottom: width * 0.02,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    marginLeft: width * 0.02,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalSubTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableLabel: {
    fontWeight: 'bold',
  },
  tableValue: {
    fontSize: 16,
  },
  divider:{
    width:30,
  },
});

export default ModalProduct;
