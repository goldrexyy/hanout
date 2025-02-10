import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator, SectionList} from 'react-native';
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
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



export default function App({ navigation, route }) {
  // State variables
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState(data);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); // To track which filter is active
  const db = useSQLiteContext();
  const bottomSheetRef = useRef(null);
  const [isBottomOpened, setIsBottomOpened] = useState(false);
   const inputRef2 = useRef(null); // Reference for the Input inside NewClient


  // Filtered list based on search input
  const filteredData = data;

  //Load Invoices
  useFocusEffect(
    React.useCallback(() => {
      fetchClients(); // Fetch data when the screen comes into focus
    }, [])
  );


  //Open
  const expandBottomSheet = () => {
    bottomSheetRef.current?.expand();
    setTimeout(() => {
         inputRef2.current.focus(); // Focus the input after 500ms
       }, 50); // Adjust the delay time as needed (500ms = half a second)
    setIsBottomOpened(true);
  };

    // Close
    const closeBottomSheet = () => {
       bottomSheetRef.current?.close();
       setIsBottomOpened(false);
     };

     const handleChange = () => {
       setIsBottomOpened(true);
       closeBottomSheet();
    //      setShowCards(false); // Reset menu (or hide cards) when focused
      };

      const renderBackdrop = useCallback(
        (props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1} // Ensure the backdrop disappears when sheet is closed
            appearsOnIndex={0} // Ensure the backdrop appears when the sheet is open
            opacity={0.8} // Customize opacity to make it darker
          />
        ),
        []
      );

    const AddClient = async ( client ) => {
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
              client.idunique, // idunique
              client.name, // name
              'https://randomuser.me/api/portraits/men/1.jpg', // avatar
              client.number, // number
              '1', // userid
              6.555, // lat (REAL)
              0.77, // long (REAL)
              0, // nbrinvoice (TEXT)
              0, // nbrpaid (TEXT)
              0, // nbrunpaid (TEXT)
              0 // deleted (INTEGER, not TEXT)
            ]
          );
          closeBottomSheet();
          fetchClients(); // Fetch data when the screen comes into focus
                console.log('Data sent successfully!');

              } catch (error) {
                console.log('Error sending data:', error);
              }
            };
      const DeleteClient = async (client) => {
               try {
                 await db.runAsync(
                  `UPDATE clients SET deleted = 1 WHERE id = ?`,
                  [client.id]
                 );
                   fetchClients(); // Fetch data when the screen comes into focus
                 console.log('Data delete successfully!');
               } catch (error) {
                 console.log('Error sending data:', error);
               }
             };

  // Filter data based on selected criteria
  const toggleFilter = (item) => {
      if (activeFilter === item.label) {
        // If the clicked filter is already active, disable it
        setActiveFilter(null); // Deactivate the filter
        setFilteredInvoices(data);

      } else {
        // Otherwise, activate the clicked filter
        setActiveFilter(item.label);
        item.action(); // Call the filter action
      }
    };


  // Function to filter unpaid invoices
  const filterUnpaidInvoices = () => {

  };

  // Function to filter paid invoices
  const filterPaidInvoices = () => {

  };

  // Function to filter recent invoices (past 360 minutes)
  const filterRecentInvoices = () => {

  };

  // Function to filter today's invoices
  const filterTodayInvoices = () => {

  };

  // Function to filter yesterday's invoices
  const filterYesterdayInvoices = () => {

  };

  // Function to filter invoices from this week
  const filterThisWeekInvoices = () => {

  };

  // Function to filter invoices from the past week
  const filterPastWeekInvoices = () => {

  };

  const filterOptions = [
    { label: 'Paid Invoice', action: filterPaidInvoices  },
    { label: 'UnPaid Invoice', action: filterUnpaidInvoices },
    { label: 'Recent Invoice', action: filterRecentInvoices },
    { label: 'Today Invoice', action: filterTodayInvoices },
    { label: 'Yesterday Invoice', action: filterYesterdayInvoices },
    { label: 'This Week Invoice', action: filterThisWeekInvoices },
    { label: 'Past Week Invoice', action: filterPastWeekInvoices },
  ];


  //Fetch clients
  const fetchClients = async () => {
     try {
       const result = await db.getAllAsync(`SELECT * FROM clients WHERE deleted = 0 AND userid = ?`, ['1']);
       const sortedClients = result.sort((a, b) => a.name.localeCompare(b.name));
       setData(sortedClients); // Update the data state with the fetched results
       setFilteredInvoices(sortedClients);
     await SplashScreen.hideAsync(); // Hide splash screen once loading state changes
     } catch (error) {
       console.log('result', error);
     await SplashScreen.hideAsync(); // Hide splash screen once loading state changes
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


   if (loading) {
     return <ActivityIndicator size="large" color="#0000ff" />;
   }

  // Handle delete action
  const handleDelete = (id) => {
    const updatedItems = data.filter(item => item.id !== id);
    setData(updatedItems);
  };

  // Scroll to top function
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };


  const getLengthItem = () => {
    return itemCount = filteredInvoices.length;
  };

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        navigation.goBack(); // Go back to the previous screen
        route.params.onSelectClient({
          id: item.id,
          name: item.name,
          idunique: item.idunique,
        });
      }}
    >
      <View style={styles.cardContent}>
      <View style={styles.column1}>

        <Ionicons name="person" size={width * 0.1} color='white' style={styles.icon} />

      </View>
        <View style={styles.column2}>

          <Text style={styles.name}>{item.name}
          </Text>
          <Text style={styles.date}>{item.nbrinvoice} invoices unpaid  </Text>
        </View>
        <View style={styles.column3}>
    <Ionicons
      name="wallet-outline"
      size={width * 0.06}
      color={
        item.nbrunpaid - item.nbrpaid < 0
          ? '#D15D5D'  // Red if unpaid - paid < 0
          : item.nbrunpaid - item.nbrpaid === 0
          ? '#3682B3'  // Blue if unpaid - paid = 0
          : '#4CAF50'  // Green if unpaid - paid > 0
      }
    />
    <Text style={styles.price}>
      {item.nbrunpaid - item.nbrpaid} Dh
    </Text>
    <Text style={styles.description}>Dh TTC (20%)</Text>
  </View>

      </View>
    </TouchableOpacity>
  );

  const ItemSeparator = () => {
  return <View style={{ height: 10 }} />; // Adjust height as needed for padding
};

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.layout}>
          {/* Search Input and Filter Button */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
           <Text style={styles.Selecttext}>List of Clients ({getLengthItem()})</Text>

           <TouchableOpacity
             onPress={() => expandBottomSheet()}
           >
   <Ionicons
     name={"person-add"}
     size={width * 0.07}
     color="black"
   />
 </TouchableOpacity>
          </View>

            <Divider style={styles.divider2} />
          <View style={styles.row}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
            <Divider style={styles.divider2} />




            <SectionList
              style={styles.list}
    sections={sections}
    keyExtractor={(item, index) => item.id.toString()} // Adjust based on your client ID
    renderItem={renderItem}
    renderSectionHeader={({ section: { title } }) => (
      <Text style={{ fontWeight: 'bold', fontSize: width *0.04, color:'#666', padding:5 }}>{title}</Text>
    )}
      ItemSeparatorComponent={ItemSeparator} // Add the separator component
      showsVerticalScrollIndicator={false}
  />

            <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Starts closed
        snapPoints={['80%']}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        backgroundStyle={styles.backgroundcontainer}
        style={styles.bottomsheetcontainer}
        handleStyle={styles.handlebottomsheet}
        enablePanDownToClose={true} // Allow closing by dragging down
         backdropComponent={renderBackdrop}

      >

      <BottomSheetView style={styles.contentContainer}>
        <NewClient AddClient={AddClient} inputRef2={inputRef2} />
      </BottomSheetView>

        {/* Bottom Sheet Content */}
      </BottomSheet>


        </Layout>
      </SafeAreaView>
    </ApplicationProvider>
  );
}

// Styles with responsive design
const styles = StyleSheet.create({
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
  },
  badge: {
    padding: width * 0.01,
    fontSize : width * 0.02,
    fontWeight: 'bold',
  },
  divider2: {
    marginVertical: 5,
    backgroundColor: '#E4E9F2',
  },
  Selecttext:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position:'relative',
  },
  layout: {
    backgroundColor:'#fff',
    padding: 16,
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
    marginRight:width * 0.01,
    padding: 5,
    paddingLeft: 15,
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
    borderWidth : width * 0.003,
    borderColor : '#666',
    elevation: 2,

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
    backgroundColor:'#D15D5D',
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
    fontSize: width * 0.03,
    color: 'red',
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
    marginBottom:width * 0.13,
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
