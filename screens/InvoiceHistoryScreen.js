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
  const db = useSQLiteContext();
  const { invoice } = route.params || {}; // This will prevent errors if route.params is undefined

  useEffect(() => {
      LoadProducts();
      console.log('invoice', invoice);
    }, [invoice]);
    const iconMapping = {
      'user': require('../assets/users/user.png'),
      'user2': require('../assets/users/user2.png'),
    };

  const [clients, setClients] = useState([]);
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePaid = () => setIsPaid(!isPaid);
  const [products, setProducts] = useState([]);
  const scrollViewRef = useRef(null);

  const [showArrow, setShowArrow] = useState(false); // Initial state is false
  const [scrollViewHeight, setScrollViewHeight] = useState(0); // To store layoutMeasurement height
  const [contentHeight, setContentHeight] = useState(0); // To store content height


  useEffect(() => {
            LoadProducts();
  }, [invoice]);

  useEffect(() => {
   if (scrollViewHeight && contentHeight) {
     setShowArrow(contentHeight  > scrollViewHeight - 20);
     setShowArrow(true);
   }
 }, [scrollViewHeight, contentHeight, invoice]);
   const LoadProducts = async () => {
 const  idunique = invoice.idunique;
 const  userid = invoice.userid;
      try {
        const result = await db.getAllAsync(
  `SELECT * FROM detailsfacture WHERE deleted = 0 AND userid = ? AND factureid = ?`,
  [userid, idunique] // Use the actual user ID variable as needed
 );


        setProducts(result);
      } catch (error) {
        console.log('Error loading products:', error);
      }
    };
    // Function to handle scroll event
   const handleScroll = (event) => {
     const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
     const isScrolledToEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;

     setShowArrow(!isScrolledToEnd);
   };

  return (
      <Layout style={styles.container}>
        <View style={styles.formContainer}>
        <ScrollView
        showsVerticalScrollIndicator = {false}
        ref={scrollViewRef}
        scrollEventThrottle={16}
          onScroll={handleScroll}
        >

        <View style={styles.cardContent}>
        <QRCode value={invoice.idunique} size={100} />
            <Text style={styles.Selecttext8}>FACTURE {invoice.paid === 1 ? 'PAYEE' : 'IMPAYEE' } #{invoice.idunique ? invoice.idunique : '' }</Text>
        </View>



        <View style={styles.fixedHeader}>
        {/* Invoice Header */}

        <View style={styles.header}>
          <View>

        <Text style={styles.Selecttext}>Information vendeur</Text>
          <Text style={styles.Selecttext3}><Ionicons name="person-circle" size={width * 0.035} color="#999"/> {invoice.clientname ? invoice.clientname.toUpperCase() : ''}</Text>

            <Text style={styles.Selecttext3}><Ionicons name="location" size={width * 0.035} color="#999"/> f55f6dz899z88d</Text>

            <Text style={styles.Selecttext3}><Ionicons name="calendar" size={width * 0.035} color="#999"/> Date : {invoice.dueDate ? invoice.dueDate :''}</Text>
            <Text style={styles.Selecttext3}><Ionicons name="time" size={width * 0.035} color="#999"/> Time : {invoice.dueTime ? invoice.dueTime : ''}</Text>
          </View>

        </View>

          {invoice.clientname !== '' ? (

      <View style={styles.clientSelection}>
      <Text style={styles.Selecttext}>Information client</Text>
        <View style={styles.attribu}>
          <Text style={styles.Selecttext3}>Facture attribuée au client:</Text>
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
              <Text style={styles.name}>{invoice.clientname}</Text>
              <Text style={styles.date}>ID: CL45899</Text>
              <Text style={styles.date}>
                <Ionicons
                  name="alert-circle-outline"
                  size={width * 0.025}
                  color="#D15D5D"
                />{' '}
               0 invoices en retard
              </Text>
            </View>
            <View style={styles.column3}>
              <Ionicons
                name="wallet-outline"
                size={width * 0.09}
                color='#D15D5D'
              />
              <Text style={styles.price}>0 Dh</Text>
              <Text style={styles.description}>Dh TTC (20%)</Text>
            </View>
          </View>
        </TouchableOpacity>


      </View>
    ) : (
           null
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

          {products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.Selecttext44}>{product.productname}</Text>
              <Text style={styles.Selecttext4}>{(product.total / product.quantity).toFixed(2)} Dh</Text>
              <Text style={styles.Selecttext4}>{product.quantity}</Text>
              <Text style={styles.Selecttext4}>{(product.total).toFixed(2)} Dh</Text>
            </View>
          ))}
        </View>

         <View style={styles.fixedFooter}>


        {/* Invoice Summary */}
        <View style={styles.summary}>
        <Text style={styles.Selecttext}>Résumé</Text>
          <Text style={styles.Selecttext3}>Total HT: {(invoice.total * 0.8 )} Dh</Text>
          <Text style={styles.Selecttext3}>TVA (20%): {(invoice.total * 0.2 )} Dh</Text>

          <Text style={styles.Selecttext0}>Total: {(invoice.total)} Dh TTC (20%)</Text>
        </View>


      </View>

</ScrollView>
{showArrow && (
        <Ionicons name="arrow-down-circle" size={width*0.15} color="black" style={styles.arrow} />
      )}
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
