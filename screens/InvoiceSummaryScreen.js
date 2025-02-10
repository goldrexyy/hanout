import React, { useEffect,useRef, useState, useCallback, useMemo } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView ,TouchableOpacity, Image} from 'react-native';
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
import Client from './ListClientsBottom';
import Success from './Success';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetScrollView  } from '@gorhom/bottom-sheet';


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



const Clienty = React.memo(({ navigation, route }) => {

  // State variables
  const [data, setData] = useState([]);
  const db = useSQLiteContext();
  const [invoice, setInvoice] = useState(route.params.invoice);
  const [loading, setLoading] = useState(false);
  const [clientInvoice, setClientInvoice] = useState({
    id: invoice.clientid, // Initialize with invoice details
    name: invoice.custumername,
    nbrpaid:0,
    nbrunpaid:0,
    nbrinvoice:0,
  });
  const [isPaid, setIsPaid] = useState(invoice.isPaid || null); // Initialize isPaid with invoice
  const iconMapping = {
    'user': require('../assets/users/user.png'),
    'user2': require('../assets/users/user2.png'),
  };
  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points
  const bottomSheetModalFirstRef = useRef(null);
  const [selectedComponent, setSelectedComponent] = useState(null); // Track modal content

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [showArrow, setShowArrow] = useState(true); // Initial state is false
  const [scrollViewHeight, setScrollViewHeight] = useState(0); // To store layoutMeasurement height
  const [contentHeight, setContentHeight] = useState(0); // To store content height
  const screenHeight = Dimensions.get('window').height;
  const scrollViewRef = useRef(null);

  const BottomSheetContent = React.memo(({ selectedClient }) => {
    // Use a callback to render the content based on the selectedClient
    const renderContent = useCallback(() => {
      switch (selectedComponent) {
        case 'Success':
          return <Success />;
         case 'Client':
            return (
              <Client
              isPressed={isPaid}
              selectedClient = {selectedClient}
              />
            );
        default:
          return null; // Return null if no component is selected
      }
    }, [selectedClient]);

    return (
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
      </BottomSheetScrollView>
    );
  });

  const handlePresentModalFirstPress = useCallback((component) => {
    // If it's a string, handle it as a component type

      setSelectedComponent(component);
      console.log('what component', component);

      // Adjust snap point based on component type
      if (component === 'Client') {
        setSnapPoint(['75%']);  // Set snap point for 'Add'
      } else if (component === 'Success') {
        setSnapPoint(['40%']);  // Set snap point for 'Modify'
      } else {
        setSnapPoint(['50%']);  // Default snap point for other cases
      }

    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.present();
  }, []);

  // callbacks
  const handlePresentModalFirstClose = useCallback(() => {
    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.close();
  }, []);


  const selectedClient = (item) => {
    handlePresentModalFirstClose();


    // Update the invoice state with the selected client details
    setClientInvoice(prevClientInvoice => ({
      ...prevClientInvoice,
      id: item.id, // Use item instead of invoice
      name: item.name, // Use item instead of invoice
      nbrpaid:0,
      nbrunpaid:0,
      nbrinvoice:0,
    }));

    console.log('??', clientInvoice);
  };

  const renderBackdrop = (props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // Backdrop shows up when sheet is open
            disappearsOnIndex={-1} // Backdrop disappears when closed
            pressBehavior="close" // Close the modal when backdrop is pressed
            opacity={0.9} // Adjust opacity
          />
        );

        //permission localization
  useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc);
        })();
      }, []);

  useEffect(() => {
     GetInvoiceId();
   }, [route]);
  useEffect(() => {
     if (isPaid === false && clientInvoice.id === '') {
       handlePresentModalFirstPress('Client');
     }
   }, [isPaid, navigation, route]);
   // Evaluate arrow visibility once all dimensions are available
  useEffect(() => {
   if (scrollViewHeight && contentHeight) {
     setShowArrow(contentHeight > scrollViewHeight + 60);
   }
 }, [scrollViewHeight, contentHeight, togglePaid]);

   const GetInvoiceId = async () => {
    try {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS factures (
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
        SELECT idunique FROM factures
        ORDER BY id DESC
        LIMIT 1
      `);

      const lastIdunique = result?.[0]?.idunique;
      const numericPart = lastIdunique ? parseInt(lastIdunique.replace('NR', ''), 10) + 1 : 1;
      const newIdunique = `NR${numericPart.toString().padStart(4, '0')}`;

      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        idunique: newIdunique,
      }));

    } catch (error) {
      console.error('Error fetching invoice ID:', error);
      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        idunique: 'NR0001',
      }));
    }
  };

  const handleSendData = async () => {
      setLoading(true);
      console.log('Step 0: Starting data send process');

      // Prepare common invoice data
      const commonInvoiceData = {
          userid: '1',
          dueDate: invoice.dueDate,
          dueTime: invoice.dueTime,
          lat: location?.coords?.latitude,
          long: location?.coords?.longitude,
          deleted: '0'
      };

      try {
          // Send each product as a separate line
          const productPromises = invoice.products.map(async (product) => {
              const invoiceDataProduct = {
                  ...commonInvoiceData,
                  factureid: invoice.idunique,
                  productid: product.ean,
                  productname: product.name,
                  companyname: invoice.companyname,
                  clientid: clientInvoice?.id || '',
                  clientname: clientInvoice?.name || '',
                  subtotal: ((product.quantity * product.price) * 0.8).toFixed(2),
                  taxRate: 0.20,
                  quantity: product.quantity,
                  taxAmount: ((product.quantity * product.price) * 0.2).toFixed(2),
                  paid: isPaid,
                  total: (product.quantity * product.price).toFixed(2)
              };

              await sendDataproducts(invoiceDataProduct);
              console.log('Product added:', product.name);
          });

          await Promise.all(productPromises);
          console.log('Step 1: Product data sent successfully');

          // Send invoice data
          const invoiceData = {
              ...commonInvoiceData,
              idunique: invoice.idunique,
              companyname: 'Yassine Jennane',
              clientid: clientInvoice?.id || '',
              clientname: clientInvoice?.name || '',
              description: invoice.products.map(product => product.name).join(', '),
              subtotal: (invoice.total * 0.8).toFixed(2),
              taxRate: 0.20,
              taxAmount: (invoice.total * 0.2).toFixed(2),
              paid: isPaid,
              total: invoice.total.toFixed(2),
          };

          await sendData(invoiceData);
          console.log('Step 2: Invoice data sent successfully');

          // Update client data if client exists
          if (clientInvoice?.id) {
              const invoiceDataClient = {
                  id: clientInvoice.id,
                  nbrunpaid: invoice.total.toFixed(2),
              };
              await sendDataClient(invoiceDataClient);
              console.log('Step 3: Client data updated successfully');
          }

          // Open success modal
          handlePresentModalFirstPress('Success');
          await new Promise(resolve => setTimeout(resolve, 2000));
          navigation.navigate("Scan", { invoiceSent: true });

      } catch (error) {
          console.error('Error sending data:', error.message);
      } finally {
          setLoading(false);
      }
  };

  // Helper function to send main invoice data
  const sendData = async (invoiceData) => {
      try {
          await db.runAsync(`
              CREATE TABLE IF NOT EXISTS factures (
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
          await db.runAsync(
              `INSERT INTO factures (
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
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                  invoiceData.idunique,
                  invoiceData.companyname,
                  invoiceData.clientid,
                  invoiceData.clientname,
                  invoiceData.userid,
                  invoiceData.dueDate,
                  invoiceData.dueTime,
                  invoiceData.description,
                  invoiceData.subtotal,
                  invoiceData.taxRate,
                  invoiceData.taxAmount,
                  invoiceData.paid,
                  invoiceData.total,
                  invoiceData.lat,
                  invoiceData.long,
                  invoiceData.deleted
              ]
          );
          console.log('Invoice data inserted successfully');
      } catch (error) {
          console.error('Error inserting invoice data:', error.message);
      }
  };

  // Helper function to send individual product data
  const sendDataproducts = async (invoiceDataProduct) => {
      try {
          await db.runAsync(`
              CREATE TABLE IF NOT EXISTS detailsfacture (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  factureid TEXT,
                  productid TEXT,
                  productname TEXT,
                  companyname TEXT,
                  clientid TEXT,
                  clientname TEXT,
                  userid TEXT,
                  dueDate TEXT,
                  dueTime TEXT,
                  subtotal REAL,
                  quantity INTEGER,
                  taxRate REAL,
                  taxAmount REAL,
                  paid BOOLEAN,
                  total REAL,
                  lat REAL,
                  long REAL,
                  deleted TEXT
              )
          `);
          await db.runAsync(
              `INSERT INTO detailsfacture (
                  factureid,
                  productid,
                  productname,
                  companyname,
                  clientid,
                  clientname,
                  userid,
                  dueDate,
                  dueTime,
                  subtotal,
                  quantity,
                  taxRate,
                  taxAmount,
                  paid,
                  total,
                  lat,
                  long,
                  deleted
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                  invoiceDataProduct.factureid,
                  invoiceDataProduct.productid,
                  invoiceDataProduct.productname,
                  invoiceDataProduct.companyname,
                  invoiceDataProduct.clientid,
                  invoiceDataProduct.clientname,
                  invoiceDataProduct.userid,
                  invoiceDataProduct.dueDate,
                  invoiceDataProduct.dueTime,
                  invoiceDataProduct.subtotal,
                  invoiceDataProduct.quantity,
                  invoiceDataProduct.taxRate,
                  invoiceDataProduct.taxAmount,
                  invoiceDataProduct.paid,
                  invoiceDataProduct.total,
                  invoiceDataProduct.lat,
                  invoiceDataProduct.long,
                  invoiceDataProduct.deleted
              ]
          );
          console.log('Product data inserted successfully');
      } catch (error) {
          console.error('Error inserting product data:', error.message);
      }
  };

  // Helper function to update client data
  const sendDataClient = async (invoiceDataClient) => {
      try {
          await db.runAsync(`
              UPDATE clients
              SET nbrunpaid = nbrunpaid + ?
              WHERE id = ?`,
              [invoiceDataClient.nbrunpaid, invoiceDataClient.id]
          );
          console.log('Client data updated successfully');
      } catch (error) {
          console.error('Error updating client data:', error.message);
      }
  };


   const togglePaid = () => {
          setClientInvoice(prevClientInvoice => ({
            ...prevClientInvoice,
            id: '',
            name: '',
          }));
  };
   const isClientInvoiceValid = clientInvoice && clientInvoice.id;
   const buttonDisabled = !isPaid && (!clientInvoice || !isClientInvoiceValid);
   const buttonStyle = {
          backgroundColor: isPaid ? '#3682B3' : (isClientInvoiceValid ? '#D15D5D' : '#fff'),
            borderRadius: 20,
        };

        // Function to handle scroll event
       const handleScroll = (event) => {
         const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
         const isScrolledToEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;

         setShowArrow(!isScrolledToEnd);
       };

       // Function to capture ScrollView height
       const handleLayout = (event) => {
         setScrollViewHeight(event.nativeEvent.layout.height);
       };

       // Function to handle content size changes
       const handleContentSizeChange = (contentWidth, contentHeight) => {
         setContentHeight(contentHeight);
       };

  return (
      <Layout style={styles.container}>
        <View style={styles.formContainer}>
        <ScrollView
        showsVerticalScrollIndicator = {false}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        >

        <View style={styles.cardContent}>
        <QRCode value={invoice.id} size={100} />
            <Text style={styles.Selecttext8}>FACTURE #{invoice.idunique}</Text>
        </View>

        <View style={styles.containertabbutton}>
        <TouchableOpacity
         style={[styles.buttontabbutton, isPaid ? styles.activePaid : styles.inactiveButton]}
         onPress={() => setIsPaid(true)}
        >
         <Text style={[styles.text, isPaid ? styles.activeText : styles.inactiveText]}>
           PAYEE
         </Text>
        </TouchableOpacity>

        <TouchableOpacity
         style={[styles.buttontabbutton, !isPaid ? styles.activeUnpaid : styles.inactiveButton]}
         onPress={() => setIsPaid(false) }
        >
         <Text style={[styles.text, !isPaid ? styles.activeText : styles.inactiveText]}>
           IMPAYEE
         </Text>
        </TouchableOpacity>
        </View>

        <View style={styles.fixedHeader}>
        {/* Invoice Header */}

        <View style={styles.header}>
          <View>

        <Text style={styles.Selecttext}>Information vendeur</Text>
          <Text style={styles.Selecttext3}><Ionicons name="person-circle" size={width * 0.035} color="#999"/> {invoice.compagnyname ? invoice.compagnyname.toUpperCase() : ''}</Text>

            <Text style={styles.Selecttext3}><Ionicons name="location" size={width * 0.035} color="#999"/> f55f6dz899z88d</Text>

            <Text style={styles.Selecttext3}><Ionicons name="calendar" size={width * 0.035} color="#999"/> Date : {invoice.dueDate}</Text>
            <Text style={styles.Selecttext3}><Ionicons name="time" size={width * 0.035} color="#999"/> Time : {invoice.dueTime}</Text>
          </View>

        </View>
        {/* Client Selection */}
    {clientInvoice && clientInvoice.name ? (

      <View style={styles.clientSelection}>
      <Text style={styles.Selecttext}>Information client</Text>
        <View style={styles.attribu}>
          <Text style={styles.Selecttext3}>Facture attribuée au client:</Text>
          <TouchableOpacity onPress={() => togglePaid()}>
            <Text style={styles.Selecttext3}>
              <Ionicons name="trash" size={width * 0.035} color="black" /> Effacer
            </Text>
          </TouchableOpacity>
        </View>


        <TouchableOpacity
          style={styles.productCard2}
        >
          <View style={styles.cardContent2}>
            <View style={[styles.column1, { backgroundColor: 'transparent' }]}>
              <Image
                source={iconMapping['user']} // Use the randomly selected icon
                style={styles.icon}
              />
            </View>
            <View style={styles.column2}>
              <Text style={styles.name}>{clientInvoice.name}</Text>
              <Text style={styles.date}>ID: CL45899</Text>
              <Text style={styles.date}>
                <Ionicons
                  name="alert-circle-outline"
                  size={width * 0.025}
                  color="#D15D5D"
                />{' '}
                {clientInvoice.nbrinvoice} invoices en retard
              </Text>
            </View>
            <View style={styles.column3}>
              <Ionicons
                name="wallet-outline"
                size={width * 0.09}
                color={
                  clientInvoice.nbrunpaid - clientInvoice.nbrpaid < 0
                    ? '#D15D5D' // Red if unpaid - paid < 0
                    : clientInvoice.nbrunpaid - clientInvoice.nbrpaid === 0
                    ? '#3682B3' // Blue if unpaid - paid = 0
                    : '#4CAF50' // Green if unpaid - paid > 0
                }
              />
              <Text style={styles.price}>{clientInvoice.nbrunpaid - clientInvoice.nbrpaid} Dh</Text>
              <Text style={styles.description}>Dh TTC (20%)</Text>
            </View>
          </View>
        </TouchableOpacity>


      </View>
    ) : (
      !isPaid && (
        <View style={styles.clientSelection}>
        <Text style={styles.Selecttext}>Information client</Text>
          <View style={styles.attribu}>
            <Text style={styles.Selecttext3}>Facture attribuée au client:</Text>
            <TouchableOpacity onPress={() => togglePaid()}>
              <Text style={styles.Selecttext3}>
                <Ionicons name="trash" size={width * 0.035} color="black" /> Effacer
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            style={styles.buttonclient}
            onPress={() => handlePresentModalFirstPress('Client')}
          >
          SELECTIONNER UN CLIENT
          </Button>
        </View>
      )
    )}
        </View>


        <View style={styles.table}>
        <Text style={styles.Selecttext}>Information articles</Text>
          <View style={styles.tableHeader}>
            <Text  style={styles.Selecttext5}>Articles</Text>
            <Text style={styles.Selecttext5}>Prix U</Text>
            <Text style={styles.Selecttext5}>Quantité</Text>
            <Text style={styles.Selecttext5}>Total</Text>
          </View>

          {invoice.products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.Selecttext44}>{product.name}</Text>
              <Text style={styles.Selecttext4}>{product.price} Dh</Text>
              <Text style={styles.Selecttext4}>{product.quantity}</Text>
              <Text style={styles.Selecttext4}>{(product.quantity * product.price).toFixed(2) } Dh</Text>
            </View>
          ))}
        </View>

        <View style={styles.fixedFooter}>





        {/* Invoice Summary */}
        <View style={styles.summary}>
        <Text style={styles.Selecttext}>Résumé</Text>
          <Text style={styles.Selecttext3}>Total HT: {(invoice.total * 0.8 ).toFixed(2)} Dh</Text>
          <Text style={styles.Selecttext3}>TVA (20%): {(invoice.total * 0.2 ).toFixed(2)} Dh</Text>

          <Text style={styles.Selecttext0}>Total: {(invoice.total).toFixed(2)} Dh TTC (20%)</Text>
        </View>

        {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isPaid ? (
        <Button
          onPress={() => handleSendData()}
          style={buttonStyle}
        >
          VALIDER LA FACTURE
        </Button>
      ) : (
        <Button
          onPress={() => handleSendData()}
          disabled={buttonDisabled}
          style={buttonStyle}
        >
          VALIDER LA FACTURE
        </Button>
      )}

        {/* Validate Invoice Button */}

      </View>




