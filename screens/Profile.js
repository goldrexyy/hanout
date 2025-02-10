// App.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Image, Dimensions, FlatList, TouchableOpacity, TextInput  } from 'react-native';
import {
  ApplicationProvider,
  Layout,
  Text,
  Card,
  Divider,
  Icon,
} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

const timelineData = {
  invoices: [
  ],

  remboursements: [
  ]
};

const { width, height } = Dimensions.get('window');


const testClient = {
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  name: 'John Doe',
  totalPaid: 5000,
  totalUnpaid: 1500,
    invoices: [
      { id: 'INV-001', total: 1000, status: 'Paid' },
      { id: 'INV-002', total: 1500, status: 'Unpaid' },
      { id: 'INV-003', total: 2000, status: 'Paid' },
      { id: 'INV-004', total: 500, status: 'Unpaid' },
      { id: 'INV-001', total: 1000, status: 'Paid' },
      { id: 'INV-002', total: 1500, status: 'Unpaid' },
      { id: 'INV-003', total: 2000, status: 'Paid' },
      { id: 'INV-004', total: 500, status: 'Unpaid' },
      { id: 'INV-001', total: 1000, status: 'Paid' },
      { id: 'INV-002', total: 1500, status: 'Unpaid' },
      { id: 'INV-003', total: 2000, status: 'Paid' },
      { id: 'INV-004', total: 500, status: 'Unpaid' },
      { id: 'INV-001', total: 1000, status: 'Paid' },
      { id: 'INV-002', total: 1500, status: 'Unpaid' },
      { id: 'INV-003', total: 2000, status: 'Paid' },
      { id: 'INV-004', total: 500, status: 'Unpaid' },
    ],
  revenueData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [1000, 1500, 2000, 1800, 2200, 2500],
      },
    ],
  },
  kpis: [
    { title: 'Lifetime Value', value: '$10,000' },
    { title: 'Average Order', value: '$500' },
  ],
};





const Profile = ({ navigation, route }) => {


  const bottomSheetRef = useRef(null);
  const [isBottomOpened, setIsBottomOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(allTimelineData);  // State for filtered data
  const [query, setQuery] = useState('');  // State for the search query
  const [invoices, setInvoices] = useState([]);
  const [remboursements , setRemboursements] = useState([]);
  const db = useSQLiteContext();
  // useFocusEffect to load the data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      LoadProducts(); // Call LoadProducts when screen is focused
      LoadRembourssements();
    }, []) // Dependencies can include navigation or route params if needed
  );

  const LoadProducts = async () => {


    const  userid = client.userid;
    const  clientid = client.id;

         try {
           const result = await db.getAllAsync(
          `SELECT * FROM factures WHERE deleted = 0 AND userid = ? AND clientid = ?`,
          [userid, clientid] // Use the actual user ID variable as needed
          );
           setInvoices(result);

         } catch (error) {
           console.log('Error loading products:', error);
         }
  };
  const LoadRembourssements = async () => {


    const  userid = client.userid;
    const  clientid = client.id;

         try {
           const result = await db.getAllAsync(
          `SELECT * FROM remboursements WHERE deleted = 0 AND userid = ? AND clientid = ?`,
          [userid, clientid] // Use the actual user ID variable as needed
          );
           setRemboursements(result);

         } catch (error) {
           console.log('Error loading products:', error);
         }
  };
  const oneMonthAgo = moment().subtract(1, 'months'); // Get the 0 1 month ago

  const overdueInvoices = invoices.filter(invoice => {
    const invoiceDate = moment(invoice.dueDate); // Parse `dueDate` using moment
    return invoiceDate.isBefore(oneMonthAgo); // Check if `dueDate` is older than 1 month
  });



  //Open
  const openBottomSheet = () => {
  setIsBottomOpened(true);
  bottomSheetRef.current?.snapToIndex(0); // Open bottom sheet to 60%
};

