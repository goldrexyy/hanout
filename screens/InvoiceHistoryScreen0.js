import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ActivityIndicator,SafeAreaView } from 'react-native';
import { Layout, Text, Button, Divider, Select, SelectItem, Toggle ,ApplicationProvider } from '@ui-kitten/components';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import * as eva from '@eva-design/eva';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get('window');

const InvoiceHistoryScreen = ({navigation, route }) => {
  const {invoice} = route.params;
  const db = useSQLiteContext();

  useEffect(() => {
      LoadProducts();
    }, [invoice]);

  const [clients, setClients] = useState([]);
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePaid = () => setIsPaid(!isPaid);
  const [products, setProducts] = useState([]);


  const DeleteInvoice = async (invoice) => {
     try {
       await db.runAsync(
        `UPDATE factures SET deleted = 1 WHERE id = ?`,
        [invoice.id]
       );
       console.log('Data delete successfully!');
       navigation.navigate("Navigator",  { invoiceSent: true });
     } catch (error) {
       console.log('Error sending data:', error);
     }
   };
  const LoadProducts = async () => {
  const  idunique = invoice.idunique;
  const  userid = invoice.userid;
       try {
         const result = await db.getAllAsync(
   `SELECT * FROM detailsfacture WHERE deleted = 0 AND userid = ? AND factureid = ?`,
   [userid, idunique] // Use the actual user ID variable as needed
 );

         console.log('products', result);
         setProducts(result);
       } catch (error) {
         console.log('Error loading products:', error);
       }
     };

     const getDynamicStyles1 = () => {
       return {
         ...styles.column1, // Spread static styles
         backgroundColor: invoice.paid ? '#3682B3' : '#D15D5D', // Set background color based on item.client
       };
     };
     const getDynamicStyles2 = () => {
       return {
         ...styles.column2, // Spread static styles
         backgroundColor: invoice.paid ? '#3682B3' : '#D15D5D', // Set background color based on item.client
       };
     };


  return (

    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <ScrollView
        showsVerticalScrollIndicator = {false}
        >
        <View style={styles.cardContent}>
          <View style={getDynamicStyles1()}>
            <Ionicons name="document-text" size={width * 0.1} color='white' style={styles.icon} />
          </View>
          <View style={getDynamicStyles2()}>
                <Text style={styles.Selecttext8}>INVOICE #{invoice.idunique}</Text>
          </View>
        </View>
      <View style={styles.fixedHeader}>
        {/* Invoice Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.Selecttext}>{invoice.companyname}</Text>
            <Text style={styles.Selecttext2}>adess 11 bl erradi 156.</Text>
            <Text style={styles.Selecttext3}>Date : {invoice.dueDate}</Text>
            <Text style={styles.Selecttext3}>Time : {invoice.dueTime}</Text>
             <Text style={invoice.paid ? styles.Selecttext6 : styles.Selecttext7}>
              {invoice.paid ? 'Invoice Paid' : 'Invoice UnPaid'}
             </Text>

          </View>
          <QRCode value={invoice.idunique} size={100} />

        </View>
        <View>
        {invoice.clientname !== '' ? (
          <>
            <View>
              <Text style={styles.Selecttext2}>Remboursement assigné à :</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.cardContentClient}>
              <View style={styles.column1Client}>
                <Ionicons name="person" size={width * 0.1} color="white" style={styles.icon} />
              </View>
              <View style={styles.column2Client}>
                <Text style={styles.Selecttext}>{invoice.clientname}</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.Selecttext2}></Text> // Handle the case for paid invoices
        )}
      </View>

        <Divider style={styles.divider} />
        {/* Client Selection */}


      </View>

      {/* Scrollable Product List */}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text  style={styles.Selecttext55}>Produit</Text>
            <Text style={styles.Selecttext5}>Quantité</Text>
            <Text style={styles.Selecttext5}>Prix Total</Text>
          </View>
          <Divider style={styles.tableDivider} />
          {products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.Selecttext44}>{product.productname}</Text>
              <Text style={styles.Selecttext4}>{product.quantity}</Text>
              <Text style={styles.Selecttext4}>{product.total} Dh</Text>
            </View>
          ))}
        </View>


      <View style={styles.fixedFooter}>
        <Divider style={styles.divider} />

        {/* Invoice Summary */}
        <View style={styles.summary}>
          <Text style={styles.Selecttext2}>Total HT: {(invoice.total * 0.8).toFixed(2)} Dh</Text>
          <Text style={styles.Selecttext2}>TVA (20%): {(invoice.total * 0.2).toFixed(2)} Dh</Text>
          <Divider style={styles.divider} />
          <Text style={styles.Selecttext}>Total: {invoice.total} Dh TTC (20%)</Text>
        </View>

        <Divider style={styles.divider} />
        {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button style={styles.button}   onPress={() => DeleteInvoice(invoice)}>
                Supprimer la Facture
              </Button>
            )}
        {/* Validate Invoice Button */}

      </View>
      </ScrollView>
    </SafeAreaView>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  cardContentClient: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#666',
  },
  column1Client: {
    height: 80, // Fixed width for the first column
    alignItems: 'center',
     justifyContent: 'center',
    backgroundColor:'#D15D5D',
      flex: 0.3,
  },
  column2Client: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'center',
   justifyContent: 'center',
  },
  nameClient: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,

  },
  column1: {
    height: 100, // Fixed width for the first column
    alignItems: 'center',
     justifyContent: 'center',
    backgroundColor:'#3682B3',
    flex:0.5,
  },
  column2: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'cnter',
   justifyContent: 'center',
   backgroundColor:'#3682B3',
  },
  toggleContainer: {
   flexDirection: 'row',     // Row alignment
   justifyContent: 'space-between',  // Space between text and toggle
   alignItems: 'center',     // Vertically align toggle and text
   paddingVertical: 10,
 },
  toggle: {
marginLeft: 10,
},
  select:{
    backgroundColor: '#f6f6f6',
  },
  Selecttext:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  Selecttext8:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color:'#fff'
  },
  Selecttext2:{
    fontSize: width * 0.04,
  },
  Selecttext3:{
    fontSize: width * 0.03,
  },
  Selecttext4:{
    fontSize: width * 0.03,
    width: width / 3 - 20,
    textAlign: 'center',
    color: '#000000',
  },
  Selecttext44:{
    fontSize: width * 0.03,
    width: width / 3 - 20,
    textAlign: 'left',
    color: '#000000',
  },
  Selecttext5:{
    fontSize: width * 0.03,
    width: width / 3 - 20,
    textAlign: 'center',
    color: '#fff',
  },
  Selecttext55:{
    fontSize: width * 0.03,
    width: width / 3 - 20,
    textAlign: 'center',
    color: '#fff',
  },
  Selecttext6:{
    fontSize: width * 0.05,
    fontWeight: 'bold',

    color: '#3682B3',
  },
  Selecttext7:{
    fontSize: width * 0.05,
    fontWeight: 'bold',

    color: '#D15D5D',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',

  },
  fixedHeader: {
    marginVertical : 20,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    color: '#000000',
  },
  storeName: {
    color: '#000000',
  },
  storeadress: {
    color: '#000000',
    fontWeight:1,
  },
  divider: {
    marginVertical: 5,
    backgroundColor: '#E4E9F2',
  },
  clientSelection: {
    marginVertical: 10,
  },
  scrollableV: {
    flex: 1,
  },
  scrollableTable: {
    flex: 1,
    minHeight: height * 0.37, // Constrain product list height
  },
  table: {
    borderWidth: 1,

    backgroundColor: '#F7F9FC',
      minHeight: height * 0.43, // Constrain product list height
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#000',
    borderWidth:5,
    padding: 10,
  },
  tableCell: {
    width: width / 3 - 20,
    textAlign: 'center',
    color: '#000000',
    borderColor: '#000',
    borderWidth:5,
  },
  tableDivider: {
    backgroundColor: '#E4E9F2',
  },
  fixedFooter: {
    flex: 1,
     justifyContent: 'flex-end', // Aligns content to the bottom
     padding: 10, // Add padding if needed
  },
  summary: {
    marginBottom: 10,
    textAlign:'left',
  },
  totalText: {
    color: '#3682B3',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#D15D5D',
    borderColor: '#3682B3',
        borderRadius: 20,
  },
});

export default InvoiceHistoryScreen;