</ScrollView>
{showArrow && (
        <Ionicons name="arrow-down-circle" size={width*0.15} color="black" style={styles.arrow} />
      )}
<BottomSheetModalProvider>
  <BottomSheetModal
    ref={bottomSheetModalFirstRef}
    snapPoints={snapPoint}
    index={0} // Starts closed
    enableContentPanningGesture={true}
    enableHandlePanningGesture={true}
    backgroundStyle={styles.backgroundcontainer}
    style={styles.bottomsheetcontainer}
    handleStyle={styles.handlebottomsheet}
    enablePanDownToClose={true} // Allow closing by dragging down
    backdropComponent={renderBackdrop}
  >
  <BottomSheetContent
     selectedClient={selectedClient}   />
  </BottomSheetModal>
</BottomSheetModalProvider>
          </View>
      </Layout>
      );
     });
 export default Clienty;

// Styles with responsive design
const styles = StyleSheet.create({
  arrow: {
     position: 'absolute',
     bottom: 20,
     alignSelf: 'center',
   },
  formContainer: {
    width:'100%',
    backgroundColor:'#fff',
    justifyContent:'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  cardContent: {
    alignItems:'center',
    justifyContent:'center',
    padding:10,
    paddingTop:width*0.15,
    backgroundColor:'#fff',
  },
  Selecttext8:{
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color:'#333',
    paddingTop:10,
  },

  fixedHeader: {
  padding:10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  Selecttext:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom:10,
  },
  Selecttext3:{
    fontSize: width * 0.03,
    color:'#999',
  },

  containertabbutton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.003, // Rounded corners for the whole tab
    backgroundColor: 'transparent', // Grey background for the whole bar
    paddingVertical:20,
  },
  buttontabbutton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20, // Rounded corners for the whole tab
    alignItems: 'center',
    marginHorizontal: 0,
  },
  activePaid: {
    backgroundColor: '#3682B3',  // Blue for active Paid button
  },
  activeUnpaid: {
    backgroundColor: '#D15D5D',  // Red for active Unpaid button
  },
  inactiveButton: {
    backgroundColor: '#edf1f7',  // Grey for inactive buttons
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeText: {
    color: 'white',  // White text for active buttons
  },
  inactiveText: {
    color: '#333',  // White text for inactive buttons
  },
  table: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    minHeight: height * 0.33, // Constrain product list height
  padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#999',
    padding: 10,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor:'#999',
    borderWidth:0.2,

    padding: 10,
  },
  tableCell: {
    width: width / 4 - 20,
    textAlign: 'center',
    color: '#999',
  },
  tableDivider: {
    backgroundColor: '#fff',
  },
  Selecttext4:{
    fontSize: width * 0.03,
    width: width / 4 - 20,
    textAlign: 'center',
    color: '#999',
  },
  Selecttext44:{
    fontSize: width * 0.03,
    width: width / 4 - 20,
    textAlign: 'left',
    color: '#999',
  },
  Selecttext5:{
    fontSize: width * 0.03,
    width: width / 4 - 20,
    textAlign: 'center',
    color: '#fff',
  },
  fixedFooter: {
     justifyContent: 'flex-end', // Aligns content to the bottom
     padding: 10, // Add padding if needed
  },
  summary: {
    marginBottom: 10,
    textAlign:'left',
    minHeight:width*0.35,
       justifyContent: 'center', // Aligns content to the bottom
       backgroundColor:'#fff'
  },
  totalText: {
    color: '#999',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3682B3',
    borderColor: '#3682B3',
    borderRadius: 20,
  },
  buttonclient: {
      backgroundColor: '#D15D5D',  // Red for active Unpaid button
      color:'#fff',
      borderRadius:20,
      borderColor:'transparent',
      marginVertical:10,
  },
  containertabbutton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.003, // Rounded corners for the whole tab
    backgroundColor: 'transparent', // Grey background for the whole bar
    marginVertical:5,
  },
  buttontabbutton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius:20,  // Rounded corners for individual buttons
    alignItems: 'center',
    marginHorizontal: 10,
  },
  Selecttext2:{
    fontSize: width * 0.04,
    color:'#999'
  },
  Selecttext0:{
    fontSize: width * 0.045,
    fontWeight:'bold',
  },
  attribu:{
    flexDirection: 'row',
    justifyContent: 'space-between',  // This will place items at the extremes
   alignItems: 'center',  // Align items vertically centered
  },
  clientSelection: {
    marginVertical: 10,
  },
  productCard2: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.002,
    borderColor : 'transparent',


  },
  cardContent2: {
    flexDirection: 'row',
    flex: 1,
  },

  avatar: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 25,
  },
  icon:{
    padding:10,
    width:width*0.18,
    height: width * 0.18,
  },
  column1: {
    height: 80, // Fixed width for the first column
    alignItems: 'center',
     justifyContent: 'center',
    backgroundColor:'#3682B3',
  },
  column2: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'left',
       justifyContent: 'center',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color:'#999',
  },
  date: {
    fontSize: width * 0.025,
    color: '#999',
  },
  column3: {
    paddingHorizontal:10,
    alignItems: 'center',
     justifyContent: 'center',
  },
  price: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
    color:'#999'
  },

  description: {
    fontSize: width * 0.02,
    color: '#999',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
