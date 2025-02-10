import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView ,TouchableOpacity, TextInput} from 'react-native';
import { Layout, Text, Button, Divider, Select, SelectItem, Toggle ,ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import * as Location from 'expo-location';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';


const { width, height } = Dimensions.get('window');

const ReceiveHistoryScreen = ({navigation, route }) => {

  const db = useSQLiteContext();
  const [clients, setClients] = useState([]);
  const [remboursement, setRemboursement] = useState({
   idunique: '',
   companyname: 'Yassine Jennane',
   dueTime: '',
   dueDate: '',
   subtotal: 0,
   taxRate: 0.20,
   taxAmount: 0,
   paid: true,
   clientid: null,
   clientname: null,
   userid: 1,
   total: 0,
   description: '',
   delete: 0,
   lat: 0,
   long: 0,
 });
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [clientId, setClientId] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clientInvoice, setClientInvoice] = useState(route.params?.onSelectClient || null);
 const [remboursementTaux, setRemboursementTaux] = useState(0);
  const TimeNow = moment().format('HH:mm');
  const DateNow = moment().format('DD/MM/YYYY');
  // Calculate unpaid and paid values based on clientInvoice
    const unpaid = clientInvoice ? clientInvoice.nbrunpaid : 0; // Default to 0 if clientInvoice is null
    const paid = clientInvoice ? clientInvoice.nbrpaid : 0; // Default to 0 if clientInvoice is null


  useFocusEffect(
    React.useCallback(() => {
      // Check if route.params is defined and if there's a client parameter when returning to the Invoice screen
      if (route.params?.onSelectClient) {
        setClientInvoice(route.params.onSelectClient);

      }
    }, [route.params?.onSelectClient])
  );

// Fetch clients from API
useEffect(() => {
    GetReceiveId();
  }, []); // Run once when the component mounts


  // Function to calculate the reimbursement rate
  // Function to calculate the reimbursement rate
  const calculateRemboursementTaux = () => {
    // Check if clientInvoice and remboursement are null or undefined using optional chaining
    const unpaid = clientInvoice?.nbrunpaid || 0; // Default to 0 if undefined or null
    const paid = clientInvoice?.nbrpaid || 0; // Default to 0 if undefined or null
    const total = remboursement?.total || 0; // Default to 0 if undefined or null

    // Prevent division by zero and other invalid cases
    if (unpaid === 0 || unpaid === paid) {
      setRemboursementTaux(0); // Set to 0 if there's nothing unpaid or unpaid equals paid
      return;
    }

    // Calculate the reimbursement rate
    const taux = (((unpaid - paid) - total) / (unpaid - paid) * 100).toFixed(0);

    // Ensure taux is a valid number and set to 0 if it's negative
    const finalTaux = Math.max(0, Number(taux));

    setRemboursementTaux(finalTaux);
  };





   // Update reimbursement rate when clientInvoice or remboursement changes
   useEffect(() => {
     calculateRemboursementTaux();
   }, [clientInvoice, remboursement.total]);


  const sendData = async ( RemboursementData) => {
      try {
        await db.runAsync(`
          CREATE TABLE IF NOT EXISTS remboursements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idunique TEXT,
            companyname TEXT,
            clientid TEXT,
            clientname TEXT,
            userid TEXT,
            dueDate TEXT,
            dueTime TEXT,
            description TEXT,
            subtotal REAL,
            taxRate REAL,
            taxAmount REAL,
            paid BOOLEAN,
            total REAL
            lat REAL
            long REAL
            deleted TEXT
          )
        `);
        await db.runAsync(
          `INSERT INTO remboursements (
            idunique,
            companyname,
            clientid,
            clientname,
            userid,
            dueDate,
            dueTime,
            description,
            subtotal,
            taxRate,
            taxAmount,
            paid,
            total,
            lat,
            long,
            deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?,?,?)`,
          [
           RemboursementData.idunique,
           RemboursementData.companyname,
           RemboursementData.clientid,
           RemboursementData.clientname,
           RemboursementData.userid,
           RemboursementData.dueDate,
           RemboursementData.dueTime,
           RemboursementData.description,
           RemboursementData.subtotal,
           RemboursementData.taxRate,
           RemboursementData.taxAmount,
           RemboursementData.paid,
           RemboursementData.total,
           RemboursementData.lat,
           RemboursementData.long,
           RemboursementData.deleted
          ]
        );
        console.log('Data sent successfully!');
        navigation.goBack(); // Go back to the previous screen

      } catch (error) {
        console.log('Error sending data:', error);
      }
    };

  const sendDataClient = async ( RemboursementDataClient) => {
            try {
              await db.runAsync(`
                CREATE TABLE IF NOT EXISTS detailsfacture (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  idunique TEXT,
                  name TEXT,
                  avatar TEXT,
                  number TEXT,
                  userid TEXT,
                  lat REAL,
                  long REAL,
                  nbrinvoice TEXT,
                  nbrpaid TEXT,
                  nbrunpaid TEXT,
                  deleted TEXT
                )
              `);
              await db.runAsync(
           `UPDATE clients
            SET nbrpaid = nbrpaid + ?
            WHERE id = ?`,
         [RemboursementDataClient.nbrpaid, RemboursementDataClient.id]
            );

              console.log('Data updated successfully!');


            } catch (error) {
              console.log('Error sending data:', error);
            }
          };


          const GetReceiveId = async () => {
             try {
               await db.runAsync(`
                 CREATE TABLE IF NOT EXISTS remboursements (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   idunique TEXT,
                   companyname TEXT,
                   clientid TEXT,
                   clientname TEXT,
                   userid TEXT,
                   dueDate TEXT,
                   dueTime TEXT,
                   description TEXT,
                   subtotal REAL,
                   taxRate REAL,
                   taxAmount REAL,
                   paid BOOLEAN,
                   total REAL,
                   lat REAL,
                   long REAL,
                   deleted TEXT
                 )
               `);

               const result = await db.getAllAsync(`
                 SELECT idunique FROM remboursements
                 ORDER BY id DESC
                 LIMIT 1
               `);

               if (result && result.length > 0) {
                 const lastIdunique = result[0].idunique; // Example: 'RB0007'

                 // Extract the numeric part from the string (e.g., '0007')
                 const numericPart = parseInt(lastIdunique.replace('RB', ''), 10);

                 // Increment the numeric part
                 const nextNumericPart = numericPart + 1;

                 // Format the new idunique with zero padding (e.g., 'RB0008')
                 const newIdunique = `RB${nextNumericPart.toString().padStart(4, '0')}`;

                 // Update the state
                 setRemboursement(prev => ({ ...prev, idunique: newIdunique }));
               } else {
                 console.log('imhere');
                 const defaultIdunique = 'RB0001';
                 setRemboursement(prev => ({ ...prev, idunique: defaultIdunique }));
                 console.log('result', defaultIdunique);
               }
             } catch (error) {
               const defaultIdunique = 'RB0001';
               setRemboursement(prev => ({ ...prev, idunique: defaultIdunique }));
               console.log('result', defaultIdunique);
             }
           };

  const handleSendData = async () => {
    setLoading(true);
    // Exemple de données


    const RemboursementData = {
      idunique: remboursement.idunique,
      companyname: 'Yassine Jennane',
      clientid:clientInvoice ? clientInvoice.id :'',
      clientname:clientInvoice ? clientInvoice.name :'',
      userid: '1',
      dueDate: DateNow,
      dueTime: TimeNow,
      description: '',
      subtotal: (remboursement.total * 0.8).toFixed(2),
      taxRate: 0.20,
      taxAmount:(remboursement.total * 0.2).toFixed(2) ,
      paid: isPaid,
      total: (remboursement.total).toFixed(2),
      lat:0,
      long:0,
      deleted:0
    };

    const RemboursementDataClient = {
      id:clientInvoice ? clientInvoice.id :'',
      nbrpaid:(remboursement.total).toFixed(2),
    };
  try {
   // Sending data (ensure sendData handles arrays correctly)
   await sendData(RemboursementData);
   if(clientInvoice.id){
    await sendDataClient(RemboursementDataClient);
   }
   setLoading(false);

 } catch (error) {
   console.log(error);
 }


    setLoading(false);
  };


  const togglePaid = () => {
    setIsPaid(!isPaid);
    if (clientInvoice) {
      clientInvoice.name = '';
      clientInvoice.id = '';
    }
  };

  const setClient = (client) => {
    remboursement.clientid = client.id;
    remboursement.clientname = client.name;
  };

  const handleValidation = () => {
    console.log('Invoice validated');
  };

  const isClientInvoiceValid = clientInvoice && clientInvoice.id;

  const buttonDisabled = remboursement.total === 0 && (!clientInvoice || !isClientInvoiceValid);

  const buttonStyle = {
    backgroundColor: remboursement.total === 0 ? '#f2f2f2' : (isClientInvoiceValid ? '#4CAF50' : '#f2f2f2'),
      borderRadius: 20,
      borderColor:'transparent',
      color:'black',
  };



const getDynamicStyles1 = () => {
  return {
    ...styles.column1, // Spread static styles
    backgroundColor: isPaid ? '#3682B3' : '#D15D5D', // Set background color based on item.client
  };
};
const getDynamicStyles2 = () => {
  return {
    ...styles.column2, // Spread static styles
    backgroundColor: isPaid ? '#3682B3' : '#D15D5D', // Set background color based on item.client
  };
};
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <ScrollView
        showsVerticalScrollIndicator = {false}
        >

        <View style={styles.cardContent}>
              <View style={styles.column1}>
            <Ionicons name="receipt" size={width * 0.1} color='white' style={styles.icon} />
          </View>
              <View style={styles.column2}>
                <Text style={styles.Selecttext88}>RB #{remboursement.idunique}</Text>
          </View>
        </View>



      <View style={styles.fixedHeader}>
        {/* Invoice Header */}


        <View style={styles.header}>



          <View>
          <Text style={styles.Selecttext}>{remboursement.companyname}</Text>

            <Text style={styles.Selecttext3}>122 Business Rd, Business CIty, BC..</Text>

            <Text style={styles.Selecttext3}>Date : {DateNow}</Text>
            <Text style={styles.Selecttext3}>Time : {TimeNow}</Text>
          </View>
          <QRCode value={'111'} size={100} />
        </View>

      <Divider style={styles.divider} />
        <View style={styles.clientSelection}>

          {clientInvoice && clientInvoice.id ? ( // Check if invoice.clientid exists

            <TouchableOpacity
              style={styles.productCardClient}
              onPress={() => navigation.navigate('Clientsrembourssement', {
                onSelectClient: (clientInvoice) => {
                  setClientInvoice(clientInvoice); // Update client data here
                },
              })}
            >
            <View >
              <Text style={styles.Selecttext2}>Rembourssement assigne to :  </Text>
            </View>
              <Divider style={styles.divider} />

              <View style={styles.cardContentClient}>
              <View style={styles.column1Client}>
                <Ionicons name="person" size={width * 0.1} color='white' style={styles.icon} />
              </View>
                <View style={styles.column2Client}>
                  <Text style={styles.Selecttext}> {clientInvoice.name}</Text>
                </View>
              </View>
            </TouchableOpacity>

          ) : (
            <Button
              style={styles.buttonclient}
              status='basic'
              onPress={() => navigation.navigate('Clientsrembourssement', {
                onSelectClient: (clientInvoice) => {
                  setClientInvoice(clientInvoice); // Update client data here
                },
              })}
            >
              Choose A Client
            </Button>
          )}
        </View>
      </View>

      <View style={styles.montant}>
        <Text style={styles.Selecttext2}>Calcule de la dette</Text>
          <Divider style={styles.divider} />
          <View style={styles.clientInfoRow}>

            {/* Column 3: Total Paid */}
            <View style={styles.clientInfoColumn}>

            {((unpaid - paid) - remboursement.total) <= 0 ? (
 <Ionicons name="arrow-up" size={width * 0.15} color="#4CAF50" />
) : (
 <Ionicons name="arrow-down" size={width * 0.15} color="#D15D5D" />
)}
               <Text style={styles.Selecttext}>Dette</Text>
               <Text style={styles.Selecttext7}>Indicateur en pourcentage de la dette non payée sur la totalité des impayées.</Text>
               <Text style={styles.Selecttext6}>{paid - unpaid}Dh + {remboursement.total}Dh</Text>
               <Text style={styles.Selecttext8}>= {(paid - unpaid)+remboursement.total}Dh </Text>
            </View>
            {/* Column 4: Total Unpaid */}
            <View style={styles.clientInfoColumn}>
            { remboursementTaux <= 0 ? (
 <Ionicons name="happy-outline" size={width * 0.15} color="#4CAF50" />
) : (
   <Ionicons name="sad-outline" size={width * 0.15} color="#D15D5D"/>
)}

               <Text style={styles.Selecttext}>Taux</Text>
               <Text style={styles.Selecttext7}>Indicateur en pourcentage de la dette non payée sur la totalité des impayées.</Text>
               <Text style={styles.Selecttext8}>{remboursementTaux}%</Text>

            </View>
          </View>
      </View>
    <Divider style={styles.divider} />
      <View style={styles.montant}>
        <Text style={styles.Selecttext2}>Le montant du remboursement</Text>
          <Divider style={styles.divider} />
          <TextInput
    style={styles.searchInputmontant}
    placeholder="0.00 Dh"
    value={remboursement.total.toString()} // Convert total to string for TextInput
    keyboardType="numeric" // Use this for numeric input
    onChangeText={text => {
      const numericValue = parseFloat(text); // Parse the input to float
      const newTotal = isNaN(numericValue) ? 0 : numericValue; // Set to 0 if NaN

      // Update the remboursement state
      setRemboursement(prev => ({
        ...prev,
        total: newTotal // Update total with the new numeric value
      }));

      // Recalculate remboursementTaux after updating the total
      calculateRemboursementTaux(newTotal); // Pass the new total if necessary
    }}
  />

      </View>
      <Divider style={styles.divider} />
      <View style={styles.description}>
      <Text style={styles.Selecttext2}>Do you want to add a description to this transaction ?  </Text>
        <Divider style={styles.divider} />
      <TextInput
       style={styles.searchInput}
       placeholder="Description..."
       value={remboursement.description} // Bind to remboursement.description
       multiline
       numberOfLines={14} // Adjust as needed for height
       textAlignVertical="top" // Align text to the top
       onChangeText={text => setRemboursement(prev => ({ ...prev, description: text }))} // Update description
     />
      </View>




      <View style={styles.fixedFooter}>
        <Divider style={styles.divider} />


        <Divider style={styles.divider} />
        {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          onPress={() => handleSendData()}
          disabled={remboursement.total === 0 || buttonDisabled}
          style={buttonStyle}
        >
          Valider le remboursement
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
  clientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
        justifyContent:'center',
  },
  clientInfoColumn: {
    flex: 1,
    alignItems: 'center',
    borderWidth:2,
    justifyContent:'center',
    borderRadius:10,
    borderColor:'#f5f5f5',
    backgroundColor:'#f9f9f9',
    padding:10,
    margin:10,
  },
  montant: {
    flex: 1,
       paddingHorizontal: 10,
  },
  searchInputmontant: {
    flex: 1,
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#666',
    marginRight:width * 0.01,
    padding: 5,
    paddingLeft: 15,
    backgroundColor: '#F6F6F6',
    fontSize: width * 0.06,
    Height: height * 0.10, // Constrain product list height
  },
  description: {
    flex: 1,
       padding: 10,
  },
  searchInput: {
    flex: 1,
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#666',
    marginRight:width * 0.01,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#F6F6F6',
    fontSize: width * 0.03,
    minHeight: height * 0.30, // Constrain product list height
  },
  productCardClient: {

    backgroundColor: '#fff',

    elevation: 2,

  },
  cardContentClient: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#666',
  },

  avatarClient: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 25,
  },
  column1Client: {
    height: 80, // Fixed width for the first column
    alignItems: 'center',
     justifyContent: 'center',
    backgroundColor:'#4CAF50',
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
    backgroundColor:'#4CAF50',
    flex:0.5,
  },
  column2: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'cnter',
   justifyContent: 'center',
   backgroundColor:'#4CAF50',
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
  Selecttext88:{
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
  Selecttext6:{
    fontSize: width * 0.04,


    color: '#333',
  },
  Selecttext8:{
    fontSize: width * 0.05,
    fontWeight: 'bold',

    color: '#333',
  },
  Selecttext7:{
    fontSize: width * 0.025,
    color:'#666',

  },
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  fixedHeader: {
    marginVertical : 20,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: '#fff',
  },
  clientSelection: {
    marginVertical: 10,
  },
  scrollableV: {
    flex: 1,
  },
  scrollableTable: {
    flex: 1,
    maxHeight: height * 0.37, // Constrain product list height

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
    padding: 10,
  },
  tableCell: {
    width: width / 3 - 20,
    textAlign: 'center',
    color: '#000000',
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
    backgroundColor: '#3682B3',
    borderColor: '#3682B3',
        borderRadius: 20,
  },
  buttonclient: {

    borderRadius: 20,
  },
});

export default ReceiveHistoryScreen;
