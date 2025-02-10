import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator, SectionList, RefreshControl} from 'react-native';
import { ApplicationProvider , Layout, Card, Text, Button, Avatar, Divider, Modal } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import moment from 'moment';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';


import SkeletonLoading from 'expo-skeleton-loading'



// Dimensions for responsive design
const { width, height } = Dimensions.get('window');
export default function App({ navigation, route }) {
  // State variables
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [filteredInvoices, setFilteredInvoices] = useState(data);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // To track which filter is active
  const [isSortedAscending, setIsSortedAscending] = useState(false);
  const db = useSQLiteContext();
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPaidFilter, setIsPaidFilter] = useState(null);  // null = no filter, true = paid, false = unpaid
  const [isRefundFilter, setIsRefundFilter] = useState(false); // false = no filter, true = refund
  const [recentFilter, setRecentFilter] = useState(false); // Default to showing all invoices


const [isPaid, setIsPaid] = useState(1); // null = both, 1 = paid, 0 = unpaid
const [dateFilter, setDateFilter] = useState('all');
 const [refreshing, setRefreshing] = useState(false);


 const sectionSkeletons = [
   {
     title: 'Loading...',
     data: [{ id: 1 }, { id: 2 }], // Two skeleton items for the first section
   },
   {
     title: 'Loading...',
     data: [{ id: 3 }, { id: 4 }], // Two skeleton items for the second section
   },
 ];

  // Filtered list based on search input
  const filteredData = data;


    useEffect(() => {
      setLoading(true)
       // Simulate loading time, replace this with actual API call
     setTimeout(() => {
       fetchAndCombineData();
      }, 500); // Simulating 2 seconds of loading
     }, []);


      // Initial data fetch
    useEffect(() => {
        filterInvoices();
    }, [isPaid, activeFilter]); // Run once when the component mounts



  const fetchAndCombineData = async () => {
    try {

      // Fetch invoices from database
      const invoices = await db.getAllAsync(`SELECT * FROM factures WHERE deleted = 0 ORDER BY id DESC`);

      // Fetch remboursements from database
      const remboursements = await db.getAllAsync(
        `SELECT * FROM remboursements WHERE deleted = 0 ORDER BY id DESC`
      );

      // Ensure data is combined even if one array is empty
      const combinedData = [
        ...(invoices.length > 0 ? invoices.map(item => ({ ...item, category: 'invoice' })) : []), // Mark as invoice
        ...(remboursements.length > 0 ? remboursements.map(item => ({ ...item, category: 'remboursement' })) : []) // Mark as remboursement
      ];

      // Sort combined data by date and time (newest to oldest)
      combinedData.sort((a, b) => {
        const dateA = moment(`${a.dueDate} ${a.dueTime}`, 'DD/MM/YYYY HH:mm');
        const dateB = moment(`${b.dueDate} ${b.dueTime}`, 'DD/MM/YYYY HH:mm');
        return dateB.diff(dateA); // Sort by newest to oldest
      });

      // Set the combined data
      setData(combinedData);
      setIsPaid(1);
       setLoading(false);

      // Automatically apply filters after fetching, if needed
      filterInvoices(combinedData); // Assuming you have a filterInvoices function
    } catch (error) {
      console.log('Error fetching data:', error);
        setLoading(false);
    }
  };
  const searchInvoices = (query) => {
    const filtered = data.filter(invoice =>
      (invoice.idunique && invoice.idunique.toLowerCase().includes(query.toLowerCase())) ||
      (invoice.description && invoice.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredInvoices(filtered);
  };


  // Function to trigger when the list is pulled down enough
 const onRefresh = useCallback(() => {
     // Start refreshing
     setRefreshing(true);
      setLoading(true);

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
     const fetchAndCombineData = async () => {
       try {


         // Fetch invoices from database
         const invoices = await db.getAllAsync(`SELECT * FROM factures WHERE deleted = 0 ORDER BY id DESC`);

         // Fetch remboursements from database
         const remboursements = await db.getAllAsync(
           `SELECT * FROM remboursements WHERE deleted = 0 ORDER BY id DESC`
         );

         // Ensure data is combined even if one array is empty
         const combinedData = [
           ...(invoices.length > 0 ? invoices.map(item => ({ ...item, category: 'invoice' })) : []), // Mark as invoice
           ...(remboursements.length > 0 ? remboursements.map(item => ({ ...item, category: 'remboursement' })) : []) // Mark as remboursement
         ];

         // Sort combined data by date and time (newest to oldest)
         combinedData.sort((a, b) => {
           const dateA = moment(`${a.dueDate} ${a.dueTime}`, 'DD/MM/YYYY HH:mm');
           const dateB = moment(`${b.dueDate} ${b.dueTime}`, 'DD/MM/YYYY HH:mm');
           return dateB.diff(dateA); // Sort by newest to oldest
         });

         // Set the combined data
         setData(combinedData);
         setIsPaid(1);
         setLoading(false);


         // Automatically apply filters after fetching, if needed
         filterInvoices(combinedData); // Assuming you have a filterInvoices function
       } catch (error) {
         console.log('Error fetching data:', error);
          setLoading(false);
       }
     };

     fetchAndCombineData(); // Call the function to fetch and combine data
   };


   const filterOptions = [
   { label: 'All' },
   { label: 'Recent' },
   { label: 'Today' },
   { label: 'Yesterday' },
   { label: 'This Week' },
   { label: 'Past Week' },
 ];

 // Modified filterInvoices to accept the data parameter
  const filterInvoices = (fetchedData = data) => {
  let filtered = fetchedData;

  // Apply date filter
  const today = moment();
  switch (activeFilter.toLowerCase()) {
    case 'recent':
      const recentCutoff = moment().subtract(360, 'minutes');
      filtered = filtered.filter(invoice =>
        moment(formatDateAndTime(invoice.dueDate, invoice.dueTime)).isAfter(recentCutoff)
      );
      break;
    case 'today':
      const today = moment().startOf('day');
      filtered = filtered.filter(invoice =>
        moment(formatDateAndTime(invoice.dueDate, invoice.dueTime)).isSame(today, 'day')
      );
      break;
    case 'yesterday':
      const yesterday = moment().subtract(1, 'days').startOf('day');
      filtered = filtered.filter(invoice =>
        moment(formatDateAndTime(invoice.dueDate, invoice.dueTime)).isSame(yesterday, 'day')
      );
      break;
    case 'this week':
      const startOfWeek = moment().startOf('isoWeek');
      filtered = filtered.filter(invoice =>
        moment(formatDateAndTime(invoice.dueDate, invoice.dueTime)).isSameOrAfter(startOfWeek)
      );
      break;
    case 'past week':
      const lastWeekStart = moment().subtract(1, 'weeks').startOf('isoWeek');
      const lastWeekEnd = moment().subtract(1, 'weeks').endOf('isoWeek');
      filtered = filtered.filter(invoice =>
        moment(formatDateAndTime(invoice.dueDate, invoice.dueTime)).isBetween(lastWeekStart, lastWeekEnd)
      );
      break;
    default:
      break;
  }

  // Apply payment filter
  if (isPaid !== null) {
    if (isPaid === 2) {
      // If isPaid is 2, filter for remboursements (category = 'remboursement')
      filtered = filtered.filter(item => item.category === 'remboursement');
    } else {
      // Otherwise, filter for invoices (category = 'invoice') and payment status
      filtered = filtered.filter(item => item.paid === isPaid && item.category === 'invoice');
    }
  }


  setFilteredInvoices(filtered); // Set the filtered invoices
};


 // Group invoices by date for SectionList
 const groupInvoicesByDate = (invoices) => {
   return invoices.reduce((acc, invoice) => {
     const date = moment(invoice.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
     if (!acc[date]) {
       acc[date] = [];
     }
     acc[date].push(invoice);
     return acc;
   }, {});
 };

 const groupedInvoices = groupInvoicesByDate(filteredInvoices);
 const sections = Object.keys(groupedInvoices).map(date => ({
   title: date,
   data: groupedInvoices[date],
 }));

 const toggleFilter = (item) => {
  if (activeFilter === item.label) {
    setActiveFilter('All'); // Reset to 'All' if the same filter is clicked
  } else {
    setActiveFilter(item.label);
  }
};

 const togglePaymentFilter = (type) => {
   // Toggle payment filter
   if (isPaid === type) {
     setIsPaid(null); // Reset to initial state
   } else {
     setIsPaid(type);
   }
 };

   const ItemSeparator = () => {
   return <View style={{ height: 10 }} />; // Adjust height as needed for padding
 };



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

  const isPastHour = (item) => {
  const [day, month, year] = item.dueDate.split('/'); // Split the date
  const [hours, minutes] = item.dueTime.split(':'); // Split the time
  const dueDateTime = new Date(year, month - 1, day, hours, minutes); // month is 0-indexed
  const oneHourAgo = new Date(Date.now() - 900000); // 1 hour in milliseconds
   return dueDateTime > oneHourAgo;
};

const formatDateAndTime = (dueDate, dueTime) => {
  const [day, month, year] = dueDate.split('/'); // Split the date (DD/MM/YYYY)
  const [hours, minutes] = dueTime.split(':'); // Split the time (HH:MM)

  // Create a Date object using the parsed day, month, year, hours, and minutes
  return new Date(year, month - 1, day, hours, minutes);
};

const handleFilter = () => {
  setIsSortedAscending(!isSortedAscending); // Toggle sorting order

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const dateA = formatDateAndTime(a.dueDate, a.dueTime); // Format date and time of invoice A
    const dateB = formatDateAndTime(b.dueDate, b.dueTime); // Format date and time of invoice B

    // Sort based on ascending or descending order
    return isSortedAscending ? dateA - dateB : dateB - dateA;
  });

  setFilteredInvoices(sortedInvoices); // Update the state with sorted invoices
};

  // Render each item in the FlatList
  const renderItem = ({ item, index  }) => (
    <TouchableOpacity
    style={styles.productCard}
  onPress={() => {
    if (item.category === "invoice") {
      navigation.navigate("InvoiceHistoryScreen", {
        invoice: {
          id: item.id,
          idunique: item.idunique,
          companyname: item.companyname,
          clientid: item.clientid,
          clientname: item.clientname,
          dueDate: item.dueDate,
          subtotal: (item.total * 0.8).toFixed(2),
          taxRate: 0.20,
          taxAmount: (item.total * 0.2).toFixed(2),
          paid: item.paid,
          total: item.total,
          userid: item.userid,
          products: []
        }
      });
    } else if (item.category === "remboursement") {
      navigation.navigate("Receive", {
        onSelectClient: {
          id: item.idunique, // Default client ID
          name: item.clientname, // Default client name
          idunique: item.clientid, // Unique ID
          nbrpaid: item.total,
          nbrunpaid : item.total,
          date:item.dueDate,
          time:item.dueTime,
          description: item.description,
        },
      });
    }
  }}
>
      <View style={styles.cardContent}>
        <View style={getDynamicStyles(item)}>
          <Ionicons name="receipt-outline" size={width * 0.1} color='white' style={styles.icon} />
        </View>
        <View style={styles.column2}>
         <Text style={styles.name}>N° {item.idunique}  </Text>
          <Text style={styles.date}><Ionicons name="calendar-outline" size={width * 0.025} color="#D15D5D"/> {item.dueDate} - {item.dueTime}
          {item.category === 'remboursement' ? null : (
        <Text
          style={[
            styles.badge,
            { color: item.paid === 1 ? '#3682B3' : item.paid === 0 ? '#D15D5D' : 'transparent' }
          ]}
        >
          {item.paid === 1 ? ' | Paid' : item.paid === 0 ? ' | Unpaid' : ''}
        </Text>
      )}


              <Text   style={[ styles.badge2,   { color: isPastHour(item) ? '#D15D5D' : '' },  ]}   >{isPastHour(item) ? 'New' : ''}   </Text>
          </Text>
          {(item.paid === 0 || item.category === 'remboursement') ? (
      <Text style={styles.date}>
        <Ionicons name="person-outline" size={width * 0.025} color="#D15D5D" /> {item.clientname}
      </Text>
    ) : null}



    {item.category !== 'remboursement' ? (
<Text style={styles.date} numberOfLines={3}>
  <Ionicons name="receipt-outline" size={width * 0.025} color="#D15D5D" /> {item.description}
</Text>
) : null}

        </View>
        <View style={styles.column3}>
        <Ionicons
  name={item.category === 'invoice'
    ? (item.paid ? "arrow-up" : "arrow-down") // For invoices, check the paid status
    : "arrow-up"}  // For remboursements, use a different icon (like "checkmark-circle")
  size={width * 0.06}
  color={item.category === 'invoice'
    ? (item.paid ? "#3682B3" : "red")  // Blue if paid, red if unpaid for invoices
    : "#4CAF50"}  // Green for remboursements
/>

            <Text style={styles.price}>{item.total}</Text>
            <Text style={styles.description}>Dh TTC (20%)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getDynamicStyles = (item) => {
    return {
      ...styless.column1, // Spread static styles
      backgroundColor: item.category === 'invoice'
    ? (item.paid === 1 ? '#3682B3'  // Blue if invoice is paid
       : item.paid === 0 ? '#D15D5D' // Red if invoice is unpaid
       : '#D15D5D') // Default to red if paid status is undefined
    : '#4CAF50',  // Green for remboursements

      height: item.paid ? 100 : 120, // Set background color based on item.client
    };
  };
  const getDynamicStyles2 = () => {
    return {
      ...styles.column10, // Spread static styles
      backgroundColor: isPaidFilter === 'Paid'  ? '#3682B3' : '#fff', // Set background color based on isPaidFilter and item.client
      color: isPaidFilter === 'Paid'  ? '#fff' : '#666', // Set background color based on isPaidFilter and item.client

    };
  };
  const getDynamicStyles25 = () => {
    return {
      ...styles.column10, // Spread static styles
      backgroundColor: isPaidFilter === 'Unpaid'  ? '#D15D5D' : '#fff', // Set background color based on isPaidFilter and item.client
      color: isPaidFilter === 'Unpaid' ? '#fff' : '#666', // Set background color based on isPaidFilter and item.client

    };
  };
  const getDynamicStyles254 = () => {
    return {
      ...styles.date, // Spread static styles
      color: isPaidFilter === 'Paid' ? '#fff' : '#666', // Set background color based on isPaidFilter and item.client

    };
  };
  const getDynamicStyles255 = () => {
    return {
      ...styles.date, // Spread static styles
      color: isPaidFilter === 'Unpaid' ? '#fff' : '#666', // Set background color based on isPaidFilter and item.client

    };
  };
  const getDynamicStyles3 = () => {
    return {
      ...styles.column11, // Spread static styles
      backgroundColor: isPaidFilter == 'Remboursement' ? '#3682B3' : '#fff', // Set background color based on item.client
    };
  };
  const styless = StyleSheet.create({
    column1: {

      alignItems: 'center',
       justifyContent: 'center',
    },
  });

  const renderSkeleton = () => {
   return (
     <SkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: 100, height: 100, backgroundColor: "#adadad", borderRadius: 10 }} />
            <View style={{ flex:1, marginLeft: 10 }}>
                <View style={{ backgroundColor: "#adadad", width: "50%", height: 10, marginBottom: 3, borderRadius: 5 }} />
                <View style={{ backgroundColor: "#adadad", width: '20%', height: 8, borderRadius: 5 }} />
                <View style={{ backgroundColor: "#adadad", width: '15%', height: 8, borderRadius: 5, marginTop: 3 }} />
            </View>
          </View>
      </SkeletonLoading>
   );
 };

 const renderSectionHeader = ({ section: { title } }) => (
    loading ? (
      <SkeletonLoading>
        <View style={{ width: 150, height: 20, borderRadius: 4, marginBottom: 10 }} />
      </SkeletonLoading>
    ) : (
      <Text style={{ fontWeight: 'bold', paddingVertical: 10 }}>{title}</Text>
    )
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>

      <View style={{  backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <Text style={styles.Selecttext}>Historique</Text>
      </View>
        <Layout style={styles.layout}>
          <Divider style={styles.divider2} />
          <View style={styles.row}>
          <TextInput
          style={styles.searchInput}
          placeholder="Chercher une transaction..."
         value={searchQuery}
         onChangeText={(query) => {
            setSearchQuery(query);
            searchInvoices(query); // Call the search function with the updated query
         }}
          />
          </View>

            <Divider style={styles.divider2} />

            <Text style={styles.result}>Filtres</Text>
          <Divider style={styles.divider2} />

      <View style={styles.row}>
     <FlatList
       data={filterOptions}
       horizontal
       showsHorizontalScrollIndicator={false}
       keyExtractor={(item) => item.label}
       renderItem={({ item }) => {
         const isActive = activeFilter === item.label; // Check if the filter is active
         return (
           <TouchableOpacity
   style={[
     styles.filterButton,
     isActive ?
       {
         ...styles.activeButton,
         backgroundColor: isPaid === 1
           ? '#3682B3'  // Blue for paid (1)
           : isPaid === 0
           ? '#D15D5D'  // Red for unpaid (0)
           : isPaid === 2
           ? '#4CAF50'  // Green for remboursements (2)
           : '#3682B3'  // Default blue if isPaid is null or undefined
       }
       : styles.inactiveButton, // Apply inactive style if not active
   ]}
   onPress={() => toggleFilter(item)}
 >
             <Text
               style={[
                 styles.buttonText,
                 isActive ? styles.activeText : styles.inactiveText, // Apply conditional text color
               ]}
             >
               {item.label}
             </Text>
           </TouchableOpacity>
         );
       }}
     />
      </View>


   <Divider style={styles.divider2} />
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.column10, isPaid === 1 ? styles.activePaymentButton : styles.inactivePaymentButton]}
          onPress={() => togglePaymentFilter(1)}
        >
          <Text style={[styles.buttonText,  isPaid === 1 ? styles.activePaymentButtonText : styles.inactivePaymentButtonText]}>Payées</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.column10, isPaid === 0 ? styles.activePaymentButtonRed : styles.inactivePaymentButtonText]}
          onPress={() => togglePaymentFilter(0)}
        >
          <Text style={[styles.buttonText,  isPaid === 0 ? styles.activePaymentButtonText : styles.inactivePaymentButtonText]}>Impayées</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.column10, isPaid === 2 ? styles.activePaymentButtonGreen : styles.inactivePaymentButtonText]}
          onPress={() => togglePaymentFilter(2)}
        >
          <Text style={[styles.buttonText,  isPaid === 2 ? styles.activePaymentButtonText : styles.inactivePaymentButtonText]}>Rembourssement</Text>
        </TouchableOpacity>
      </View>

            <Divider style={styles.divider2} />

            <Text style={styles.result}>Résultat trouvé: ({getLengthItem()})</Text>
          <Divider style={styles.divider2} />


          <SectionList
       style={styles.list}
       sections={loading ? sectionSkeletons : sections}
       keyExtractor={(item, index) => item.id.toString()}
       renderItem={loading ? renderSkeleton : renderItem}
       renderSectionHeader={({ section: { title } }) => (
         <Text style={{ fontWeight: 'bold', fontSize: width * 0.03, color: '#666', padding: 5 }}>
           {moment(title, 'YYYY-MM-DD').isSame(moment(), 'day')
             ? 'Today'
             : moment(title, 'YYYY-MM-DD').isSame(moment().subtract(1, 'days'), 'day')
             ? 'Yesterday'
             : moment(title, 'YYYY-MM-DD').format('dddd D MMMM')}
         </Text>
       )}
       ItemSeparatorComponent={ItemSeparator}
       showsVerticalScrollIndicator={false}
       refreshControl={
         <RefreshControl
           refreshing={refreshing}
           onRefresh={onRefresh}
           colors={['#0000ff']}
         />
       }
     />




   {isPaid === 2 && (
     <View style={{ justifyContent: 'center', alignItems: 'center' }}>
       {/* Floating Action Button */}
       <TouchableOpacity
         style={styles.fab}
         onPress={() => {
           navigation.navigate("ReceiveHistoryScreen");
         }}
       >
         <Ionicons name="receipt" size={24} color="white" />
       </TouchableOpacity>
     </View>
   )}


        </Layout>


    </ApplicationProvider>
  );
}

