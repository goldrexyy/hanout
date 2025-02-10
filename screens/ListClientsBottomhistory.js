import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator, SectionList, RefreshControl, Image} from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar, Divider } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import moment from 'moment';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import NewClient from './clients/NewClient';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import LoadingScreen from './LoadingScreen'; // Import your LoadingScreen
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



const Client = React.memo(({  selectedClient, isPressed }) => {
    console.log('start client bottom');
  // State variables
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState(data);

  const [clients, setClients] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const db = useSQLiteContext();

  const [refreshing, setRefreshing] = useState(false);

  // Filtered list based on search input
  const filteredData = data;

  const iconMapping = {
    'user': require('../assets/users/user.png'),
    'user2': require('../assets/users/user2.png'),
  };
  useEffect(() => {
    // Only fetch clients if they have not been fetched yet
    if (!clients.length && !isFetching) {
      fetchClients();
    }
  }, [clients]);

  // Function to trigger when the list is pulled down enough
  const onRefresh = useCallback(() => {
    // Start refreshing
    setRefreshing(true);

    // Simulate a network request (you can replace this with your actual refresh logic)
    setTimeout(() => {
      // Stop refreshing after data is reloaded
      setRefreshing(false);
      // Call your refresh function here
      refresh();
    }, 2000); // Example delay for 2 seconds
  }, []);

  // Simulated refresh function (replace with your own logic)
  const refresh = () => {
       fetchClients(); // Fetch data when the screen comes into focus
  };
  //Open

  // Fetch clients
  const fetchClients = async () => {
    setIsFetching(true);
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM clients WHERE deleted = 0 AND userid = ?`, ['1']
      );
      const sortedClients = result.sort((a, b) => a.name.localeCompare(b.name));
      setData(sortedClients);
      setFilteredInvoices(sortedClients);
      setIsFetching(false);
    } catch (error) {
      console.log('Error fetching clients', error);
      setIsFetching(false);
    }
  };



//GroupeBY
  const groupClientsByInitial = (clients) => {
  return clients.reduce((acc, client) => {
    const initial = client.name.charAt(0).toUpperCase(); // Get the first letter and convert to uppercase
    if (!acc[initial]) {
      acc[initial] = [];
    }
    acc[initial].push(client);
    return acc;
  }, {});
};

  const groupedClients = groupClientsByInitial(filteredInvoices);

// Prepare data for SectionList
 const sections = Object.keys(groupedClients).map(initial => ({
   title: initial,
   data: groupedClients[initial],
 }));


  const getLengthItem = () => {
    return itemCount = filteredInvoices.length;
  };


  const renderItem = ({ item }) => {
    // Randomly select either 'user' or 'user2'
    const randomIcon = Math.random() < 0.5 ? 'user' : 'user2';

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => selectedClient(item)}
      >
        <View style={styles.cardContent}>
          <View style={[styles.column1, { backgroundColor: 'transparent' }]}>
            <Image
              source={iconMapping[randomIcon]} // Use the randomly selected icon
              style={styles.icon}
            />
          </View>
          <View style={styles.column2}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>ID: CL45899</Text>
            <Text style={styles.date}>
              <Ionicons
                name="alert-circle-outline"
                size={width * 0.025}
                color="#D15D5D"
              />{' '}
              {item.nbrinvoice} invoices en retard
            </Text>
          </View>
          <View style={styles.column3}>
            <Ionicons
              name="wallet-outline"
              size={width * 0.09}
              color={
                item.nbrunpaid - item.nbrpaid < 0
                  ? '#D15D5D' // Red if unpaid - paid < 0
                  : item.nbrunpaid - item.nbrpaid === 0
                  ? '#3682B3' // Blue if unpaid - paid = 0
                  : '#4CAF50' // Green if unpaid - paid > 0
              }
            />
            <Text style={styles.price}>{(item.nbrunpaid - item.nbrpaid).toFixed(2)} Dh</Text>
            <Text style={styles.description}>Dh TTC (20%)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  const ItemSeparator = () => {
  return <View style={{ height: 10 }} />; // Adjust height as needed for padding
};



  return (

        <Layout style={styles.container}>

        <TouchableOpacity style={styles.ActionBottom}>
          <View style={styles.column0000}>
            <Ionicons name="person" size={width * 0.08} style={styles.icon3} />
          </View>
          <View style={styles.column177}>
            <Text style={styles.productNameAction}>Filter par client</Text>
          </View>
        </TouchableOpacity>

          <View style={styles.container2}>
            <TextInput
              style={styles.searchInput}
              placeholder="Chercher un client.."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
             <Divider style={styles.divider2} />
             <Text style={styles.result}>Résultat trouvé: ({getLengthItem()}) Clients</Text>
             <SectionList
              style={styles.list}
              sections={sections}
              keyExtractor={(item, index) => item.id.toString()} // Adjust based on your client ID
              renderItem={renderItem}
              renderSectionHeader={({ section: { title } }) => (
                 <Text style={{ fontWeight: 'bold', fontSize: width *0.03, color:'#666', padding:5 }}>{title}</Text>
               )}
              ItemSeparatorComponent={ItemSeparator} // Add the separator component
              showsVerticalScrollIndicator={false}
              refreshControl={
              <RefreshControl
               refreshing={refreshing}
               onRefresh={onRefresh} // Trigger on pull
               colors={['#0000ff']} // Customize color of the refresh icon
                />
      }
  />
          </View>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => selectedClient(null)}>
            <View style={styles.column0000}>
              <Ionicons name="trash" size={width * 0.08} color="#D15D5D" style={styles.icon3} />
            </View>
            <View style={styles.column177}>
              <Text style={[styles.productNameAction, { color: '#D15D5D' }]}>
                Annuler le filtre
              </Text>
            </View>
          </TouchableOpacity>
        </Layout>
      );
     });
     export default Client;

// Styles with responsive design
const styles = StyleSheet.create({

  formContainer: {
    padding:10,
    width:'100%',
    backgroundColor:'white',
    justifyContent:'center',

  },
  ActionBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.02,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor:'transparent',
  },
  column0000: {
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
  icon3:{
    padding:10,
  },
  column177: {
      flex: 1,
    padding: width * 0.02,
    alignItems:'left',
    justifyContent:'center',
  },
  productNameAction: {
    fontSize: width * 0.04,
    color:'#333',
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

  column11: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3682B3',
    flex: 0.4,
    height: 100,
  },
  container2: {
    flex:1,
    backgroundColor: '#fff',
    position:'relative',
    padding:10,
    width:'100%',
  },
  Selecttext8: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    paddingRight:5,
  },

  cardContent2: {
    flexDirection: 'row',
    flex: 1,

  },
fab: {
   position: 'absolute',
   bottom: 70,
   right: 20,
   backgroundColor: '#3682B3',
   width: 56,
   height: 56,
   borderRadius: 28,
   alignItems: 'center',
   justifyContent: 'center',
   elevation: 5,
 },

  contentContainer:{
    flex:1,
    padding:15,

  },
  bottomsheetcontainer:{
    backgroundColor:'transparent'
  },

  backgroundcontainer:{
      backgroundColor:'white'
  },

  handlebottomsheet:{
    backgroundColor:'transparent'
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:{
    padding:10,
    width:width*0.18,
    height: width * 0.18,
  },
  badge: {
    padding: width * 0.01,
    fontSize : width * 0.02,
    fontWeight: 'bold',
  },
  divider2: {
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  Selecttext:{
    fontSize: width * 0.06,
    paddingTop:width*0.1,
    fontWeight: 'bold',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:width*0.3,
  },
  layout: {
    backgroundColor:'#fff',
    paddingHorizontal: 16,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider:{
    width:50,
  },
  filterButton: {
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#666',
    padding: 10,
    paddingVertical:10,
    marginRight: width * 0.01,
  },
  buttonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize:width * 0.025,
  },
  activeButton: {
   backgroundColor: '#3682B3', // Dark background for active state
 },
 activeText: {
   color: '#fff', // Text color when active
 },
 inactiveButton: {
   backgroundColor: '#F6F6F6', // Default background color for inactive state
 },
 inactiveText: {
   color: '#666', // Default text color when inactive
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

  filterTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: 'black',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 18,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.002,
    borderColor : 'transparent',
    elevation: 1,

  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },

  avatar: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 25,
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
  column3: {
    paddingHorizontal:10,
    alignItems: 'center',
     justifyContent: 'center',
  },
  column4: {
    flex: 0.3,
    paddingHorizontal: 10,
  },
  date: {
    fontSize: width * 0.025,
    color: '#666',
  },
  result: {
    fontSize: width * 0.03,
    color: '#666',
        fontWeight: 'bold',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  price: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },

  description: {
    fontSize: width * 0.02,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  list: {
    marginVertical: 5,
  },
  itemSeparator: {
    height: 10,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  topButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
