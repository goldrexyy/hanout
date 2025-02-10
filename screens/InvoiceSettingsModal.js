import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
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

  const [date, setDate] = useState(staticValues.date);
  const [invoiceId, setInvoiceId] = useState(staticValues.invoiceId);
  const [corporateName, setCorporateName] = useState(staticValues.corporateName);


  const handleSave = () => {
    // Handle saving logic here
    const updatedValues = {
      date,
      invoiceId,
      corporateName,
    };
    console.log("Saving", updatedValues);
  };

  return (
<ScrollView
showsVerticalScrollIndicator={false}>
      <View style={styles.container2}>
        <View style={styles.toggleContainer}>
          <Text style={styles.label}>Date and Time</Text>
          <Input
          style={styles.input}
          value={date} // Controlled input
          onChangeText={setDate} // Update state on change
        />
        </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Invoice Number</Text>
            <Input
              style={styles.input}
              value={invoiceId} // Controlled input
              onChangeText={setInvoiceId} // Update state on change
            />
          </View>
            <View style={styles.toggleContainer}>
              <Text style={styles.label}>Compagny and Seller Name</Text>
              <Input
                style={styles.input}
                value={corporateName} // Controlled input
                onChangeText={setCorporateName} // Update state on change
              />
          </View>
          <View style={styles.ButtonCreatInvoiceContainer}>
            <Button onPress={handleSave}  style={styles.creatinvoicebutton}>Save</Button>
          </View>
        </View>
        </ScrollView>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    position:'relative',
  },
  ButtonCreatInvoiceContainer: {
    flex: 0,
    width : '100%',
    padding: width * 0.03,
  },
  creatinvoicebutton :{
    backgroundColor:'#7f8284',
  },
  modalContent: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: width * 0.03,
  },
  input: {
    flex: 1,
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#666',
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#F6F6F6',
    fontSize: width * 0.04,
    paddingBottom:10,
  },
  label:{
    color:'#000',
  },
  toggleContainer: {
    width: '100%',
    marginBottom: width * 0.03,
  },
  toggleLabel: {
    fontSize: width * 0.04,
    marginBottom: width * 0.02,
    color:'#000',
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
