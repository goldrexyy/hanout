import React, { useEffect,useRef, useState, useCallback, useMemo } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView ,TouchableOpacity} from 'react-native';
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


const { width, height } = Dimensions.get('window');

const InvoiceSummaryScreen = ({navigation, route }) => {
  const { invoice } = route.params;
  const db = useSQLiteContext();
  const [clients, setClients] = useState([]);
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [clientId, setClientId] = useState('');

  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clientInvoice, setClientInvoice] = useState({
    id: invoice.clientid, // Initialize with invoice details
    name: invoice.custumername,
  });

  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points
  const bottomSheetModalFirstRef = useRef(null);

  const [isPaid, setIsPaid] = useState(invoice.isPaid || null); // Initialize isPaid with invoice

  const [selectedComponent, setSelectedComponent] = useState(null); // Track modal content

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
    }));
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
        // Initial effect when Invoice screen mounts

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


// Fetch clients from API
  useEffect(() => {
GetInvoiceId();
});

  // Fetch clients from API
  useEffect(() => {
    axios.get('http://localhost:3000/clients')
      .then(response => setClients(response.data))
  }, []);



  //ValidateInvoice
  const ValidateInvoice = () => {
    handleSendData();
   };

  const sendData = async ( invoiceData) => {
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
            total REAL
            lat REAL
            long REAL
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
          ) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?,?,?)`,
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
        console.log('Data sent successfully!');


      } catch (error) {
        console.log('Error sending data:', error);
      }
    };
  const sendDataproducts = async ( invoiceDataProduct) => {
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
              quantity TEXT,
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,? , ?, ?, ?,?,?,?,?,?)`,
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
          console.log('Data sent successfully!');
          navigation.navigate("Home", { invoiceSent: true });

        } catch (error) {
          console.log('Error sending data:', error);
        }
      };
  const sendDataClient = async ( invoiceDataClient) => {
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
            SET nbrunpaid = nbrunpaid + ?
            WHERE id = ?`,
         [invoiceDataClient.nbrunpaid, invoiceDataClient.id]
            );

              console.log('Data updated successfully!');


            } catch (error) {
              console.log('Error sending data:', error);
            }
          };
  const DeleteTable = async () => {
        try {
        await db.runAsync(`DROP TABLE IF EXISTS codes`);
    //    await db.runAsync(`DROP TABLE IF EXISTS detailsfacture`);
          console.log('Data deleted successfully!');
           navigation.navigate("Navigator",  { invoiceSent: true });
        } catch (error) {
          console.log('Error sending data:', error);
        }
      };


  const AddCodesTable = async () => {
              try {
                await db.runAsync(`
                  CREATE TABLE IF NOT EXISTS codes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    codes TEXT,
                    price TEXT,
                    quantity_cons TEXT,
                    created_at TEXT,
                    updated_at TEXT,
                    quantity_type TEXT,
                    marque TEXT,
                    sub_quantity_cons TEXT,
                    description TEXT,
                    deleted TEXT,
                    category TEXT,
                    lat TEXT,
                    long TEXT,
                    iscustom TEXT
                  )
                `);
                console.log('Table sent successfully!');

              } catch (error) {
                console.log('Error sending data:', error);
              }
            };


            // Function to copy the .sql file from assets to the file system and import data
  const AddCodes = async () => {
            try {
              // Load the asset from the `assets` folder
              const asset = Asset.fromModule(require('../assets/codes.sql'));
              await asset.downloadAsync();

              // Define the destination path in the app's file system
              const fileUri = FileSystem.documentDirectory + 'codes.sql';

              // Copy the SQL file to the app's file system
              await FileSystem.copyAsync({
                from: asset.localUri,
                to: fileUri,
              });

              // Read the content of the SQL file
              const sqlContent = await FileSystem.readAsStringAsync(fileUri);

              // Split the SQL file content into individual statements by semicolon
              const sqlStatements = sqlContent.split(';');
             console.log('start...');
              // Execute each SQL statement in the SQLite database
              db.transaction(tx => {
                sqlStatements.forEach(statement => {
                  // Trim any leading/trailing whitespace
                  const trimmedStatement = statement.trim();
                  if (trimmedStatement) {
                    tx.executeSql(trimmedStatement, [], (tx, result) => {
                      console.log('SQL statement executed:');
                    }, (tx, error) => {
                      console.error('Error executing SQL statement:', trimmedStatement, error);
                    });
                  }
                });
              });

              console.log('SQL file imported successfully');
            } catch (error) {
              console.error('Error during SQL file import:', error);
            }
  };
  const AddClientsTable = async ( invoiceData) => {
          try {
            await db.runAsync(`
              CREATE TABLE IF NOT EXISTS clients (
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
        `INSERT INTO clients (
          idunique,
          name,
          avatar,
          number,
          userid,
          lat,
          long,
          nbrinvoice,
          nbrpaid,
          nbrunpaid,
          deleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'CL003', // idunique
          'Yazid Jonhy', // name
          'https://randomuser.me/api/portraits/men/1.jpg', // avatar
          '0649553946', // number
          '1', // userid
          6.555, // lat (REAL)
          0.77, // long (REAL)
          '29', // nbrinvoice (TEXT)
          '7995', // nbrpaid (TEXT)
          '699', // nbrunpaid (TEXT)
          0 // deleted (INTEGER, not TEXT)
        ]
      );


            console.log('Data sent successfully!');

          } catch (error) {
            console.log('Error sending data:', error);
          }
        };

  const AddLat = async () => {
            try {
              await db.runAsync(`ALTER TABLE clients ADD COLUMN dueDate TEXT`);



              console.log('Data deleted successfully!');
               navigation.navigate("Navigator",  { invoiceSent: true });
            } catch (error) {
              console.log('Error sending data:', error);
            }
          };

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

         if(result){
           const lastIdunique = result[0].idunique;  // Example: 'IN0007'

           // Extract the numeric part from the string (e.g., '0007')
           const numericPart = parseInt(lastIdunique.replace('NR', ''), 10);

           // Increment the numeric part
           const nextNumericPart = numericPart + 1;

           // Format the new idunique with zero padding (e.g., 'IN0008')
           const newIdunique = `NR${nextNumericPart.toString().padStart(4, '0')}`;

           // Assign the new idunique to the invoice object
           invoice.idunique = newIdunique;
         } else {
            invoice.idunique = 'NR0001';
               console.log('resuldt',   invoice.idunique);
         }




       } catch (error) {
         console.log('result', error);
         invoice.idunique = 'NR0001';
       }
                // Extract the numeric part and increment it
                // Ensure there's a result and the idunique exists
  };

  const handleSendData = async () => {
    setLoading(true);

    // Prepare the common invoice data
    const commonInvoiceData = {
        userid: '1',
        dueDate: invoice.dueDate,
        dueTime: invoice.dueTime,
        lat: location.coords.latitude,
        long: location.coords.longitude,
        deleted: 0
    };

    // Send each product as a separate line
    const productPromises = invoice.products.map(async (product) => {
        const invoiceDataProduct = {
            ...commonInvoiceData,
            factureid: invoice.idunique,
            productid: product.ean,
            productname: product.name,
            companyname: invoice.companyname,
            clientid: clientInvoice ? clientInvoice.id : '',
            clientname: clientInvoice ? clientInvoice.name : '',
            subtotal: ((product.quantity * product.price) * 0.8).toFixed(2), // Adjust as necessary
            taxRate: 0.20,
            quantity: product.quantity,
            taxAmount: ((product.quantity * product.price) * 0.2).toFixed(2),
            paid: isPaid,
            total: ((product.quantity * product.price)).toFixed(2)
        };

        await sendDataproducts(invoiceDataProduct);
        console.log('Product added', product.id);
    });

    // Prepare the invoice data
    const invoiceData = {
        ...commonInvoiceData,
        idunique: invoice.idunique,
        companyname: 'Yassine Jennane',
        clientid: clientInvoice ? clientInvoice.id : '',
        clientname: clientInvoice ? clientInvoice.name : '',
        description: invoice.products.map(product => product.name).join(', '),
        subtotal: (invoice.total * 0.8).toFixed(2),
        taxRate: 0.20,
        taxAmount: (invoice.total * 0.2).toFixed(2),
        paid: isPaid,
        total: (invoice.total).toFixed(2),
    };

    // Prepare the client data
    const invoiceDataClient = {
        id: clientInvoice ? clientInvoice.id : '',
        nbrunpaid: (invoice.total).toFixed(2),
    };

    try {
        // Execute all product data sends in parallel
        await Promise.all(productPromises);

        // Sending the invoice data
        await sendData(invoiceData);

        // If a client is present, send client data
        if (clientInvoice.id) {
            await sendDataClient(invoiceDataClient);
        }

        // Open success bottom sheet
        handlePresentModalFirstPress('Success');

        // Wait for 4 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));



    } catch (error) {
        console.error('Error sending data:', error);
    } finally {
      // Navigate to Home
      navigation.navigate("Scan", { invoiceSent: true });
    }
};


  const togglePaid = () => {
    setClientInvoice(prevClientInvoice => ({
      ...prevClientInvoice,
      id: '',
      name: '',
    }));
  };

  const setClient = (client) => {
    invoice.clientid = client.id;
    invoice.clientname = client.name;
  };
  const handleValidation = () => {
    console.log('Invoice validated');
  };

  const isClientInvoiceValid = clientInvoice && clientInvoice.id;

  const buttonDisabled = !isPaid && (!clientInvoice || !isClientInvoiceValid);

  const buttonStyle = {
    backgroundColor: isPaid ? '#3682B3' : (isClientInvoiceValid ? '#D15D5D' : '#fff'),
      borderRadius: 20,
  };

  const getDynamicStyles1 = () => {
  return {
    ...styles.column1, // Spread static styles
    backgroundColor: isPaid ? '#fff' : '#fff', // Set background color based on item.client
  };
};

  const getDynamicStyles2 = () => {
  return {
    ...styles.column2, // Spread static styles
    backgroundColor: isPaid ? '#fff' : '#fff', // Set background color based on item.client
  };
};
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <ScrollView
        showsVerticalScrollIndicator = {false}
        >

        <View style={styles.cardContent}>
            <Text style={styles.Selecttext8}>INVOICE #{invoice.idunique}</Text>
        </View>


        {/* Toggle Invoice Paid */}

        <View style={styles.fixedHeader}>
        {/* Invoice Header */}

        <View style={styles.header}>
          <View>

          <Text style={styles.Selecttext}><Ionicons name="person-circle" size={width * 0.035} color="black"/> {invoice.compagnyname ? invoice.compagnyname.toUpperCase() : ''}</Text>

            <Text style={styles.Selecttext3}><Ionicons name="location" size={width * 0.035} color="black"/> 122 Business Rd, Business CIty, BC..</Text>

            <Text style={styles.Selecttext3}><Ionicons name="calendar" size={width * 0.035} color="black"/> Date : {invoice.dueDate}</Text>
            <Text style={styles.Selecttext3}><Ionicons name="time" size={width * 0.035} color="black"/> Time : {invoice.dueTime}</Text>
          </View>
          <QRCode value={invoice.id} size={100} />
        </View>
        <Divider style={styles.divider} />

        <View style={styles.containertabbutton}>
       <TouchableOpacity
         style={[styles.buttontabbutton, isPaid ? styles.activePaid : styles.inactiveButton]}
         onPress={() => setIsPaid(true)}
       >
         <Text style={[styles.text, isPaid ? styles.activeText : styles.inactiveText]}>
           Paid
         </Text>
       </TouchableOpacity>

       <TouchableOpacity
         style={[styles.buttontabbutton, !isPaid ? styles.activeUnpaid : styles.inactiveButton]}
         onPress={() => setIsPaid(false)}
       >
         <Text style={[styles.text, !isPaid ? styles.activeText : styles.inactiveText]}>
           Unpaid
         </Text>
       </TouchableOpacity>
        </View>

        {/* Client Selection */}
  {!isPaid ? ( // Check if isPaid is false (unpaid)
    <View style={styles.clientSelection}>
    <View style={styles.attribu}>
      <Text style={styles.Selecttext2}>Facture attribuée au client:</Text>
      <TouchableOpacity    onPress={() => togglePaid()} >
      <Text style={styles.Selecttext2}><Ionicons name="trash" size={width * 0.035} color="black"/> Effacer </Text>
      </TouchableOpacity>
    </View>
      <Divider style={styles.divider} />
      {clientInvoice && clientInvoice.name ? ( // Check if clientInvoice.name exists (client is selected)
        <TouchableOpacity
          style={styles.productCardClient}
          onPress={() => handlePresentModalFirstPress('Client')  }
        >

          <Divider style={styles.divider} />
          <View style={styles.cardContentClient}>
          <View
              style={[
              styles.column1Client,
              {backgroundColor:isPaid ? '#3682B3' : '#D15D5D' }, // Conditional background color
                  ]}
              >
              <Ionicons name="person" size={width * 0.1} color='white' style={styles.icon} />
            </View>
            <View style={styles.column2Client}>
              <Text style={styles.Selecttext}>{clientInvoice.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (


        <Button
          style={styles.buttonclient}
          status='basic'
           onPress={() => handlePresentModalFirstPress('Client')  }
        >
          Choose A Client
        </Button>
      )}
    </View>
  ) : (
    clientInvoice && clientInvoice.name ? ( // If isPaid is true but clientInvoice.name is not empty, show client info
      <View style={styles.clientSelection}>
      <View style={styles.attribu}>
        <Text style={styles.Selecttext2}>Facture attribuée au client:</Text>
        <TouchableOpacity    onPress={() => togglePaid()} >
        <Text style={styles.Selecttext2}><Ionicons name="trash" size={width * 0.035} color="black"/> Effacer </Text>
        </TouchableOpacity>
      </View>
          <Divider style={styles.divider} />
        <TouchableOpacity
          style={styles.productCardClient}
            onPress={() => handlePresentModalFirstPress('Client')  }
        >
          <Divider style={styles.divider} />
          <View style={styles.cardContentClient}>
          <View
              style={[
              styles.column1Client,
              {backgroundColor:isPaid ? '#3682B3' : '#D15D5D' }, // Conditional background color
                  ]}
              >
              <Ionicons name="person" size={width * 0.1} color='white' style={styles.icon} />
            </View>
            <View style={styles.column2Client}>
              <Text style={styles.Selecttext}>{clientInvoice.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    ) : null // If isPaid is true and clientInvoice.name is empty, show nothing
  )}




        </View>



      {/* Scrollable Product List */}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text  style={styles.Selecttext5}>Produit</Text>
            <Text style={styles.Selecttext5}>Quantité</Text>
            <Text style={styles.Selecttext5}>Prix Total</Text>
          </View>
          <Divider style={styles.tableDivider} />
          {invoice.products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.Selecttext44}>{product.name}</Text>
              <Text style={styles.Selecttext4}>{product.quantity}</Text>
              <Text style={styles.Selecttext4}>{(product.quantity * product.price).toFixed(2) } Dh</Text>
            </View>
          ))}
        </View>


        <View style={styles.fixedFooter}>
        <Divider style={styles.divider} />

        {/* Invoice Summary */}
        <View style={styles.summary}>
          <Text style={styles.Selecttext2}>Total HT: {(invoice.total * 0.8 ).toFixed(2)} Dh</Text>
          <Text style={styles.Selecttext2}>TVA (20%): {(invoice.total * 0.2 ).toFixed(2)} Dh</Text>
          <Divider style={styles.divider} />
          <Text style={styles.Selecttext}>Total: {(invoice.total).toFixed(2)} Dh TTC (20%)</Text>
        </View>

        <Divider style={styles.divider} />
        {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isPaid ? (
        <Button
          onPress={() => handleSendData()}
          style={buttonStyle}
        >
          Valider la Facture
        </Button>
      ) : (
        <Button
          onPress={() => handleSendData()}
          disabled={buttonDisabled}
          style={buttonStyle}
        >
          Valider la Facture
        </Button>
      )}

        {/* Validate Invoice Button */}

      </View>
      </ScrollView>
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
    </SafeAreaView>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
attribu:{
  flexDirection: 'row',
  justifyContent: 'space-between',  // This will place items at the extremes
 alignItems: 'center',  // Align items vertically centered
},
  productCardClient: {

  },
  cardContentClient: {
  flexDirection: 'row',
  flex: 1,
  borderRadius: width * 0.003,
  borderWidth: width * 0.003,
  borderColor: '#666',
  overflow: 'hidden',  // Add this line to clip inner content
},

  avatarClient: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 25,
  },
  column1Client: {
    height: 60, // Fixed height for the first column
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D15D5D',
    flex: 0.3,
    borderRadius:width * 0.003,
    // Ensure no margin or padding that affects positioning
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

    alignItems:'left',
    justifyContent:'center',
padding:10,
paddingTop:width*0.15,


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
  Selecttext000:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color:'#666',
  },
  Selecttext8:{
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color:'#333'
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
    backgroundColor: '#fff',

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
  table: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    backgroundColor: '#fff',
        minHeight: height * 0.43, // Constrain product list height
          paddingHorizontal:10,
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

  containertabbutton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.003, // Rounded corners for the whole tab
    backgroundColor: 'transparent', // Grey background for the whole bar
  },
  buttontabbutton: {
    flex: 1,
    paddingVertical: 10,

    borderRadius: width * 0.003,  // Rounded corners for individual buttons
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
});

export default InvoiceSummaryScreen;