const closeBottomSheet = () => {
  setIsBottomOpened(false);
  bottomSheetRef.current?.close(); // Close bottom sheet
};

  const handleChange = () => {
       setIsBottomOpened(true);
       closeBottomSheet();
    //      setShowCards(false); // Reset menu (or hide cards) when focused
  };

    const renderBackdrop = useCallback(
      (props) => (
        isBottomOpened && ( // Only render the backdrop if the bottom sheet is open
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1} // Ensure the backdrop disappears when sheet is closed
            appearsOnIndex={0} // Ensure the backdrop appears when the sheet is open
            opacity={0.8} // Customize opacity to make it darker
          />
        )
      ),
      [isBottomOpened] // Add isBottomOpened to the dependencies
    );
    // Combine and sort the data
    const allTimelineData = [
      ...invoices.map(item => ({ ...item, side: 'left' })),
      ...remboursements.map(item => ({ ...item, side: 'right' })),
    ];

    // Sort the data by date and time (newest to oldest)
    allTimelineData.sort((a, b) => {
      const dateA = moment(`${a.dueDate} ${a.dueTime}`, 'DD/MM/YYYY HH:mm');
      const dateB = moment(`${b.dueDate} ${b.dueTime}`, 'DD/MM/YYYY HH:mm');
      return dateB.diff(dateA); // Use diff for clarity and accuracy
    });


  // Function to handle search and filter
    const searchInvoices = (query) => {
      const lowerCaseQuery = query.toLowerCase();

      const filtered = allTimelineData.filter(invoice => {
        const matchesId = invoice.id && invoice.id.includes(lowerCaseQuery);
        const matchesTotal = invoice.total && invoice.total.includes(lowerCaseQuery);
        return matchesId || matchesTotal;
      });

      setFilteredData(filtered); // Update the filtered data state
    };

    // Handle search input change
  const handleSearchChange = (text) => {
    setQuery(text);  // Update the query state
    searchInvoices(text);  // Perform filtering
  };

  // Function to generate the chart data
  const generateChartData = (timelineData) => {
    // Combine all the dates from invoices and remboursements
    const allDates = [
      ...invoices.map(item => moment(item.dueDate, 'DD/MM/YYYY')),
      ...remboursements.map(item => moment(item.date, 'DD/MM/YYYY')),
    ];

    // Find the oldest date and set endDate to today
    const endDate = moment(); // Today's date
    const startDate = moment().subtract(7, 'days'); // Start date - last 7 days

    const labels = [];
    const data = [];

    let currentMoment = startDate.clone();
    let cumulativeDette = 0; // Running total of the dette

    // Generate labels for the last 7 days and compute balance for each day
    while (currentMoment.isBefore(endDate) || currentMoment.isSame(endDate, 'day')) {
      labels.push(currentMoment.format('DD/MM')); // Label by date

      // Calculate total invoiced for the current date
      let totalInvoiced = invoices
        .filter(invoice => moment(invoice.dueDate, 'DD/MM/YYYY').isSame(currentMoment, 'day'))
        .reduce((sum, invoice) => sum + invoice.total, 0);

      // Calculate total remboursements for the current date
      let totalRemboursed = remboursements
        .filter(remboursement => moment(remboursement.dueDate, 'DD/MM/YYYY').isSame(currentMoment, 'day'))
        .reduce((sum, remboursement) => sum + remboursement.total, 0);

      // Update cumulative dette: (cumulative dette) + (invoices for the day) - (remboursements for the day)
      cumulativeDette += totalInvoiced - totalRemboursed;
      data.push(cumulativeDette); // Store the current balance

      // Move to the next day
      currentMoment.add(1, 'day');
    }

    // Return the chart data with X-axis starting from 0
    return {
      labels: labels,
      datasets: [
        {
          data: data,
             color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White line color
          strokeWidth: 0, // Optional: Change the line stroke width
        },
      ],
    };
  };


  // Dynamically generate the chart data (this should be done in your component logic)
  const chartData = generateChartData(timelineData); // Assuming this comes from the function I provided

  const TimelineItem = ({ item, side }) => {
    return (
      <TouchableOpacity
    onPress={() => {
      if (side === "left") {
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
      } else if (side === "right") {
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

      <View style={[styless.timelineRow, side === 'right' ? styless.itemRight : styless.itemLeft]}>
        <View style={[styless.cardContent, side === 'right' ? styless.contentRight : styless.contentLeft]}>
        <View style={[styles.column11, { backgroundColor: side === 'right' ? '#4CAF50' : '#D15D5D' }]}>
            <Ionicons name="document-text" size={width * 0.06} color='white' style={styless.icon} />
          </View>
          <View style={styless.column2}>
           <Text style={styless.date} >{item.dueDate} - {item.dueTime}</Text>
           <Text style={styless.description} numberOfLines={3}>Invoice {item.idunique} with amount {item.total} Dh added</Text>
          </View>
        </View>
        <View style={styless.circle} />
         <View style={styless.line} />
      </View>
    </TouchableOpacity>
    );
  };
    const {client} = route.params;
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <ScrollView
            showsVerticalScrollIndicator = {false}
        >
          {/* Card 1: Client Information */}

      <View style={styles.header}>

          <View style={{height:width*0.7,justifyContent:'center', alignItems:'center'}}>
              <Text style={styles.Selecttext22} numberOfLines={1} adjustsFontSizeToFit={true}>{client.name}</Text>
              <Text style={styles.Selecttext21} numberOfLines={1} adjustsFontSizeToFit={true}>{client.description}</Text>
              <Text style={styles.Selecttext21} numberOfLines={1} adjustsFontSizeToFit={true}>ID : {client.idunique}</Text>
              <Text style={styles.Selecttext21} numberOfLines={1} adjustsFontSizeToFit={true}>Ajouté le : {client.dueDate}</Text>
          </View>
      </View>

          <View style={styles.card} >
            <View style={styles.clientInfoRow}>

              {/* Column 3: Total Paid */}
              <View style={styles.clientInfoColumn2}>
            <TouchableOpacity  style={styles.contact}  >
               <Ionicons name="call-outline" size={width * 0.07} color="#3682B3"/>
                <Text style={styles.Selecttext10}>Appeler le client</Text>
            </TouchableOpacity>
              </View>
              {/* Column 4: Total Unpaid */}
              <View style={styles.clientInfoColumn2}>
                <TouchableOpacity  style={styles.contact}  >
              <Ionicons name="logo-whatsapp" size={width * 0.07} color="#3682B3"/>
               <Text style={styles.Selecttext10}>Contacter le client</Text>
               </TouchableOpacity>
              </View>
            </View>
            <View style={styles.clientInfoRow}>
            </View>
          </View>

          <View style={styles.card} >
            <View style={styles.clientInfoRow}>

              {/* Column 3: Total Paid */}
              <View style={styles.clientInfoColumn}>
              <TouchableOpacity    onPress={() => openBottomSheet()}  >
               <Ionicons name="wallet-outline" size={width * 0.15} color="green"/>
                <Text style={styles.Selecttext}>Solde</Text>
                <Text style={styles.Selecttext7}>Equilibre entre le total des factures impayées et le total des remboursements</Text>
                <Text style={styles.Selecttext6}>{client.nbrpaid - client.nbrunpaid} Dh</Text>
              </TouchableOpacity>
              </View>
              {/* Column 4: Total Unpaid */}
              <View style={styles.clientInfoColumn}>
              <Ionicons name="sad-outline" size={width * 0.15} color="#D15D5D"/>
               <Text style={styles.Selecttext}>Dette</Text>
               <Text style={styles.Selecttext7}>Indicateur en pourcentage de la dette non payée sur la totalité des impayées.</Text>
               <Text style={styles.Selecttext6}> {client.nbrunpaid === 0    ? '0%'  : `${((client.nbrpaid / client.nbrunpaid)*100).toFixed(0)}%`}</Text>

              </View>
            </View>
            <View style={styles.clientInfoRow}>

              {/* Column 3: Total Paid */}
              <View style={styles.clientInfoColumn}>
              <Ionicons name="receipt-outline" size={width * 0.15} color="#D15D5D"/>
               <Text style={styles.Selecttext}>Impayées</Text>
               <Text style={styles.Selecttext7}>Indique le nombre de factures impayées chez le client.</Text>
               <Text style={styles.Selecttext6}>{invoices.length}</Text>
              </View>
              {/* Column 4: Total Unpaid */}
              <View style={styles.clientInfoColumn}>
              <Ionicons name="alert-circle-outline" size={width * 0.15} color="orange"/>
               <Text style={styles.Selecttext}>Alertes</Text>
               <Text style={styles.Selecttext7}>Nombre de factures impayées ayant dépassé l'échance de  30 jours</Text>
               <Text style={styles.Selecttext6}>  {overdueInvoices.length}</Text>
              </View>
            </View>
          </View>


          <View style={styles.card} >
          <View style={styles.title}>
                <Text style={styles.Selecttext}>Historique</Text>
          </View>
          <View style={styless.contentContainer} >
            <TextInput
            style={styless.searchInput}
            placeholder="Search..."
            value={searchQuery}
             onChangeText={handleSearchChange}
            />
          </View>
          <View style={styles.clientInfoRow2}>
            {/* Column 3: Total Paid */}
            <View style={styles.clientInfoColumn3}>
             <Text style={styless.Selecttext2}>Factures</Text>
            </View>
            {/* Column 4: Total Unpaid */}
            <View style={styles.clientInfoColumn4}>
             <Text style={styless.Selecttext2}>Remboursements</Text>
             <TouchableOpacity
           onPress={() => {
             // Navigate to the "Receive" screen and pass the default client data
             navigation.navigate("ReceiveHistoryScreen", {
               onSelectClient: {
                 id: client.id, // Default client ID
                 name: client.name, // Default client name
                 idunique: client.idunique, // Unique ID
                 nbrpaid: client.nbrpaid,
                 nbrunpaid : client.nbrunpaid,
               },
             });
           }}
         >
                <Text style={styless.Selecttext14}>Ajouter rembourssement</Text>
                </TouchableOpacity>
            </View>
          </View>
            <View style={styles.clientInfoRow}>
              {/* Column 3: Total Paid */}

              <FlatList
     data={allTimelineData}
     keyExtractor={(item) => item.id}
     renderItem={({ item }) => <TimelineItem item={item} side={item.side} />}
     ItemSeparatorComponent={() => <Divider />}
     style={styless.container}
   />

            </View>
          </View>


          {/* Card 3: Revenue Line Chart */}
          <View style={styles.card} >
          <View style={styles.title}>
                <Text style={styles.Selecttext}>Evolution des dettes </Text>
          </View>
            <Divider />
            <View style={styles.graphContainer}>
            <LineChart
  data={chartData} // Use the dynamically generated chart data here
  width={width} // Adjusted for padding
  height={220}
  chartConfig={{
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    fillShadowGradient: '#D15D5D',
    fillShadowGradientOpacity: 1,
    fillShadowGradientFrom: '#D15D5D',
    fillShadowGradientTo: '#D15D5D',
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#D15D5D',
      fill:'#D15D5D',
    },
  }}
  style={styles.chart}
  bezier
/>
            </View>
          </View>

        </ScrollView>
        <BottomSheet
     ref={bottomSheetRef}
     index={-1} // Starts closed
     snapPoints={['40%']}
     enableContentPanningGesture={true}
     enableHandlePanningGesture={true}
     backgroundStyle={styless.backgroundcontainer}
     style={styless.bottomsheetcontainer}
     handleStyle={styless.handlebottomsheet}
     enablePanDownToClose={true} // Allow closing by dragging down
     backdropComponent={renderBackdrop}
     onChange={(index) => {
       // Handle state when the bottom sheet is fully closed
       if (index === -1) setIsBottomOpened(false);
     }}
   >

  <BottomSheetView >
  <View  >
  <View style={styles.titlesheet}>
        <Text style={styles.Selecttext}>Détail du solde </Text>
  </View>
    <View style={styles.clientInfoRow}>
      {/* Column 3: Total Paid */}
      <View style={styles.clientInfoColumn}>
       <Ionicons name="arrow-up" size={width * 0.15} color="green"/>
        <Text style={styles.Selecttext}>Remboursé</Text>
        <Text style={styles.Selecttext7}>Total des montants remboursés par le client</Text>
        <Text style={styles.Selecttext6}>{client.nbrpaid} Dh</Text>
      </View>
      {/* Column 4: Total Unpaid */}
      <View style={styles.clientInfoColumn}>
      <Ionicons name="arrow-down" size={width * 0.15} color="#D15D5D"/>
       <Text style={styles.Selecttext}>Dette</Text>
       <Text style={styles.Selecttext7}>Total de la dette du client depuis ses impayées.</Text>
       <Text style={styles.Selecttext6}>{client.nbrunpaid} Dh</Text>
      </View>
    </View>
  </View>
  </BottomSheetView>

    {/* Bottom Sheet Content */}
  </BottomSheet>
      </SafeAreaView>
    </ApplicationProvider>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,

  },

  Selecttext14:{
    fontSize: width * 0.03,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  searchInput: {
    flex: 1,
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#666',
    marginRight:width * 0.01,
    padding: 5,
    paddingLeft: 15,
    backgroundColor: '#fff',
    fontSize: width * 0.03,
  },
  contentContainer:{
    flex:1,
    paddingTop:10,
    paddingHorizontal:10,

  },
  cardContent: {
    flexDirection: 'row',
  },
  column1: {

    alignItems: 'center',
     justifyContent: 'center',
    backgroundColor:'#D15D5D',
    flex:0.4,
    borderRadius:3,
  },
  column2: {
    flex: 1,
    paddingLeft: 3,
    alignItems: 'left',
       justifyContent: 'center',
  },
  icon:{
    padding:2,
  },
  date: {
    fontSize: width * 0.025,
    color: '#333',
    fontWeight: 'bold',

  },
  description: {
    fontSize: width * 0.025,
    color: '#666',

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
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    position: 'relative', // Ensure position is relative for absolute children
  },
  contentLeft: {

    paddingRight: 10,
    flex: 1,
    maxWidth: '45%', // Limit the width
    marginRight: 'auto', // Push to the left
  },
  contentRight: {

    paddingLeft: 10,
    flex: 1,
    maxWidth: '45%', // Limit the width
    marginLeft: 'auto', // Push to the right
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3682B3',
    position: 'absolute', // Center the circle
    left: '50%', // Center horizontally
    transform: [{ translateX: -6 }], // Adjust for half the width of the circle
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    width: 2, // Width of the line
    backgroundColor: '#3682B3', // Line color
    left: '50%', // Center the line
    top: 0, // Start from the top
    bottom: 0, // Extend to the bottom
    transform: [{ translateX: -1 }], // Adjust for half the width of the line
    zIndex: 0,
  },
   itemLeft: {

     flexDirection: 'row-reverse',  // Reverses the row direction for left side
   },
   itemRight: {
     flexDirection: 'row',
   },
   dateText: {
     fontWeight: 'bold',
     fontSize: 14,

   },
   detailsText: {
     fontSize: width*0.025,
     color: 'gray',
   },
});

