import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Dimensions, TouchableOpacity, Keyboard  } from 'react-native';
import { Avatar, Layout, Button, ApplicationProvider , Divider} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import * as eva from '@eva-design/eva';
import NewCode from './product/NewCode';

import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';



import Success from './Success';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetScrollView  } from '@gorhom/bottom-sheet';

const { width, height } = Dimensions.get('window');


const Mescodesproducts = ({ navigation, route  }) => {

  const { details } = route.params;
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(categories);

  const safeFilteredProducts = filteredProducts || [];

  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points
  const bottomSheetModalFirstRef = useRef(null);

  const db = useSQLiteContext();

  const [selectedComponent, setSelectedComponent] = useState(null); // Track modal content

  useEffect(() => {
    FetchCategories();
    // Simulate fetching products
    setLoading(false);
  }, []);

  useEffect(() => {

  const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    // Snap back to initial snap point when the keyboard hides
    bottomSheetModalFirstRef.current?.snapToIndex(0); // Go back to initial snap point
  });

  // Cleanup listeners on unmount
  return () => {
    keyboardDidHideListener.remove();
  };
}, []);

      //Fetch clients
      const FetchCategories = async () => {
        try {
          const category = 'subcategory'; // Replace with the desired category value
          const prefixcategory = details.prefixcategory; // Use the passed prefix value

          // Modify the query to filter by both `type` and the first 3 digits of `idunique`
          const result = await db.getAllAsync(
      `SELECT * FROM detailsfacture
       WHERE deleted = 0
         AND substr(productid, 1, 4) = ?
         AND id IN (
           SELECT MAX(id)
           FROM detailsfacture
           WHERE deleted = 0
             AND substr(productid, 1, 4) = ?
           GROUP BY substr(productid, 1, 4)
         )`,
      [prefixcategory, prefixcategory]
    );

          // Update the data state with the fetched results
          setCategories(result);
          setFilteredProducts(result);
        } catch (error) {
          console.log('Error fetching categories:', error);
        }
      };


  const searchText = useCallback((value) => {
    setSearchTerm(value);
    const filtered = value
      ? categories.filter(product => product.name.toLowerCase().includes(value.toLowerCase()))
      : categories;
    setFilteredProducts(filtered);
  }, [categories]);

  const BottomSheetContent = React.memo(() => {
    // Use a callback to render the content based on the ient
    const renderContent = useCallback(() => {
       return <NewCode AddCode ={AddCode} details={details} />;
    }, []);

    return (
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
      </BottomSheetScrollView>
    );
  });

  const AddCode = async ( invoiceDataProduct) => {
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
              0,
              details.prefixcategory+invoiceDataProduct.ean,
              invoiceDataProduct.name,
              'Yassine Jennane',
              0,
              0,
              1,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              invoiceDataProduct.price,
              0,
              0,
              0
            ]
          );
          console.log('Data sent successfully!');
        handlePresentModalFirstClose();
        FetchCategories();

        } catch (error) {
          console.log('Error sending data:', error);
        }
      };

  const handlePresentModalFirstPress = useCallback((component) => {
    // If it's a string, handle it as a component type

      setSelectedComponent(component);
      console.log('what component', component);

      // Adjust snap point based on component type
     if (component === 'Success') {
        setSnapPoint(['40%']);  // Set snap point for 'Modify'
      } else {
        setSnapPoint(['68%']);  // Default snap point for other cases
      }

    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.present();
  }, []);
  // callbacks
  const handlePresentModalFirstClose = useCallback(() => {
    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.close();
  }, []);

  const renderBackdrop = (props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // Backdrop shows up when sheet is open
            disappearsOnIndex={-1} // Backdrop disappears when closed
            pressBehavior="close" // Close the modal when backdrop is pressed
            opacity={0.9} // Adjust opacity
          />
        );



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3682B3',

    },
    layout: {
      backgroundColor:'#fff',
      paddingHorizontal: 16,
      flex: 1,
      justifyContent:'center',
    },
    Selecttext: {
      fontSize: width * 0.06,
      paddingTop: width * 0.1,
      fontWeight: 'bold',
      color: 'white',
      padding: 15,
    },
    formContainer: {
      padding:10,
      width:'100%',
      backgroundColor:'white',
      justifyContent:'center',

    },
    formContainerSearch: {
      padding:10,
      backgroundColor:'white',
      justifyContent:'center',
      height:80,

    },

    Selecttext1: {
      fontSize: width * 0.04,
      paddingTop: width * 0.02,
      fontWeight: 'bold',
      color: '#333',
      textTransform:'uppercase'
    },
    Selecttext2: {
      fontSize: width * 0.03,
      color: '#666',
    },
    productCard1: {
       justifyContent: 'center',
       alignItems: 'center',
       marginBottom: width * 0.02,
       marginRight:width * 0.025,
       backgroundColor: '#fff',
       borderRadius: width * 0.02,
       borderWidth: width * 0.003,
       borderColor: '#666',
       width: '23%',  // Fill the column
     },
     icon:{
       padding:10,
     },
     column1: {
        alignItems: 'center',
       justifyContent: 'center',

     },
     productName: {
         fontSize: width * 0.025,
         fontWeight: 'bold',
         textTransform: 'uppercase', // Converts text to uppercase
         padding: 2,
         flexWrap: 'wrap', // Allows text to wrap
         textAlign: 'center', // Aligns text to the left
     },
     productName2: {
         fontSize: width * 0.025,
         textTransform: 'uppercase', // Converts text to uppercase
         flexWrap: 'wrap', // Allows text to wrap
         textAlign: 'center', // Aligns text to the left
     },
     searchInput: {
       flex: 1,
       borderRadius: width * 0.02,
       borderWidth : width * 0.003,
       borderColor : '#666',
       padding: 10,
       backgroundColor: '#F6F6F6',
       fontSize: width * 0.03,

     },

     table: {
       borderWidth: 1,
       borderColor: 'transparent',
       backgroundColor: '#fff',
           minHeight: height * 0.43, // Constrain product list height
     },
     tableHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       backgroundColor: '#3682B3',
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

     Selecttext5:{
       fontSize: width * 0.03,
       width: width / 3 - 20,
       textAlign: 'center',
       color: '#fff',
     },

     fab: {
        position: 'absolute',
        bottom: 35,
        right: 20,
        backgroundColor: '#3682B3',
        width: width*0.18,
        height: width*0.18,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
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
        textTransform:'uppercase',
          fontWeight: 'bold',
      },
  });
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={{  backgroundColor: '#3682B3', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <Text style={styles.Selecttext}>Mes codes</Text>
      </View>

      <View style={styles.formContainer}>

       <Text style={styles.Selecttext1}>Etape 1 : {details.prefix} - {details.name}</Text>
       <Text style={styles.Selecttext1}>Etape 2 : {details.prefixcategory} - {details.namecategory}</Text>
       <Text style={styles.Selecttext1}>Etape 3 : Ajouter votre code</Text>
       <Text style={styles.Selecttext2}>Regrouper vos codes en catégories vous aide à mieux les classer et les mémoriser. Choisir des préfixes définis pour chaque catégorie vous permettra de vous rappeler plus facilement du code produit que vous souhaitez ajouter à votre facture.</Text>

      </View>

      <View style={styles.formContainerSearch}>
            <TextInput
              style={styles.searchInput}
              placeholder="Trouver un code.."
              value={searchTerm}
              onChangeText={searchText}
            />
      </View>


      <View style={styles.formContainer}>
      <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={styles.Selecttext5}>Produit</Text>
      <Text style={styles.Selecttext5}>Prix</Text>
      <Text style={styles.Selecttext5}>Code</Text>
    </View>
    <Divider style={styles.tableDivider} />

    {/* Ensure that filteredProducts is not null and has items */}
    {safeFilteredProducts.length > 0 ? (
      safeFilteredProducts.map((product, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.Selecttext44}>{product.productname}</Text>
          <Text style={styles.Selecttext4}>{(product.total/product.quantity).toFixed(2)} Dh</Text>
          <Text style={styles.Selecttext4}>{product.productid}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.emptyText}>Aucun code sur la liste..</Text> // Optional empty state
    )}
  </View>
      </View>


       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
               style={styles.fab}
               onPress={() => handlePresentModalFirstPress('Ajouter')}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
       </View>


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
               />
          </BottomSheetModal>
      </BottomSheetModalProvider>
    </ApplicationProvider>
  );
};



export default Mescodesproducts;
