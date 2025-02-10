import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Input, Button, Toggle } from '@ui-kitten/components';
import moment from 'moment';

const { width } = Dimensions.get('window');

const InvoiceSettingsModal = ({ isVisible, onClose }) => {
  // Static values
  const staticValues = {
    invoiceId: '#456',
    corporateName: 'Corporate Example Ltd.',
    address: '1234 Business Rd, City, Country',
  };

  // State for current date and time
  const [date, setDate] = useState(moment().format('YYYY-MM-DD HH:mm'));
  const [currency, setCurrency] = useState('Dirham');

  const handleSave = () => {
    // Save logic here
    console.log({ date, invoiceId: staticValues.invoiceId, corporateName: staticValues.corporateName, address: staticValues.address, currency });
    onClose(); // Close the modal after saving
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
          <Text style={styles.modalTitle}>Invoice Settings</Text>

          <Input
            style={styles.input}
            label="Date and Time"
            value={date}
          />
          <Input
            style={styles.input}
            label="Invoice ID"
            value={staticValues.invoiceId}
          />
          <Input
            style={styles.input}
            label="Corporate Name"
            value={staticValues.corporateName}
            textColor='red'
             labelStyle={styles.label}
          />
          <Input
            style={styles.input}
            label="Address"
            value={staticValues.address}

          />
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Currency</Text>
            <Toggle
              checked={currency === 'Dirham'}
              onChange={() => setCurrency(currency === 'Dirham' ? 'Riyal' : 'Dirham')}
            >
              {currency}
            </Toggle>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={handleSave}>Save</Button>
            <Button onPress={onClose} style={styles.cancelButton}>Cancel</Button>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
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
    width: '100%',
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
});

export default InvoiceSettingsModal;