const styles = StyleSheet.create({
  header:{
  backgroundColor:'#3682B3',
  borderBottomLeftRadius: width * 0.04,
  borderBottomRightRadius: width * 0.04,
  elevation: 1,
  borderColor:'transparent',
  marginBottom:10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  divider: {
  height:20,
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
   paddingVertical:10,
  },
  column1: {
    height: 90, // Fixed width for the first column
    alignItems: 'center',
     justifyContent: 'center',
    backgroundColor:'#3682B3',
    flex:0.36,
  },
  column11: {
    height: 50, // Fixed width for the first column
    alignItems: 'center',
     justifyContent: 'center',
    backgroundColor:'#3682B3',
    flex:0.36,
  },
  column2: {
    flex: 1,
    paddingLeft: 30,
    alignItems: 'left',
   justifyContent: 'center',
   backgroundColor:'#fff',
 },
  title: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'left',
    justifyContent: 'center',
  },

  titlesheet: {

    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  Selecttext10:{
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color:'#3682B3',

  },

  Selecttext8:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color:'#333',
    textTransform: 'uppercase',
  },
  Selecttext7:{
    fontSize: width * 0.025,
    color:'#666',

  },
  Selecttext6:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color:'#333',
  },

  Selecttext9:{
    fontSize: width * 0.03,
    color:'#333',
  },

  Selecttext:{
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color:'#333',

  },

  Selecttext4:{
    fontSize: width * 0.03,
    width: width / 3 - 20,
    textAlign: 'center',
    color: '#000000',
  },
  Selecttext5:{
    fontSize: width * 0.03,
    width: width / 3 - 20,
    textAlign: 'center',
    color: '#fff',
  },
  scrollableTable: {
    flex: 1,
    maxHeight: height * 0.37, // Constrain product list height
  },
  table: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    backgroundColor: '#F7F9FC',
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
  card: {
    marginBottom: 10,
  },
  clientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientInfoRow2: {
    flexDirection: 'row',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  clientInfoColumn: {
    flex: 1,
    alignItems: 'center',
    borderWidth:2,
    borderRadius:10,
    borderColor:'#f5f5f5',
    backgroundColor:'#f9f9f9',
    padding:20,
    margin:10,
  },
  clientInfoColumn2: {
    flex: 1,
    alignItems: 'center',
    borderWidth:2,
    borderRadius:10,
    borderColor:'transparent',
    paddingHorizontal:10,
    margin:10,
  },
  clientInfoColumn3: {
    flex:1,
    alignItems: 'left',
    padding:10,
  },
  clientInfoColumn4: {
    alignItems: 'right',
    padding:10,
  },
  contact:{
      alignItems: 'center',
      justifyContent:'center',
  },
  sectionTitle: {
    marginBottom: 10,
    textAlign: 'left',
  },
  paid: {
    color: 'green',
    fontWeight: 'bold',
  },
  unpaid: {
    color: '#D15D5D',
    fontWeight: 'bold',
  },
  graphContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chart: {

  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  kpiCard: {
    flex: 0.48,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  kpiTitle: {
    marginTop: 10,
    marginBottom: 5,
  },

  Selecttext21:{
    fontSize: width * 0.035,
    color:'#fff',
    paddingHorizontal:15,
  },
  Selecttext22:{
    fontSize: width * 0.16,
    fontWeight: 'bold',
    color:'#fff',
    paddingHorizontal:15,
  },
});

export default Profile;