// Styles with responsive design
const styles = StyleSheet.create({
  result: {
    fontSize: width * 0.03,
    color: '#666',
        fontWeight: 'bold',
  },
  fab: {
     position: 'absolute',
     bottom: 70,
     right: 20,
     backgroundColor: '#4CAF50',
     width: 56,
     height: 56,
     borderRadius: 28,
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 5,
   },
  activePaymentButton: { backgroundColor: '#3682B3' },
    activePaymentButtonRed: { backgroundColor: '#D15D5D' },
      activePaymentButtonGreen: { backgroundColor: '#4CAF50' },

 inactivePaymentButton: { backgroundColor: '#F6F6F6' },
 activePaymentButtonText: { color: '#fff' },
inactivePaymentButtonText: { color: '#666' },
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
  badge2: {
    padding: width * 0.01,
    fontSize : width * 0.03,
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
    color:'#333',
    paddingHorizontal:15,
  },
  container: {
    flex: 1,
    backgroundColor: '#3682B3',
    position:'relative',
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
    minWidth:width * 0.15,
    justifyContent:'center',
    alignItems:'center',
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
    borderWidth : width * 0.003,
    borderColor : '#666',
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  column2: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'cnter',
       justifyContent: 'center',
  },

  column3: {
      flex: 0.25,
  padding: 10,
    alignItems: 'center',
     justifyContent: 'center',
  },

  column10: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: width * 0.003,  // Set border width for left
    borderTopWidth: width * 0.003,   // Set border width for top
    borderBottomWidth: width * 0.003, // Set border width for bottom
    borderRightWidth: width * 0.003,  // Set border width for left
    borderRadius:width * 0.02,
    borderColor: '#666',             // Set border color for all sides
    marginRight: width * 0.01,
    paddingVertical: 10,

  },
  column11: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: width * 0.003,  // Set border width for left
    borderRightWidth: width * 0.003,  // Set border width for left
    borderTopWidth: width * 0.003,   // Set border width for top
    borderBottomWidth: width * 0.003, // Set border width for bottom
    borderColor: '#666',             // Set border color for all sides
    borderRadius:width * 0.02,
    paddingVertical: 10,
  },

  column4: {
    flex: 0.3,
    paddingHorizontal: 10,
  },

  column6: {
    flex: 0.8,
  },

  column7: {
    flex: 0.2,
  },
  date: {
    fontSize: width * 0.03,
    color: '#666',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  price: {
    fontSize: width * 0.04,
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
    marginBottom:width * 0.17,
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
