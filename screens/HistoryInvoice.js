import React, { useState, useEffect, useRef, useCallback, useMemo  } from 'react';
import { FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator, SectionList, RefreshControl} from 'react-native';
import { ApplicationProvider , Layout, Card, Text, Button, Avatar, Divider, Modal } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import moment from 'moment';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetScrollView  } from '@gorhom/bottom-sheet';


import SkeletonLoading from 'expo-skeleton-loading';
import Filterdate from './history/Filterdate';
import Filtertype from './history/Filtertype';
import Filteraffichage from './history/Filteraffichage';
import Client from './ListClientsBottomhistory';


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');
const now = moment().local();  // Ensures you're using local time



const Clientt = React.memo(({ navigation, route}) => {


  // State variables
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [filteredInvoices, setFilteredInvoices] = useState(data);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tout'); // To track which filter is active
  const [activeResult, setActiveResult] = useState(0); // To track which filter is active
    const [activeClient, setActiveClient] = useState('Aucun'); // To track which filter is active
  const [isSortedAscending, setIsSortedAscending] = useState(false);
  const db = useSQLiteContext();
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPaidFilter, setIsPaidFilter] = useState(null);  // null = no filter, true = paid, false = unpaid
  const [isRefundFilter, setIsRefundFilter] = useState(false); // false = no filter, true = refund
  const [recentFilter, setRecentFilter] = useState(false); // Default to showing all invoices


  const [isPaid, setIsPaid] = useState(1); // null = both, 1 = paid, 0 = unpaid
  const [Affichage, setAffichage] = useState(1); // null = both, 1 = paid, 0 = unpaid

  const [dateFilter, setDateFilter] = useState('Tout');
  const [startDate, setStartDate] = useState(null);
  const [filterClient, setfilterClient] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Track pagination

  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points
  const bottomSheetModalFirstRef = useRef(null);

  const [selectedComponent, setSelectedComponent] = useState(null); // Track modal content


  useFocusEffect(
    useCallback(() => {
      // Check if there is an active filter
      if (activeFilter) {
        setLoading(true); // Show loading indicator

        // Run both functions concurrently using Promise.all
        const fetchData = fetchAndCombineData(1); // Fetch data for the first page
        const totalCalculation = calculateTotalInvoices(); // Calculate total invoices

        // Wait for both functions to complete
        Promise.all([fetchData, totalCalculation])
          .then(() => {
            // Handle any success actions here, if necessary
          })
          .catch((error) => {
            // Handle any errors from either function here
            console.error('Error in fetching data or calculating total invoices:', error);
          })
          .finally(() => {
            setLoading(false); // Hide loading indicator after both functions are complete
          });
      }

      // Optional cleanup if needed when leaving the screen
      return () => {
        setLoading(false); // Reset loading state when leaving the screen
      };
    }, [activeFilter, startDate, endDate, isPaid, filterClient]) // Add all dependencies here
  );




  const BottomSheetContent = React.memo(({}) => {
    // Use a callback to render the content based on the selectedClient
    console.log('lah');
    const renderContent = useCallback(() => {
      const memoizedSelectedClient = useMemo(() => {
        return selectedClient; // or create a shallow copy if needed
      }, []); // Replace with actual dependencies

      const memoizedEndDate = useMemo(() => {
        return enddate; // or create a shallow copy if needed
      }, []); // Replace with actual dependencies

      const memoizedStartDate = useMemo(() => {
        return startdate; // or create a shallow copy if needed
      }, []); // Replace with actual dependencies

      const memoizedFilter = useMemo(() => {
        return filter; // or create a shallow copy if needed
      }, []); // Replace with actual dependencies

      const memoizedFiltertype = useMemo(() => {
        return filtertype; // or create a shallow copy if needed
      }, []); // Replace with actual dependencies

      const memoizedFilteraffichage = useMemo(() => {
        return filteraffichage; // or create a shallow copy if needed
      }, []); // Replace with actual dependencies

      switch (selectedComponent) {
        case 'Filterdate':
          return <Filterdate filter={memoizedFilter} startdate={memoizedStartDate} enddate={memoizedEndDate} />;
        case 'Filtertype':
          return <Filtertype filter={memoizedFiltertype} />;
          case 'Filteraffichage':
            return <Filteraffichage filter={memoizedFilteraffichage} />;
        case 'Filterclient':
            return   <Client   isPressed={true} selectedClient={memoizedSelectedClient} />;
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
    setSelectedComponent(component);
    console.log('Selected component:', component);

    // Adjust snap point based on component type
    switch (component) {
      case 'Filterdate':
        setSnapPoint(['67%']);
        break;
      case 'Filtertype':
        setSnapPoint(['40%']);
        break;
      case 'Filteraffichage':
          setSnapPoint(['45%']);
          break;
      case 'Filterclient':
        setSnapPoint(['80%']);
        break;
      default:
        setSnapPoint(['40%']);
        break;
    }

    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.present();
  }, [setSnapPoint]); // Add dependencies if needed


  // callbacks
  const handlePresentModalFirstClose = useCallback(() => {
    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.close();
  }, []);
  const filter = (filter) => {

    setActiveFilter(filter);

    handlePresentModalFirstClose();
  };
  const startdate = (filter) => {
    setStartDate(filter);
    console.log('start', filter);
  };
  const enddate = (filter) => {
    setEndDate(filter);
    console.log('end', filter);
  };
  const reload = () => {
    startdate(null);
    enddate(null);
    setActiveFilter('Tout');
    setfilterClient(null);
    setActiveClient('Aucun');
    setAffichage(1);

  };


  const filtertype = (filter) => {
    setIsPaid(filter);
    handlePresentModalFirstClose();
  };

  const filteraffichage = (filter) => {
    setAffichage(filter);
    handlePresentModalFirstClose();
  };

  const selectedClient = (item) => {

       if(item !== null){
         setfilterClient(item.id);
         setActiveClient(item.name);
       } else {
         setfilterClient(null);
         setActiveClient('Aucun');
       }
       handlePresentModalFirstClose();
     };
  const viewDetail = (item) => {
          if(item ){
            setAffichage(1);
            startdate(item.invoices[0].dueDate);
            enddate(item.invoices[0].dueDate);
            filter('custom');
          }
        };
  const viewDetailMonth = (item) => {
          console.log('detail item month', item);
                if(item ){
                  setAffichage(1);
                  const rawDueDate = item.invoices[0].dueDate; // Example: "31/10/2024"

    const [day, month, year] = rawDueDate.split('/'); // Split the string
    const dueDate = new Date(`${year}-${month}-${day}`); // Reformat to YYYY-MM-DD

    // Get the first day of the month
    const startOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1);

    // Get the last day of the month
    const endOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0);

    startdate(startOfMonth);
    enddate(endOfMonth);


                  filter('custom');
                }
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

  const fetchAndCombineData = async (page = 1) => {
        try {
          const limit = 200;
          const offset = (page - 1) * limit;

          let query = `SELECT * FROM factures WHERE deleted = 0 AND paid = ?`;
          let params = [isPaid];

          // Add the clientid filter only if filterClient is not null
          if (filterClient !== null) {
           query += ` AND clientid = ?`;
           params.push(filterClient);
          }

           query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
          let invoices = await db.getAllAsync(query, params);


          // Apply filtering based on activeFilter
          if (activeFilter === 'recent') {
            const recentCutoff = moment().subtract(60, 'minutes'); // Last 60 minutes
            invoices = invoices.filter(invoice => {
              // Combine dueDate and dueTime
              const combinedDateTime = `${invoice.dueDate} ${invoice.dueTime}`;

              // Parse the combined date and time
              const parsedDate = formatDateAndTime(combinedDateTime);

              if (!parsedDate.isValid()) {
                console.error('Invalid date:', combinedDateTime); // Debugging invalid dates
                return false; // Skip invalid dates
              }

              // Check if the date is within the last 60 minutes AND if it is today
              const isRecent = parsedDate.isAfter(recentCutoff);
              const isToday = parsedDate.isSame(moment(), 'day');

              // Return true if both conditions are met
              return isRecent && isToday;
            });
          } else if (activeFilter === 'today') {
            const todayStart = moment().startOf('day');
            const todayEnd = moment().endOf('day');
            invoices = invoices.filter(invoice => {
              const combinedDateTime = `${invoice.dueDate} ${invoice.dueTime}`;
              const parsedDate = formatDateAndTime(combinedDateTime);
              return parsedDate.isBetween(todayStart, todayEnd, null, '[]'); // Ensure it's between the start and end of today
            });
          } else if (activeFilter === 'yesterday') {
      const yesterdayStart = moment().subtract(1, 'days').startOf('day');
      const yesterdayEnd = moment().subtract(1, 'days').endOf('day');
      invoices = invoices.filter(invoice => {
        const combinedDateTime = `${invoice.dueDate} ${invoice.dueTime}`;
        const parsedDate = formatDateAndTime(combinedDateTime);
        return parsedDate.isBetween(yesterdayStart, yesterdayEnd, null, '[]'); // Ensure it's between the start and end of yesterday
      });
          } else if (activeFilter === 'thisweek') {
      const startOfWeek = moment().startOf('week'); // Start of the current week
      const endOfWeek = moment().endOf('week'); // End of the current week
      invoices = invoices.filter(invoice => {
        const combinedDateTime = `${invoice.dueDate} ${invoice.dueTime}`;
        const parsedDate = formatDateAndTime(combinedDateTime);
        return parsedDate.isBetween(startOfWeek, endOfWeek, null, '[]'); // Ensure it's between the start and end of this week
      });
          } else if (activeFilter === 'lastweek') {
      const startOfLastWeek = moment().subtract(1, 'week').startOf('week'); // Start of the previous week
      const endOfLastWeek = moment().subtract(1, 'week').endOf('week'); // End of the previous week
      invoices = invoices.filter(invoice => {
        const combinedDateTime = `${invoice.dueDate} ${invoice.dueTime}`;
        const parsedDate = formatDateAndTime(combinedDateTime);
        return parsedDate.isBetween(startOfLastWeek, endOfLastWeek, null, '[]'); // Ensure it's between the start and end of last week
      });
          }else if (activeFilter === 'custom' && startDate && endDate) {
  if (startDate && endDate) {
    // Parse the provided StartDate and EndDate into moment objects
    const parsedStartDate = moment(startDate, 'DD/MM/YYYY', true).startOf('day');
    const parsedEndDate = moment(endDate, 'DD/MM/YYYY', true).endOf('day');

    // Ensure the parsed dates are valid
    if (parsedStartDate.isValid() && parsedEndDate.isValid()) {
      invoices = invoices.filter(invoice => {
        // Ensure the combinedDateTime is parsed properly with the correct format
        const combinedDateTime = `${invoice.dueDate} ${invoice.dueTime}`; // Format: 'DD/MM/YYYY HH:mm'

        // Convert dueDate and dueTime into a moment object using the format 'DD/MM/YYYY HH:mm'
        const parsedInvoiceDate = moment(combinedDateTime, 'DD/MM/YYYY HH:mm', true);

        // Check if the parsed invoice date is valid and within the custom range
        if (parsedInvoiceDate.isValid()) {
          // To avoid issues with small date ranges, ensure the invoice falls within the range,
          // allowing for boundary inclusivity ('[]')
          return parsedInvoiceDate.isBetween(parsedStartDate, parsedEndDate, null, '[]');
        } else {
          console.error(`Invalid combined date-time for invoice: ${combinedDateTime}`);
          return false; // Exclude invalid dates
        }
      });
    } else {
      console.error('Invalid StartDate or EndDate provided for custom filter');
    }
  } else {
    console.error('StartDate and EndDate must be provided for custom filter');
  }
}

else if (activeFilter === 'Tout') {
            invoices = invoices.filter(invoice => {
              return invoices;
            });
          }

          const newData = invoices.map(item => ({ ...item, category: 'invoice' }));

          setData(prevData => {
            if (page === 1) {
              setFilteredInvoices(newData);
              return newData;
            } else {
              const combinedData = [...prevData, ...newData];
              const uniqueData = Array.from(new Map(combinedData.map(item => [item.id, item])).values());
              setFilteredInvoices(uniqueData);
              return uniqueData;
            }
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };
  const calculateTotalInvoices = async () => {
        try {
          let query = `SELECT SUM(total) as total FROM factures WHERE deleted = 0 AND paid = ?`;
          let params = [isPaid];

          // Add the clientid filter only if filterClient is not null
          if (filterClient !== null) {
           query += ` AND clientid = ?`;
           params.push(filterClient);
          }

          // Get the current date and time for comparison
          const now = moment().local();  // Ensures you're using local time

          // Apply activeFilter conditions
          if (activeFilter === 'recent') {
    const recentCutoff = now.subtract(60, 'minutes');
    query += ` AND strftime('%Y-%m-%d %H:%M:%S', substr(dueDate, 7, 4) || '-' || substr(dueDate, 4, 2) || '-' || substr(dueDate, 1, 2) || ' ' || COALESCE(dueTime, '00:00:00')) >= ?`;
    params.push(recentCutoff.format('YYYY-MM-DD HH:mm:ss'));
  } else if (activeFilter === 'today') {
  const todayStart = now.startOf('day').format('YYYY-MM-DD 00:00:00');
  const todayEnd = now.endOf('day').format('YYYY-MM-DD 23:59:59');
  query += ` AND datetime(substr(dueDate, 7, 4) || '-' || substr(dueDate, 4, 2) || '-' || substr(dueDate, 1, 2) || ' ' || dueTime) BETWEEN ? AND ?`;
  params.push(todayStart, todayEnd);
  console.log('Yesterday Start:', todayStart);
console.log('Yesterday End:', todayEnd);
} else if (activeFilter === 'yesterday') {
  // Calculate yesterday's date, adjusting to start at 01:00:00 and end at 23:59:59
  const yesterdayStart = now.subtract(1, 'days').set({ hour: 1, minute: 0, second: 0 }).format('YYYY-MM-DD HH:mm:ss');
  const yesterdayEnd = now.subtract( 'days').set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD HH:mm:ss');

  // Log the calculated start and end times for debugging
  console.log('Yesterday Start:', yesterdayStart);  // Expected: 2024-11-16 01:00:00
  console.log('Yesterday End:', yesterdayEnd);      // Expected: 2024-11-16 23:59:59

  // Modify the query to ensure dueDate is not null or empty, and handle proper formatting
  query += `
    AND datetime(
      substr(dueDate, 7, 4) || '-' || substr(dueDate, 4, 2) || '-' || substr(dueDate, 1, 2) || ' ' || dueTime
    ) BETWEEN ? AND ?
    AND (dueDate IS NOT NULL AND dueDate != '')
  `;

  // Push the formatted start and end times as parameters for the query
  params.push(yesterdayStart, yesterdayEnd);

  // Additional check to ensure that dueDate values are correctly formatted
  const formattedStart = new Date(yesterdayStart).toISOString();
  const formattedEnd = new Date(yesterdayEnd).toISOString();
  console.log('Formatted Start:', formattedStart);  // Ensure it's the correct start
  console.log('Formatted End:', formattedEnd);      // Ensure it's the correct end
}



 else if  (activeFilter === 'thisweek') {
  const startOfWeek = now.startOf('week').format('YYYY-MM-DD 00:00:00');
  const endOfWeek = now.endOf('week').format('YYYY-MM-DD 23:59:59');
  query += ` AND datetime(substr(dueDate, 7, 4) || '-' || substr(dueDate, 4, 2) || '-' || substr(dueDate, 1, 2) || ' ' || dueTime) BETWEEN ? AND ?`;
  params.push(startOfWeek, endOfWeek);
} else if (activeFilter === 'lastweek') {
  const startOfLastWeek = now.subtract(1, 'week').startOf('week').format('YYYY-MM-DD 00:00:00');
  const endOfLastWeek = now.subtract( 'week').endOf('week').format('YYYY-MM-DD 23:59:59');
  query += ` AND datetime(substr(dueDate, 7, 4) || '-' || substr(dueDate, 4, 2) || '-' || substr(dueDate, 1, 2) || ' ' || dueTime) BETWEEN ? AND ?`;
  params.push(startOfLastWeek, endOfLastWeek);
} else if (activeFilter === 'custom' && startDate && endDate) {
            const parsedStartDate = moment(startDate, 'DD/MM/YYYY').startOf('day');
            const parsedEndDate = moment(endDate, 'DD/MM/YYYY').endOf('day');
            query += ` AND strftime('%Y-%m-%d %H:%M:%S', substr(dueDate, 7, 4) || '-' || substr(dueDate, 4, 2) || '-' || substr(dueDate, 1, 2) || ' ' || dueTime) BETWEEN ? AND ?`;
            params.push(parsedStartDate.format('YYYY-MM-DD HH:mm:ss'), parsedEndDate.format('YYYY-MM-DD HH:mm:ss'));
          }

          // Execute the query and get the result
          const result = await db.getAllAsync(query, params);

          // Accessing the sum from the result
          const totalInvoices = result.length > 0 ? result[0].total || 0 : 0; // Ensure the result array is non-empty and access the total

          setActiveResult(totalInvoices); // Set total to active result
        } catch (error) {
          console.error('Error calculating total invoices:', error);
        }
      };

  const formatDateAndTime = (dueDateTime) => {
        // Parse the combined date and time
        const parsedDate = moment(dueDateTime, 'DD/MM/YYYY HH:mm', true); // Strict parsing
        return parsedDate;
      };
  const searchInvoices = (query) => {
   const filtered = data.filter(invoice =>
     (invoice.idunique && invoice.idunique.toLowerCase().includes(query.toLowerCase())) ||
     (invoice.description && invoice.description.toLowerCase().includes(query.toLowerCase()))
   );
   setFilteredInvoices(filtered);
 };
  const onRefresh = async () => {
   setRefreshing(true);
   setCurrentPage(1); // Reset to page 1 for pagination
   await fetchAndCombineData(1); // Fetch only the first 10 items
   setRefreshing(false);
 };

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
  const getLengthItem = () => {
    return itemCount = filteredInvoices.length;
  };

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

  const isPastHour = (item) => {
  const [day, month, year] = item.dueDate.split('/'); // Split the date
  const [hours, minutes] = item.dueTime.split(':'); // Split the time
  const dueDateTime = new Date(year, month - 1, day, hours, minutes); // month is 0-indexed
  const oneHourAgo = new Date(Date.now() - 900000); // 1 hour in milliseconds
   return dueDateTime > oneHourAgo;
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
  const getDynamicStyles = (item) => {
    return {
      ...styles.column1, // Spread static styles
      backgroundColor: item.category === 'invoice'
    ? (item.paid === 1 ? 'transparent'  // Blue if invoice is paid
       : item.paid === 0 ? 'transparent' // Red if invoice is unpaid
       : 'transparent') // Default to red if paid status is undefined
    : 'transparent',  // Green for remboursements

      height: item.paid ? 80 : 90, // Set background color based on item.client
    };
  };
  const renderItem = ({ item }) => {
  const isInvoice = item.category === "invoice";
  const isPaid = item.paid === 1;
  const pastDue = isPastHour(item);

  const navigateToScreen = () => {
    if (isInvoice) {
      navigation.navigate("InvoiceHistoryScreen", {
        invoice: {
          ...item,
          subtotal: (item.total * 0.8).toFixed(2),
          taxRate: 0.20,
          taxAmount: (item.total * 0.2).toFixed(2),
          products: []
        }
      });
    } else {
      navigation.navigate("Receive", {
        onSelectClient: {
          id: item.idunique,
          name: item.clientname,
          idunique: item.clientid,
          nbrpaid: item.total,
          nbrunpaid: item.total,
          date: item.dueDate,
          time: item.dueTime,
          description: item.description,
        }
      });
    }
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={navigateToScreen}>
      <View style={styles.cardContent}>
      <View style={getDynamicStyles(item)}>
        <Ionicons name="receipt-outline" size={width * 0.1} color='#999' style={styles.icon} />
      </View>
        <View style={styles.column2}>
          <Text style={styles.name}>FACTURE N° {item.idunique}</Text>
          <Text style={styles.date}>
            <Ionicons name="calendar-outline" size={width * 0.025} color="#D15D5D" />
            {` ${item.dueDate} -`}
            <Ionicons name="time-outline" size={width * 0.025} color="#D15D5D" />
            {`${item.dueTime} `}
          </Text>
          {(item.paid === 0 || item.category === 'remboursement') && (
            <Text style={styles.date}>
              <Ionicons name="person-outline" size={width * 0.025} color="#D15D5D" /> {item.clientname}
            </Text>
          )}
          {isInvoice && (
            <Text style={styles.date} numberOfLines={3}>
              <Ionicons name="receipt-outline" size={width * 0.025} color="#D15D5D" /> {item.description}
            </Text>
          )}
        </View>
        <View style={styles.column3}>
          <Ionicons
            name="wallet-outline"
            size={width * 0.09}
            color={
              isPaid
                ? '#3682B3' // Red if unpaid - paid < 0
                : '#D15D5D' // Blue if unpaid - paid = 0
            }
          />
          <Text style={styles.price}>
            {item.total} Dh
          </Text>
          <Text style={styles.description}>Dh TTC (20%)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


  const groupedInvoices = groupInvoicesByDate(filteredInvoices);
  const sections = Object.keys(groupedInvoices).map(date => ({
    title: date,
    data: groupedInvoices[date],
  }));

  const renderItemCompilationDay = ({ item }) => {
    if (!item || item.total === undefined) {
      return null; // Return null if item is missing or not aggregated
    }

    return (
      <TouchableOpacity style={styles.productCard} onPress={() => viewDetail(item)}>
        <View style={styles.cardContent}>
        <View style={getDynamicStyles(item)}>
          <Ionicons name="receipt-outline" size={width * 0.1} color='#999' style={styles.icon} />
        </View>
          <View style={styles.column2}>
            <Text style={styles.name}>
              {item.lastId} → {item.firstId}
            </Text>
          </View>
          <View style={styles.column3}>
            <Ionicons
              name="wallet-outline"
              size={width * 0.09}
              color={
                isPaid
                  ? '#3682B3' // Red if unpaid - paid < 0
                  : '#D15D5D' // Blue if unpaid - paid = 0
              }
            />
            <Text style={styles.price}>
              {item.total} Dh
            </Text>
            <Text style={styles.description}>Dh TTC (20%)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const groupInvoicesByDateCompilation = (invoices) => {
    return invoices.reduce((acc, invoice) => {
      const date = moment(invoice.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = {
          total: 0,
          firstId: invoice.idunique,
          lastId: invoice.idunique,
          invoices: []
        };
      }
      acc[date].invoices.push(invoice);
      acc[date].total += invoice.total; // Accumulate the total for the day
      acc[date].lastId = invoice.idunique; // Update last idunique
      return acc;
    }, {});
  };
  const groupedInvoicesCompilation = groupInvoicesByDateCompilation(filteredInvoices);
  const sectionsCompilation = Object.keys(groupedInvoicesCompilation).map(date => ({
    title: date,
    data: [groupedInvoicesCompilation[date]], // Each section contains one aggregated item
  }));

  const renderItemCompilationMonth = ({ item }) => {
   if (!item || item.total === undefined) {
     return null; // Return null if item is missing or not aggregated
   }

   return (
     <TouchableOpacity style={styles.productCard} onPress={() => viewDetailMonth(item)}>
       <View style={styles.cardContent}>
         <Ionicons name="calendar-outline" size={width * 0.1} color="#999" style={styles.icon} />
         <View style={styles.column2}>
           <Text style={styles.name}>
             {item.firstId} → {item.lastId}
           </Text>
         </View>
         <View style={styles.column3}>
           <Text style={styles.price}>{item.total} Dh</Text>
           <Text style={styles.description}>Monthly Total</Text>
         </View>
       </View>
     </TouchableOpacity>
   );
 };
  const groupInvoicesByMonthCompilation = (invoices) => {
  return invoices.reduce((acc, invoice) => {
    const month = moment(invoice.dueDate, 'DD/MM/YYYY').format('YYYY-MM'); // Format to YYYY-MM
    if (!acc[month]) {
      acc[month] = {
        total: 0,
        firstId: invoice.idunique,
        lastId: invoice.idunique,
        invoices: [],
      };
    }
    acc[month].invoices.push(invoice);
    acc[month].total += invoice.total; // Accumulate the total for the month
    acc[month].lastId = invoice.idunique; // Update last idunique
    return acc;
  }, {});
};
  const groupedInvoicesByMonth = groupInvoicesByMonthCompilation(filteredInvoices);
  const sectionsByMonth = Object.keys(groupedInvoicesByMonth).map(month => ({
  title: month,
  data: [groupedInvoicesByMonth[month]], // Each section contains one aggregated item
}));


  const isValidDate = (date) => {
    // Regular expression for DD/MM/YYYY format
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(date);
  };


  // Filtered list based on search input
  const filteredData = data;

  const ItemSeparator = () => {
  return <View style={{ height: 0, color:'transparent' }} />; // Adjust height as needed for padding
};
  const styless = StyleSheet.create({
    filterButton: {
      borderRadius: width * 0.02,
      borderWidth : width * 0.003,
      borderColor : '#666',
      padding: 10,
      paddingVertical:10,
      marginRight: width * 0.01,
      width:width * 0.23,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: activeFilter === 'Tout' ? '#f9f9f9': '#3682B3',
    },
   buttonText: {
        color: activeFilter === 'Tout' ? '#000': '#fff',
        fontWeight: 'bold',
        fontSize:width * 0.025,
    },
   filterButtonpayées: {
      borderRadius: width * 0.02,
      borderWidth : width * 0.003,
      borderColor : 'transparent',
      padding: 1,
      paddingVertical:10,
      marginRight: width * 0.01,
      width:width * 0.23,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: isPaid === 0 ? '#D15D5D': '#3682B3',
    },
   buttonTextpayées: {
        color: isPaid === 0 ? '#fff': '#fff',
        fontWeight: 'bold',
        fontSize:width * 0.025,
    },
    header:{

      backgroundColor: isPaid === 0 ? '#D15D5D': '#3682B3',

    borderBottomLeftRadius: width * 0.04,
    borderBottomRightRadius: width * 0.04,
    elevation: 1,
    borderColor:'transparent',
    marginBottom:10,
    },
  });

  return (
    <SafeAreaView  edges={[]} style={styles.container}>

        <View style={styles.formContainer}>


        <View style={styless.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text style={styles.Selecttext}>Historique</Text>

  </View>




        <View style={{height:width*0.4,justifyContent:'center', alignItems:'center'}}>
            <Text style={styles.Selecttext22} numberOfLines={1} adjustsFontSizeToFit={true}>{activeResult} MAD</Text>
            <Text style={styles.Selecttext21} numberOfLines={1} adjustsFontSizeToFit={true}>Total du résultat en TTC (20%)
            </Text>
        </View>

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
         <TouchableOpacity style={{ alignSelf: 'center', marginHorizontal:5, }} onPress={() => reload()}>
       <Ionicons name="trash" size={width * 0.1} color="#fff"  />
         </TouchableOpacity>
        </View>

        <View style={[styles.row, {paddingTop:0}]}>
          <TouchableOpacity style={styless.filterButtonpayées} onPress={() => handlePresentModalFirstPress('Filterdate')}>
          <Text style={styless.buttonTextpayées} numberOfLines={1}   adjustsFontSizeToFit={true}> Date : {activeFilter === 'custom' ? 'Personnalisé' : activeFilter}</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styless.filterButtonpayées} onPress={() => handlePresentModalFirstPress('Filtertype')}>
          <Text   style={styless.buttonTextpayées}   numberOfLines={1}   adjustsFontSizeToFit={true}  >  Type : {isPaid === 0 ? 'Impayées' : 'Payées'}</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styless.filterButtonpayées} onPress={() => handlePresentModalFirstPress('Filterclient')}>
            <Text  style={styless.buttonTextpayées} numberOfLines={1} >Client : {activeClient}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styless.filterButtonpayées} onPress={() => handlePresentModalFirstPress('Filteraffichage')}>
            <Text  style={styless.buttonTextpayées} numberOfLines={1} adjustsFontSizeToFit={true} >Affichage</Text>
          </TouchableOpacity>
        </View>
        </View>

        <View style={[ {paddingTop: 0, paddingHorizontal:10,}]}>
        <Text style={styles.result}>
          Résultat trouvé: ({getLengthItem()})
        </Text>
        {startDate && endDate && activeFilter === 'custom' && (
          <Text style={styles.result}>
    Du: {isValidDate(startDate) ? startDate : new Date(startDate).toLocaleDateString()}
     Au: {isValidDate(endDate) ? endDate : new Date(endDate).toLocaleDateString()}
  </Text>

        )}
  <Text style={styles.result}>Type : {isPaid === 0 ? 'Impayées' : 'Payées'}</Text>
        {filterClient !== null && (
          <Text style={styles.result}>Client : {activeClient}</Text>
        )}
      </View>


        <View style={[styles.row, {marginBottom:100}]}>
        <SectionList
  style={styles.list}
  sections={
    loading
      ? sectionSkeletons
      : Affichage === 2
      ? sectionsCompilation
      : Affichage === 3
      ? sectionsByMonth
      : sections
  }
  keyExtractor={(item, index) => `${item?.firstId || item?.id || index}`} // Ensure unique key
  renderItem={({ item }) => {
    if (loading) return renderSkeleton();
    return Affichage === 2
      ? renderItemCompilationDay({ item })
      : Affichage === 3
      ? renderItemCompilationMonth({ item }) // Define a new render function for monthly
      : renderItem({ item });
  }}
  stickySectionHeadersEnabled={true}
  renderSectionHeader={({ section: { title } }) => {
  let formattedTitle;

  if (Affichage === 3) {
    // Show month and year for monthly compilation
    formattedTitle = moment(title, 'YYYY-MM').format('MMMM YYYY'); // Example: "October 2024"
  } else {
    // Show full date for daily compilation
    formattedTitle = moment(title, 'YYYY-MM-DD').format('DD/MM/YYYY'); // Example: "17/11/2024"
  }

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#333',
      borderRadius: width * 0.04,
      width: Affichage === 3 ? '30%' : '30%', // Adjust width for display
      padding:5,
      alignSelf: 'center',
      marginTop: 5,
    }}>
      <Text style={{
        fontSize: width * 0.030,
        color: '#fff',
        textAlign: 'center',
      }}>
        {formattedTitle}
      </Text>
    </View>
  );
}}

  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#0000ff']}
    />
  }
  onEndReached={() => {
    if (!loading) {
      fetchAndCombineData(currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }}
  onEndReachedThreshold={1.5}
/>


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
              selectedClient={selectedClient}
               />
           </BottomSheetModal>
         </BottomSheetModalProvider>


          </View>

        </SafeAreaView>
      );
     });
     export default Clientt;

// Styles with responsive design
const styles = StyleSheet.create({

  contentContainer:{
    flex:1,
    padding:15,
  },
  formContainer: {
    backgroundColor:'#fff',
  },
  Selecttext:{
    fontSize: width * 0.06,
    paddingTop:width*0.1,
    fontWeight: 'bold',
    color:'#fff',
    paddingHorizontal:15,
  },
  Selecttext21:{
    fontSize: width * 0.03,
    color:'#fff',
    paddingHorizontal:15,
  },
  Selecttext22:{
    fontSize: width * 0.16,
    fontWeight: 'bold',
    color:'#fff',
    paddingHorizontal:15,
  },
  row: {

    flexDirection: 'row',
    alignItems: 'center',
    padding:10,
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

  result: {
    fontSize: width * 0.03,
    color: '#999',

  },
  list: {
        flex:1,
  height:width*1,
  },

  itemSeparator: {
    height: 0,
    color:'transparent',
  },

  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : 'transparent',
    marginVertical:5,
    elevation: 1,
  },

  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },

  column1: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
  },

  column2: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'cnter',
    justifyContent: 'center',
  },
  date: {
    fontSize: width * 0.025,
    color: '#999',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
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
  column3: {
    flex: 0.40,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: width * 0.02,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  price: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
});
