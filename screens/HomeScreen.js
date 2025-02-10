import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {  View, FlatList, TouchableOpacity, Dimensions, Picker, ActivityIndicator , Animated  ,TextInput , ImageBackground, ScrollView, Image} from 'react-native';
import { ApplicationProvider, Text, Button , Modal, Divider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { StyleSheet, Keyboard } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import InvoiceSettingsModal from './InvoiceSettingsModal'; // Adjust the import path as necessary
import Alert from './Alert';
import ModalProduct from './ModalProduct';
import { SafeAreaView} from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Menu from './products/Menu';
import Egg from './products/Egg';
import Client from './ListClientsBottom';
import Mescodeshome from './Mescodeshome';
import Mescodescategoryhome from './Mescodescategoryhome';
import Mescodesproductshome from './Mescodesproductshome';

import LoadingScreen from './LoadingScreen'; // Import your LoadingScreen
import UnKnowProduct from './products/UnKnowProduct';
import MarocTelecom from './products/MarocTelecom';
import Orange from './products/Orange';
import Calculator from './Calculator';
import Keypad from './Keypad';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetScrollView  } from '@gorhom/bottom-sheet';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';
import NewProduct from './product/NewProduct';
import Action from './product/Action';
import moment from 'moment';
import { GestureHandlerRootView, FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens(false); // Disables optimizations that may apply safe area.




import LottieView from 'lottie-react-native';

import { PanGestureHandler } from 'react-native-gesture-handler'; // Import the PanGestureHandler
// Fetch device dimensions for responsive design
const { width, height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();
// Move state to parent component
const HomeScreen = ({onPressStateChange}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [products, setProducts] = useState([]);

  const db = useSQLiteContext();

  const [longPressId, setLongPressId] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const swipeableRefs = useRef(new Map());

  const SENSITIVITY_VELOCITY = 800;  // adjust this value to make swipe more or less sensitive


  const [compagnyName, setCompagnyName] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(); // Format: MM/DD/YYYY or based on locale
  const hours = currentDate.getHours().toString().padStart(2, '0');  // Gets hours in 24-hour format
  const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // Gets minutes
  const formattedTime = `${hours}:${minutes}`;

   const [loading, setLoading] = useState(false);


  const inputRef = useRef(null);

  const productsfree = [
   { id: '1686876', name: 'Votre produit..',brand:'', quantity:1,price:0, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1105', icon: 'call-outline', source:'cart'},
   { id: '867672', name: 'Votre produit ..',brand:'', quantity:1,price:0, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1110', icon: 'call-outline' , source:'scan'},
  ];

  const productsWithoutEAN = [
   { id: '1686876', name: 'Recharge 5Dh',brand:'', quantity:1,price:5, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1105', icon: 'call-outline' },
   { id: '867672', name: 'Recharge 10Dh',brand:'', quantity:1,price:10, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1110', icon: 'call-outline' },
   { id: '86786763', name: 'Recharge 20Dh',brand:'', quantity:1,price:20, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1120', icon: 'call-outline' },
   { id: '7867864', name: 'Recharge 50Dh',brand:'', quantity:1,price:50, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1150', icon: 'call-outline' },
   { id: '578687687', name: 'Recharge 100Dh',brand:'', quantity:1,price:100, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1100', icon: 'call-outline' },
   { id: '7867868766', name: 'Recharge 200Dh',brand:'', quantity:1,price:200, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1200', icon: 'call-outline' },
  ];

  const iconMapping = {
    'cartinvoice': require('../assets/invoice/cartinvoice.png'),
    'calculatorinvoice': require('../assets/invoice/calculatorinvoice.png'),
    'barcodeinvoice': require('../assets/invoice/barcodeinvoice.png'),
    'unknowninvoice': require('../assets/invoice/unknowninvoice.png'),
    'barcodeinvoicegrey': require('../assets/invoice/barcodeinvoicegrey.png'),
    'cartinvoicegrey': require('../assets/invoice/cartinvoicegrey.png'),

  };
  const [invoice, setInvoice] = useState({
    idunique: '',
    compagnyname: '',
    custumername: '',
    clientid: '',
    dueTime: '',
    dueDate: '',
    products: [],
    subtotal: 350,
    taxRate: 0.20,
    taxAmount: 70,
    paid: true,
    total: 420,
  });

  const [showAlert, setShowAlert] = useState(false);

  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(true);
  const flexValue = useRef(new Animated.Value(0.45)).current; // initial flex value
  const flexValue2 = useRef(new Animated.Value(0.57)).current; // initial flex value
  const bottomValue = useRef(new Animated.Value(width*1.4)).current; // initial flex value



  const [sound, setSound] = useState();

  const [newPrice, setNewPrice] = useState(0);

  const bottomSheetModalFirstRef = useRef(null);
  const bottomSheetModalSecondRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [editingId, setEditingId] = useState(null);  // Track which item is being edited
  const [newInvoiceId, setNewInvoiceId] = useState('');



  const [codesData, setCodesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [codesDataMap, setCodesDataMap] = useState(new Map());
  const [scannedCode, setScannedCode] = useState(null);
  const [prefix, setPrefix] = useState(null);
  const [subcat, setSubcat] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const {facing, setFacing} = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isPressed, setIsPressed] = useState(true);
  const [isModifyMode, setIsModifyMode] = useState(false); // Track if in modify mode
  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points

  const [scanningAllowed, setScanningAllowed] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null); // Track modal content

  const [countdown, setCountdown] = useState(null); // To display the countdown
  const timerRef = useRef(null); // Ref for the main inactivity timer
  const countdownTimerRef = useRef(null); // Ref for the countdown timer
  const countdownIntervalRef = useRef(null); // Ref for the countdown interval



    // Memoized total calculation based on products array
  const totalAmount = useMemo(() => {
      return products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [products]); // Recalculates only when products array changes

    const buttons = useMemo(
     () => [
       { key: 'Camera', onPress: () => toggleCamera(), icon: 'camera-outline', tag: 'On', istag: true },
       { key: 'Calculator', onPress: () => handlePresentModalFirstPress('Calculator'), icon: 'calculator-outline', tag: products.length, istag: false },
       { key: 'Keypad', onPress: () => handlePresentModalFirstPress('Keypad'), icon: 'keypad-outline', tag: '', istag: false },
       { key: 'Paid', onPress: () => handlePress(), icon: 'receipt-outline', tag: isPressed ? 'Paid' : 'UnPaid', istag: false },
       { key: 'Client', onPress: () => handlePresentModalFirstPress('Client'), icon: 'people-outline', tag: invoice.custumername, istag: false },
       { key: 'Delete', onPress: () => {setProducts([]); setInvoice(prevInvoice => ({ ...prevInvoice, custumername: '', clientid : ''}));}, icon: 'trash-outline', tag: '0', istag: false },
       // More buttons
     ],
     [toggleCamera, handlePresentModalFirstPress, products.length, handlePress, invoice.custumername, invoice.clientid, isPressed] // Added products.length to dependencies
   );

    const renderButton = useCallback(
     ({ item }) => {
       const isHighlighted = (item.key === 'Camera' && cameraOpen) ||
                             (item.key === 'Add' &&  products.length > 0) ||
                             (item.key === 'Paid' &&  products.length > 0) ||
                             (item.key === 'Client' &&  invoice.custumername !== '');

       const isTagVisible = (item.key === 'Paid' && products.length > 0 ? true : item.istag) ||
                            (item.key === 'Client' && invoice.custumername !== '' ? true : item.istag);

       return (
         <TouchableOpacity onPress={item.onPress} style={styles.clientInfoColumn2}>
           <Ionicons
             name={item.icon}
             size={width * 0.08}
             color={
               isHighlighted
               ? isPressed
               ? '#3682B3' // Blue if pressed
               : '#D15D5D' // Red if not pressed
               : '#a5a5a5' // Gray icon when products.length is 0
             } // Blue if highlighted, grey otherwise
           />
           {isTagVisible && (
             <View
               style={[
                 styles.containertag,
                 { backgroundColor:
                   isHighlighted
                   ? isPressed
                   ? '#3682B3' // Blue if pressed
                   : '#D15D5D' // Red if not pressed
                   : '#fff' // Gray icon when products.length is 0 } // Blue if highlighted, white otherwise
                }
               ]}
             >
               <Text
                 numberOfLines={1}
                 style={[
                   styles.tagText,
                   { color: isHighlighted ? '#fff' : '#a5a5a5' } // White if highlighted, grey otherwise
                 ]}
               >
                 {item.tag}
               </Text>
             </View>
           )}
         </TouchableOpacity>
       );
     },
     [cameraOpen, selectedComponent, products.length, handlePress, isPressed, invoice.custumername] // Dependencies for renderButton
   );


    const animation = useRef(null);

    useEffect(() => {
  Animated.timing(flexValue, {
    toValue: cameraOpen ? 0.45 : 0.35,
    duration: 300, // animation duration in ms
    delay: 0, // 1-second delay
    useNativeDriver: false,
  }).start();
  Animated.timing(flexValue2, {
    toValue: cameraOpen ? 0.57 : 0.60,
    duration: 300, // animation duration in ms
    delay: 0, // 1-second delay
    useNativeDriver: false,
  }).start();
  Animated.timing(bottomValue, {
    toValue: cameraOpen ? width*1.39 : width*1.53,
    duration: 300, // animation duration in ms
    delay: 0, // 1-second delay
    useNativeDriver: false,
  }).start();
}, [cameraOpen, flexValue]);

     useEffect(() => {
     animation.current?.play();
     }, []);

     useEffect(() => {
      // Check if invoiceSent parameter is true
      if (route.params?.invoiceSent) {
        setProducts([]);
        setIsPressed(true);
        setInvoice(prevInvoice => ({ ...prevInvoice, custumername: '', clientid : ''}));
        onPressStateChange(true);
        console.log('works fine');
        // Reset the parameter after handling the action
        navigation.setParams({ invoiceSent: false });
      }
    }, [route.params?.invoiceSent]);

   //Load Products
     useEffect(() => {
     getUserName();
   }, []);

   // Load CSV file once
    useEffect(() => {
     const loadCSV = async () => {
       try {
         // Load the asset
         const asset = Asset.fromModule(require('../assets/codes1.csv'));
         await asset.downloadAsync(); // Ensure the asset is downloaded
         console.log("Asset found and downloaded: ", asset.uri);

         // Read the CSV file
         const response = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
         console.log("CSV file read successfully");

         // Parse CSV file
         Papa.parse(response, {
           header: true,
           complete: (results) => {
             const parsedData = results.data;
             setCodesData(parsedData); // Set the parsed data

             // Create a map for faster lookups
             const dataMap = new Map();
             parsedData.forEach(row => {
               const codeKey = row.codes.trim().toLowerCase(); // Normalize key
               dataMap.set(codeKey, row);
             });
             setCodesDataMap(dataMap); // Set the map

             SplashScreen.hideAsync(); // Hide the splash screen
           },
           error: (error) => {
             console.error("Error parsing CSV: ", error);
           },
         });
       } catch (error) {
         console.error("Error loading CSV: ", error);
       }
     };

     loadCSV();


   }, []);

    useEffect(() => {
    if (cameraOpen) {
      startCameraTimers();
    }

    return () => {
      clearCameraTimers(); // Clean up timers on component unmount or camera close
    };
  }, [cameraOpen]);

    useEffect(() => {
     const interval = setInterval(() => {
       setProducts(prevProducts =>
         prevProducts.map(product => {
           const isOverdue = moment().diff(moment(product.dueTime), 'seconds') > 2;
           return {
             ...product,
             isDue: !isOverdue // Set isDue to false if overdue
           };
         })
       );
     }, 1000); // Check every second

     return () => clearInterval(interval); // Cleanup on component unmount
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




 const OpenProduct = (item) => {
     handlePresentModalFirstPress('SubCategory');
     setPrefix(item);

   }; // Replace with actual dependencies

 const goBack = () => {
       handlePresentModalFirstPress('Add');
       setPrefix(null);

     }; // Replace with actual dependencies

 const OpenCategory = (item) => {
           handlePresentModalFirstPress('Product');
           setSubcat(item);
         }; // Replace with actual dependencies


 const goBackCat = () => {
               handlePresentModalFirstPress('SubCategory');

              setSubcat(null);

             }; // Replace with actual dependencies


   // Memoized function to avoid re-creating on each render
   const handlePresentModalFirstPress = useCallback((component) => {

     if (typeof component === 'string') {
       setSelectedComponent(component);
       if (component === 'Add') {
         setSnapPoint(['85%']);
       } else if (component === 'Modify' || component === 'Client') {
         setSnapPoint(['85%']);
       } else if (component === 'Calculator') {
         setSnapPoint(['90%']);
       } else if (component === 'Keypad') {
         setSnapPoint(['70%']);
       } else if (component === 'SubCategory') {
         setSnapPoint(['85%']);
       }else if (component === 'Product') {
         setSnapPoint(['85%']);
       } else {
         setSnapPoint(['50%']);
       }
     } else {
       setSelectedComponent('Action');
       setSelectedItem(component);
       setSnapPoint(['55%']);
     }
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

     // Present the bottom sheet modal
     bottomSheetModalFirstRef.current?.present();
   }, []);

   // callbacks
     const handlePresentModalFirstClose = useCallback(() => {
     // Present the bottom sheet modal
     setSelectedComponent(null);
     bottomSheetModalFirstRef.current?.close();
   }, []);

     const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);

     const handlePress = useCallback(() => {
      if (products.length > 0) {
        setIsPressed((prevState) => {
          const newPressedState = !prevState; // Toggle based on previous state
          onPressStateChange(newPressedState); // Send updated state to parent
          console.log('paid ?', newPressedState); // Log the updated state
          return newPressedState; // Update the state
        });
      }
    }, [products, onPressStateChange, selectedComponent]); // Only depends on products and onPressStateChange


    // Function to toggle camera and reset timers
    const toggleCamera = () => {
      setCameraOpen(prevState => {
        const newState = !prevState;
        if (newState) {
          // Reset timers when camera opens
          startCameraTimers();
        } else {
          // Clear timers when camera closes
          clearCameraTimers();
          onPressStateChange(true);
        }
        return newState;
      });
    };

    const startCameraTimers = () => {
    // Clear any existing timers
    clearCameraTimers();

    // Timer to close the camera after 9 seconds of inactivity
    timerRef.current = setTimeout(() => {
      setCameraOpen(false); // Close the camera
    }, 9000);

    // Timer to start the countdown at 6 seconds (3 seconds before closing)
    countdownTimerRef.current = setTimeout(() => {
      let counter = 3;
      setCountdown(counter);

      // Countdown every second
      countdownIntervalRef.current = setInterval(() => {
        counter -= 1;
        setCountdown(counter);

        if (counter === 0) {
          clearInterval(countdownIntervalRef.current); // Stop the countdown at 0
        }
      }, 1000);
    }, 6000); // Start countdown after 6 seconds
    };

    const clearCameraTimers = () => {
     // Clear all timers
     if (timerRef.current) clearTimeout(timerRef.current);
     if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
     if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

     // Reset countdown display
     setCountdown(null);
   };

     async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('../assets/bip.mp3')
    );
    setSound(sound);
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

    await sound.playAsync();
  }

     async function playSounderror() {
    const { sound } = await Audio.Sound.createAsync( require('../assets/biperror.mp3')
    );
    setSound(sound);
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    await sound.playAsync();
  }

     const renderBackdrop = (props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0} // Backdrop shows up when sheet is open
          disappearsOnIndex={-1} // Backdrop disappears when closed
          pressBehavior="close" // Close the modal when backdrop is pressed
          opacity={0.9} // Adjust opacity
        />
      );

     const selectedClient = (item) => {
          handlePresentModalFirstClose();

          // Update the invoice state with the selected client details
          setInvoice((prevInvoice) => ({
            ...prevInvoice,
            clientid: item.id,
            custumername: item.name,
          }));
        };
     // Handle saving the new price
     const ModifyProduct = (product) => {
    const updatedProducts = products.map(producta => {
      if (producta.id === product.id) {
        return { ...producta, price: product.price, name : product.name };  // Update price for the correct product
      }
      return producta;
    });
    setProducts(updatedProducts);  // Update the products array
    handlePresentModalFirstClose();
  };

  // Handle saving the new quantity
  const ModifyProductNoclose = (updatedProduct) => {
    const updatedProducts = products.map(product => {
      if (product.id === updatedProduct.id) {
        return { ...product, quantity: updatedProduct.quantity }; // Update quantity for the correct product
      }
      return product;
    });
    setProducts(updatedProducts); // Update the products array
  };

     async function getUserName() {
   const user = await AsyncStorage.getItem("@user"); // Await the promise to get the actual data
   const name = user ? JSON.parse(user).name : null;
   const id = user ? JSON.parse(user).id : null;
   setCompagnyName(name);
   setUserName(name);
   setUserId(id);
   console.log('my name is ', id); // Output the name (e.g., "John Doe")
   return name;
  }


     const CreateInvoice = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

    // Access the current state inside setInvoice to ensure the latest values are used
    setInvoice(prevInvoice => {
      // Create the updated invoice object based on the latest state
      const updatedInvoice = {
        ...prevInvoice, // Spread the previous state
        idunique: newInvoiceId,
        products: products,
        compagnyname: 'MoulHanout',
        total: totalAmount,
        dueDate: formattedDate,
        dueTime: formattedTime,
        custumername: prevInvoice.custumername, // Ensure custumername comes from the latest state
        clientid: prevInvoice.clientid,         // Ensure clientid comes from the latest state
        isPaid: isPressed,                      // Use the isPressed value for paid status
      };

      // Log the updated invoice to check if all values are correct
      console.log('Updated invoice before navigating:', updatedInvoice);

      // Navigate to the Invoice screen and pass the updated invoice and isPaid
      navigation.navigate("Invoice", { invoice: updatedInvoice, isPaid: updatedInvoice.isPaid });

      // Return the updated state
      return updatedInvoice;
    });
      }, [products, newInvoiceId, formattedDate, formattedTime, userId, isPressed, totalAmount]);


     if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
     if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


    // Function to delete an item from the list
    const deleteItem = (id) => {
      setProducts(prevProducts => {
        const updatedProducts = prevProducts.filter(item => item.id !== id);

        // Check if the products list is now empty after deletion
        if (updatedProducts.length === 0) {
          const newPressedState = true; // Toggle state
          setIsPressed(true); // Update local state
          onPressStateChange(true); // Send state to parent
        }
        return updatedProducts; // Return the updated products list
      });

      // Close the bottom sheet action
      handlePresentModalFirstClose();

      // Clear the selected item
      setSelectedItem(null);
    };

    // Long press handler to delete item after holding for 1 second
    const handleLongPressStart = (id) => {
      const timer = setTimeout(() => {
        setLongPressId(id);
        deleteItem(id);
      }, 500); // 1 second delay for long press
      setPressTimer(timer);
    };

    const handleLongPressEnd = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        setPressTimer(null);
      }
      if (longPressId !== null) {
        setLongPressId(null);
      }
    };

    // Function to increment the product quantity by 0.5
    const incrementQuantity = (id) => {
      setProducts(prevProducts =>
        prevProducts.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 0.5 } : item
        )
      );

      const swipeRef = swipeableRefs.current.get(id);
      if (swipeRef) {
        swipeRef.close(); // Close swipeable after action
      }
    };

    // Function to decrement the product quantity by 0.5
    const  dincrementQuantity = (id) => {
      setProducts(prevProducts =>
        prevProducts.map(item =>
          item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 0.5 } : item
        )
      );

      const swipeRef = swipeableRefs.current.get(id);
      if (swipeRef) {
        swipeRef.close(); // Close swipeable after action
      }
    };

    // Render function for each product item in the list
    const renderProductItemFree = ({ item }) => {
      const totalPrice = parseFloat((item.quantity * item.price).toFixed(2));
      const renderLeftActions = () => (
        <View style={styles.leftAction}>
          <Text style={styles.actionText}>+0.5</Text>
        </View>
      );

      const renderRightActions = () => (
        <View style={styles.rightAction}>
          <Text style={styles.actionText}>-0.5</Text>
        </View>
      );

      return (
        <Swipeable
          ref={ref => {
            if (ref) {
              swipeableRefs.current.set(item.id, ref);
            }
          }}
          renderLeftActions={renderLeftActions}
          onSwipeableRightWillOpen={() => dincrementQuantity(item.id)}
          renderRightActions={renderRightActions}
          onSwipeableLeftWillOpen={() => incrementQuantity(item.id)}
          friction={4}
        >
          <TouchableOpacity
            style={[styles.productCardFree, longPressId === item.id && styles.longPressedBackground]}
           onPress={()=> handlePresentModalFirstPress('Add')}
          >
          <View style={styles.column000}>
            <Image
            source={
  item.source === 'calculator'
    ? iconMapping['calculatorinvoice']
    : item.source === 'cart'
      ? iconMapping['cartinvoicegrey']
      : item.source === 'scan'
        ? iconMapping['barcodeinvoicegrey']
        : item.source === 'Unknown'
          ? iconMapping['unknowninvoice']
          : iconMapping['unknowninvoice'] // Fallback icon if none match
}
              style={styles.icon2}
            />
          </View>

            <View style={styles.column1}>
              <Text style={styles.productNameFree}>

               {item.name}
              </Text>

                <Text style={styles.productDetailsFree}>{item.ean}</Text>

              <Text style={styles.productDetailsFree}>
                Qty: <Text style={{ fontWeight: 'bold', color:'#999' }}>{item.quantity}</Text> | Prix: <Text style={{ fontWeight: 'bold' ,color:'#999'}}>{item.price} Dh</Text>
              </Text>
            </View>

            <View style={styles.column2}>
              <Text style={styles.totalLabelFree}>Total in DH</Text>


              {editingId === item.id ? (
                        // When in edit mode, show a TextInput and a "validation ok" icon
                        <>
                          <TextInput
                            ref={inputRef}
                              style={stylessearch.searchInput2}
                            value={newPrice.toString()}
                            keyboardType="numeric"
                             onChangeText={setNewPrice}  // Update new price as the user types
                          />
                        </>
                      ) : (
                        // Default view with the ellipsis icon
                    <Text style={styles.totalPriceFree}>{totalPrice} Dh</Text>
                      )}

            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    };

    // Render function for each product item in the list
    const renderProductItem = ({ item }) => {
      const isDue = moment().diff(moment(item.dueTime), 'seconds') > 2;
      const totalPrice = parseFloat((item.quantity * item.price).toFixed(2));

      const renderLeftActions = () => (
        <View style={styles.leftAction}>
          <Text style={styles.actionText}>+0.5</Text>
        </View>
      );

      const renderRightActions = () => (
        <View style={styles.rightAction}>
          <Text style={styles.actionText}>-0.5</Text>
        </View>
      );

      const handleQuantityChange = (operation) => {
        if (operation === "increment") {
          incrementQuantity(item.id);
        } else if (operation === "decrement") {
          dincrementQuantity(item.id);
        }
      };

      return (
        <Swipeable
          ref={ref => {
            if (ref) {
              swipeableRefs.current.set(item.id, ref);
            }
          }}
          renderLeftActions={renderLeftActions}
          onSwipeableLeftWillOpen={() => handleQuantityChange("increment")}
          renderRightActions={renderRightActions}
          onSwipeableRightWillOpen={() => handleQuantityChange("decrement")}
          friction={1}
        >
          <TouchableOpacity
            style={[
              styles.productCard,
              longPressId === item.id && styles.longPressedBackground
            ]}
            onPress={() => handlePresentModalFirstPress(item)} // Enter editing mode
            onPressIn={() => handleLongPressStart(item.id)}
            onPressOut={handleLongPressEnd}
          >
          <View style={styles.column00}>
            <Image
            source={
  item.source === 'calculator'
    ? iconMapping['calculatorinvoice']
    : item.source === 'cart'
      ? iconMapping['cartinvoice']
      : item.source === 'scan'
        ? iconMapping['barcodeinvoice']
        : item.source === 'Unknown'
          ? iconMapping['unknowninvoice']
          : iconMapping['unknowninvoice'] // Fallback icon if none match
}
              style={styles.icon2}
            />
          </View>
            <View style={styles.column1}>
              <Text style={styles.productName}>
              <>
               {!isDue && (
                 <Text  style={[styles.productDetails,    { color: isPressed ? '#3682B3' : '#D15D5D' },  ]}    >● </Text>
                )}
              </>
               {item.name}
              </Text>

                <Text style={styles.productDetails}>{item.ean}</Text>

              <Text style={styles.productDetails}>
                Qty: <Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text> | Prix: <Text style={{ fontWeight: 'bold' }}>{item.price} Dh</Text>
              </Text>
            </View>

            <View style={styles.column2}>
              <Text style={styles.totalLabel}>Total in Dh</Text>
              <Text style={[styles.totalPrice, {backgroundColor:isPressed ? '#3682B3' : '#D15D5D' }]} numberOfLines={1} adjustsFontSizeToFit={true}>{totalPrice} Dh</Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    };





    const stylessearch = StyleSheet.create({
    searchInput: {
      height: isFocused ? 50 : 40,  // Increase height when focused
      fontSize: isFocused ? 20 : 16,  // Larger font when focused
      fontWeight: isFocused ? 'bold' : 'normal',  // Make text bold when focused
      letterSpacing: isFocused ? 2 : 0,  // Increase padding between characters when focused
      padding: isFocused ? 10 : 10,  // Increase padding when focused
      borderWidth: 1,
      borderColor: '#666',
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    searchInput2: {
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#666',
      borderRadius: 5,
      backgroundColor: '#F6F6F6',
      padding: width * 0.02,
      width:'100%',
    }
  });



  const handleBarCodeScanned = async ({ type, data }) => {
if (!scanningAllowed) return; // Prevent scanning if not allowed

// Disable further scanning for a short duration
setScanningAllowed(false);
setScannedCode(data);
clearCameraTimers();

// Log the scanned data for debugging
console.log("Scanned Code: ", data);

  const dbProduct = await searchProductInDatabase(data);
// Find the row in codesData that matches the scanned data
if (dbProduct) {
    await AddProductafterScanAfterDb(dbProduct);
  // If the code exists in codesData, proceed to check products

  console.log("Found product in codesData: ",  dbProduct.ean);
} else {
  // Check if the scanned data is a valid EAN-13 barcode (13 digits)
  if (/^\d{8}$|^\d{13}$/.test(data)) {


  const foundRow = codesDataMap.get(data.trim().toLowerCase());

  if (foundRow) {
    // Convert foundRow.price to a number
    const price = parseFloat(foundRow.price);


    // If the conversion was successful, you can now use price as a number
    await AddProductafterScan({ ...foundRow, price }); // Pass the updated foundRow with numeric price
    console.log("Found product in database: ", foundRow.codes);
  } else {
    // If no matching product is found in both codesData and database, handle unknown product
    handleUnknownProduct(data);
  }


  }
}

// Allow scanning again after a delay (e.g., 1.5 seconds)
setTimeout(() => {
  setScanningAllowed(true);
}, 1500); // Adjust the delay as necessary
};

     const handleUnknownProduct = (data) => {
    const unknownProductIndex = products.findIndex(product => product.ean === data && product.name === 'Produit non reconnu');

    if (unknownProductIndex !== -1) {
      // If "Produit non reconnu" exists, update its properties and increment quantity
      setProducts(prevProducts => {
        // Create a copy of the products array
        let updatedProducts = [...prevProducts];

        // Update the product's quantity, dueTime, and isDue
        updatedProducts[unknownProductIndex] = {
          ...updatedProducts[unknownProductIndex], // Spread the existing properties
          quantity: updatedProducts[unknownProductIndex].quantity + 1, // Increment quantity
          dueTime: moment().toISOString(), // Set dueTime to the current time
          isDue: true // Set isDue to true
        };

        // Move the updated product to the top of the list
        const [updatedProduct] = updatedProducts.splice(unknownProductIndex, 1); // Remove it from original position
        updatedProducts = [updatedProduct, ...updatedProducts]; // Add it to the top

        return updatedProducts; // Return the updated products array
      });

      // Play error sound
      playSounderror();
    } else {
      // If the unknown product doesn't exist, add it as a new entry
      setProducts(prevProducts => [
        {
          id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Generate a unique ID
          name: 'Produit non reconnu',
          brand: '',
          quantity: 1, // Initialize quantity to 1
          price: 0,
          stock: 0,
          nearbySold: 0,
          timesSold: 0,
          avatar: '',
          ean: data, // Set EAN to the scanned data
          exists: false, // Mark as an unknown product
          dueTime: moment().toISOString(), // Set dueTime to the current time
          isDue: true, // Initialize isDue to true
          source:'unknow'
        },
        ...prevProducts // Add the new product to the beginning of the list
      ]);

      // Play error sound
      playSounderror();
    }
  };

    const handleUnknownProductfromCalculator = (data) => {
      const price = parseFloat(data);
    // If it doesn't exist, add a new unknown product
    setProducts(prevProducts => [
      {
        id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Ensure unique ID
        name: 'Produit non reconnu',
        brand: '',
        quantity: 1,
        price: price,
        stock: 0,
        nearbySold: 0,
        timesSold: 0,
        avatar: '',
        ean: 'Depuis la calculatrice', // Use scanned data as EAN
        exists: false, // Set exists property for unknown products
        dueTime: moment().toISOString(), // Set dueTime to the current time
        isDue: true, // Initialize isDue to true
        source: 'calculator' // Initialize isDue to true
      },
      ...prevProducts // Add new product at the beginning
    ]);
    playSounderror();
    handlePresentModalFirstClose();
  };

  const handleUnknownProductfromKeypad = (data) => {

    const price = parseFloat((data[0].total/data[0].quantity).toFixed(2));
  // If it doesn't exist, add a new unknown product
  setProducts(prevProducts => [
    {
      id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Ensure unique ID
      name: data[0].productname,
      brand: data[0].productname,
      quantity: 1,
      price: price,
      stock: 0,
      nearbySold: 0,
      timesSold: 0,
      avatar: '',
      ean: data[0].productid, // Use scanned data as EAN
      exists: false, // Set exists property for unknown products
      dueTime: moment().toISOString(), // Set dueTime to the current time
      isDue: true, // Initialize isDue to true
      source: 'cart' // Initialize isDue to true
    },
    ...prevProducts // Add new product at the beginning
  ]);
  playSounderror();
  handlePresentModalFirstClose();
};
     const AddProductafterScan = async (item) => {
  // Check if the product already exists based on EAN
  const existingProductIndex = products.findIndex(product => product.ean === item.codes);
  console.log('Product code: ', item.codes);

  if (existingProductIndex !== -1) {
    // If the product exists, update its quantity and other fields
    setProducts(prevProducts => {
      // Create a copy of the products array
      let updatedProducts = [...prevProducts];

      // Update the product's quantity, dueTime, and isDue
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex], // Spread the existing properties
        quantity: updatedProducts[existingProductIndex].quantity + 1, // Increment quantity
        dueTime: moment().toISOString(), // Set dueTime to the current time
        isDue: true // Set isDue to true
      };

      // Move the updated product to the top of the list
      const [updatedProduct] = updatedProducts.splice(existingProductIndex, 1); // Remove it from original position
      updatedProducts = [updatedProduct, ...updatedProducts]; // Add it to the top

      return updatedProducts; // Return the updated products array
    });

    playSound(); // Play success sound
  } else {
    // If the product doesn't exist, add it as a new product
    setProducts(prevProducts => [
      {
        id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Ensure unique ID
        name: item.name,
        brand: item.codes,
        quantity: 1, // Initialize quantity to 1
        price: item.price,
        stock: 0,
        nearbySold: 0,
        timesSold: 0,
        avatar: '',
        ean: item.codes, // Use item.codes as EAN
        exists: true, // Mark as a known product
        dueTime: moment().toISOString(), // Set dueTime to the current time
        isDue: true, // Initialize isDue to true
        source:'scan',
      },
      ...prevProducts // Add the new product at the beginning of the list
    ]);

    playSound(); // Play success sound
  }

  // Reset other states and UI as necessary
};
     const AddProductafterScanAfterDb = async (item) => {
// Check if the product already exists based on EAN
    const existingProductIndex = products.findIndex(product => product.ean === item.productid);
      console.log('Product code: ', item.productid);

if (existingProductIndex !== -1) {
  // If the product exists, update its quantity and other fields
  setProducts(prevProducts => {
    // Create a copy of the products array
    let updatedProducts = [...prevProducts];

    // Update the product's quantity, dueTime, and isDue
    updatedProducts[existingProductIndex] = {
      ...updatedProducts[existingProductIndex], // Spread the existing properties
      quantity: updatedProducts[existingProductIndex].quantity + 1, // Increment quantity
      dueTime: moment().toISOString(), // Set dueTime to the current time
      isDue: true // Set isDue to true
    };

    // Move the updated product to the top of the list
    const [updatedProduct] = updatedProducts.splice(existingProductIndex, 1); // Remove it from original position
    updatedProducts = [updatedProduct, ...updatedProducts]; // Add it to the top

    return updatedProducts; // Return the updated products array
  });

  playSound(); // Play success sound
} else {
  // If the product doesn't exist, add it as a new product
  setProducts(prevProducts => [
    {
      id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Ensure unique ID
      name: item.productname,
      brand: item.productid,
      quantity: 1, // Initialize quantity to 1
      price: (item.total / item.quantity).toFixed(2),
      stock: 0,
      nearbySold: 0,
      timesSold: 0,
      avatar: '',
      ean: item.productid, // Use item.codes as EAN
      exists: true, // Mark as a known product
      dueTime: moment().toISOString(), // Set dueTime to the current time
      isDue: true, // Initialize isDue to true
      source:'scan'
    },
    ...prevProducts // Add the new product at the beginning of the list
  ]);

  playSound(); // Play success sound
}

// Reset other states and UI as necessary
};

    //AddProduct
    const AddProduct =  (item) => {
        const total = parseFloat((item.total/item.quantity).toFixed(2));
        const quantity = parseFloat((item.quantity/item.quantity).toFixed(2));
    //handleAction();
    setProducts(prevProducts => [
      {  id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Ensure unique ID
        name: item.productname,
        brand: item.productname,
        quantity: quantity,
        price: total,
        stock: 0,
        nearbySold: 0,
        timesSold: 0,
        avatar: 0,
        ean: item.productid,
        exists: true, // Set exists property for unknown products
        dueTime: moment().toISOString(), // Set dueTime to the current time
          isDue: true, // Initialize isDue to true
          source:'cart',
      },
      ...prevProducts // Add new product at the beginning
    ]);
    handlePresentModalFirstClose()
      playSound();
  };

  // Function to search for a product in the SQLite database
  const searchProductInDatabase = async (eanCode) => {
    try {
      // Query the detailsfacture table for the latest product with the matching EAN code
      const query = `
        SELECT * FROM detailsfacture
        WHERE userid = 1
        AND productid = ?
        ORDER BY dueDate DESC, dueTime DESC
        LIMIT 1
      `;

      const result = await db.getAllAsync(query, [eanCode]); // Run the query with eanCode as a parameter

      if (result && result.length > 0) {
        // If a result is found, return the first (latest) product
        console.log('result', result[0]);
        return result[0];
      } else {
        // Return null if no product is found
        return null;
      }
    } catch (error) {
      console.log("Database search error: ", error);
      return null;
    }
  };

    const handleAction = () => {
        setShowAlert(true);
    };

    const OpenModifyItem = (item) => {
    setSnapPoint(['60%']); // Set snap point to 75%
    setIsModifyMode(true); // Set to modify mode to show <AddProduct>
  };

    const styless = StyleSheet.create({

    containerloading: {
     flex: 1,
   },
   image: {
     flex: 1,
     justifyContent: 'center',
   },
   loadingContainer: {
     alignItems: 'center',
     justifyContent: 'center',
   },
   loadingText: {
     color: 'white',
     fontSize: 24,
     marginBottom: 20,
   },
   progressBarBackground: {
     width: '80%',
     height: 10,
     backgroundColor: '#ccc',
     borderRadius: 5,
     overflow: 'hidden',
   },
   progressBarFill: {
     height: '100%',
     backgroundColor: '#0000ff',
     borderRadius: 5,
   },
    creatinvoicebuttonBottom :{

   // Space between buttons when both are shown
    },
    ButtonCreatInvoiceContainer: {
      left: 0,
      flex:0.1,
      right: 0,
      bottom: 0, // Adjust to be just above the totalContainer
    alignSelf: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center',
    },

    creatinvoicebutton :{
      backgroundColor:products.length === 0 ? '#f2f2f2' : '#3682B3',
      borderRadius: 20,
      borderColor:'transparent',
      flex: 1,
     marginHorizontal:10,

   // Space between buttons when both are shown
    },
    returnbutton: {
    // You can customize additional styles here
    borderRadius: 20,
    color:'white',
    flex: 0.4,
  },

  filterButton: {
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : '#d1cfcf',
    marginRight: width * 0.01,
    paddingVertical:10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    flex:1,
  },
  blackcamera: {
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor : 'black',
    backgroundColor: 'black', // Default background color for inactive state
    flex:1,
  },
  inactiveButton: {
    backgroundColor: '#F6F6F6', // Default background color for inactive state
  },
  activeButton: {
   backgroundColor: '#333', // Dark background for active state
  },
  buttonText: {

    fontSize: width * 0.035,
      fontWeight: 'bold',
  },
  column4: {
    flex: 0.2,
    alignItems: 'center',
    paddingLeft:20,
    alignItems:'center',
   justifyContent: 'center',
  },
  column5: {
    flex: 0.8,
    alignItems:'center',
   justifyContent: 'center',
  },

  BoxwithCamera: {

    borderTopLeftRadius: width * 0.04,
    borderTopRightRadius: width * 0.04,
    // Add shadow effect for a more appealing look
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  });

  const ItemSeparator = () => {
  return <View style={{ height: 10 }} />; // Adjust height as needed for padding
};
  return (
    <SafeAreaView style={[styles.container, {backgroundColor:'transparent'}]} edges={[]}>
    <ApplicationProvider {...eva} theme={eva.light}>
      <GestureHandlerRootView>



        <View style={styles.container}>

          {/* Notification Section */}
          {/* Camera Section */}

                                          <FlingGestureHandler
                                          direction={Directions.UP}
                                           hitSlop={{ top: 1000, bottom: 1000, left: 1000, right: 1000 }}
                                           minVelocity={5} // Set to a low value for more sensitivity
                                           minDist={1}      // Minimum distance to detect the fling gesture

                                          onHandlerStateChange={({ nativeEvent }) => {
                                            if (nativeEvent.state === State.END) {
                                              setCameraOpen(false);
                                              console.log('wha');
                                            }
                                          }}
                                        >
                                          <FlingGestureHandler
                                            direction={Directions.DOWN}
                                            hitSlop={{ top: 1000, bottom: 1000, left: 1000, right: 1000 }}
                                            minVelocity={5} // Set to a low value for more sensitivity
                                            minDist={1}      // Minimum distance to detect the fling gesture


                                            onHandlerStateChange={({ nativeEvent }) => {
                                              if (nativeEvent.state === State.END) {
                                                setCameraOpen(true);
                                              }
                                            }}
                                          >
          <Animated.View style={[styles.BoxwithCamera, { flex: flexValue }]}>
            <View style={styles.containercamera}>
    {cameraOpen ? (
      <>
        <CameraView
          style={styles.camera}
          zoom={0.87}
          facing="back"
          barcodeScannerEnabled
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'UPC'], // Supported barcode types
          }}
        />
        {countdown !== null && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}
        {!scanningAllowed && (
          <View style={styles.animationContainer}>
            <LottieView
              ref={animation}
              style={{ width, height: 200 }}
              source={isPressed? require('../assets/animation/vali.json') : require('../assets/animation/valired.json') }
              autoPlay
              loop // Loop this scanning animation
            />
          </View>
        )}
          {scanningAllowed && (
        <View style={styles.animationContainer}>
          <LottieView
            ref={animation}
            style={{ width, height: 600 }}
            source={require('../assets/animation/barco.json')}
            autoPlay
            loop // Loop this scanning animation
          />
        </View>
          )}
      </>
    ) : (
      <View style={styles.cameraOffView}></View> // View displayed when camera is off
    )}
             </View>
          </Animated.View>

          </FlingGestureHandler>
       </FlingGestureHandler>

          {/* Invoice Section */}


          <Animated.View style={[styles.invoiceSection, { flex: flexValue2 }]}>


            <View style={styles.buttonContainer}>
              <FlatList
                data={buttons}
                renderItem={renderButton}
                keyExtractor={(item) => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}

              />
            </View>


            <View style={styles.container2}>
              {products.length !== 0 ? (
                <FlatList
                  key={'invoice'}
                  data={products}
                  renderItem={renderProductItem}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  style={styles.productList}
                    ItemSeparatorComponent={ItemSeparator} // Add the separator component
                />
              ) : (
                <FlatList
                  key={'invoice'}
                  data={productsfree}
                  renderItem={renderProductItemFree}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  style={styles.productList}
                    ItemSeparatorComponent={ItemSeparator} // Add the separator component
                />
              )}
            </View>

        </Animated.View>



          {/* Total Section */}
          <View style={styless.ButtonCreatInvoiceContainer}>
            <Button
              style={[
                styless.creatinvoicebutton,
                {
                  backgroundColor: products.length === 0 ? '#f9f9f9' : isPressed ? '#3682B3' : '#D15D5D', // Disabled color if no products, otherwise check isPressed
                },
              ]}
              onPress={() => CreateInvoice()}
              disabled={products.length === 0} // Disable if no products
            >
              VALIDER • {totalAmount.toFixed(2)} DH TVA (20%)
            </Button>
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
         onDismiss={handlePresentModalFirstClose} // Call this function when BottomSheet is closed
       >
         <BottomSheetContent
           selectedComponent={selectedComponent}
           AddProduct={AddProduct}
           selectedItem={selectedItem}
           deleteItem={deleteItem}
           handlePresentModalFirstPress={handlePresentModalFirstPress}
           ModifyProduct={ModifyProduct}
           AddtoInvoice={handleUnknownProductfromCalculator}
           handleUnknownProductfromKeypad={handleUnknownProductfromKeypad}
           isPressed={isPressed}
           setIsPressed={setIsPressed}
           selectedClient={selectedClient}
           prefix={prefix}
           OpenProduct={OpenProduct}
           ModifyProductNoclose={ModifyProductNoclose}
           goBack={goBack}
           OpenCategory={OpenCategory}
           subcat={subcat}
           goBackCat={goBackCat}

         />
       </BottomSheetModal>
     </BottomSheetModalProvider>

        </View>


        <Animated.View style={{  justifyContent: 'center', alignItems: 'center',      bottom: bottomValue, }}>

                {selectedComponent === null && (
                <TouchableOpacity
                 style={styles.fab}
                   onPress={() => {
                  handlePresentModalFirstPress('Add');
                   }}
                  >
               <Ionicons name="add" size={width*0.1} color="white" />
              </TouchableOpacity>
              )}
        </Animated.View>





        </GestureHandlerRootView>
    </ApplicationProvider>
          </SafeAreaView>

  );
};



/// Memoized BottomSheetContent to prevent unnecessary re-renders
const BottomSheetContent = React.memo(({ goBackCat, subcat, OpenCategory, goBack, prefix, selectedComponent, OpenProduct, AddProduct, selectedItem, deleteItem, handlePresentModalFirstPress, ModifyProduct,ModifyProductNoclose, AddtoInvoice,handleUnknownProductfromKeypad,selectedClient, isPressed }) => {

  const renderContent =useCallback(() => {


    const memoizedSelectedClient = useMemo(() => {
      return selectedClient; // or create a shallow copy if needed
    }, []); // Replace with actual dependencies

    const memoizedOpenProduct = useMemo(() => {
      return OpenProduct; // or create a shallow copy if needed
    }, []); // Replace with actual dependencies

    const memoizedOpenCategory = useMemo(() => {
      return OpenCategory; // or create a shallow copy if needed
    }, []); // Replace with actual dependencies

    const memoizedgoBackCat = useMemo(() => {
      return goBackCat; // or create a shallow copy if needed
    }, []); // Replace with actual dependencies

    const memoizedgoBack = useMemo(() => {
      return goBack; // or create a shallow copy if needed
    }, []); // Replace with actual dependencies

    const memoizedAddProduct = useMemo(() => {
      return AddProduct; // or create a shallow copy if needed
    }, []); // Replace with actual dependencies


    switch (selectedComponent) {
      case 'Add':
        return <Mescodeshome isPressed={isPressed} OpenProduct={memoizedOpenProduct}  />;
      case 'SubCategory':
          return <Mescodescategoryhome isPressed={isPressed} prefix={prefix} goBack={memoizedgoBack} OpenCategory={memoizedOpenCategory} />;
      case 'Product':
          return <Mescodesproductshome isPressed={isPressed} prefix={prefix} subcat={subcat} goBackCat={memoizedgoBackCat} OpenCategory={memoizedOpenCategory} goBack={memoizedgoBack} AddProduct={memoizedAddProduct}/>;
      case 'Calculator':
              return <Calculator  AddtoInvoice={AddtoInvoice} />;
      case 'Keypad':
            return <Keypad  handleUnknownProductfromKeypad={handleUnknownProductfromKeypad} />;
      case 'Action':
        return (
          <Action
            selectedItem={selectedItem}
            deleteItem={deleteItem}
            OpenModifyItem={() => handlePresentModalFirstPress('Modify')}
            ModifyProductNoclose={ModifyProductNoclose}
          />
        );
      case 'Client':
        return (
          <Client
            isPressed={isPressed}
            selectedClient={memoizedSelectedClient}
          />
        );
      case 'Modify':
        return <NewProduct selectedItem={selectedItem} ModifyProduct={ModifyProduct} />;
      default:
        return null;
    }
  });

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      {renderContent()}
    </BottomSheetScrollView>
  );
});
const styles = StyleSheet.create({
  itemSeparator: {
    height: 10,
  },
  swipeBox: {

     backgroundColor: 'transparent',
     alignItems: 'center',
     justifyContent: 'center',
     borderRadius: 10,
     borderWidth: 1,
     borderColor: '#ccc',
   },
  fab: {
     position: 'absolute',
     right: 20,
     backgroundColor: '#E07B39',
     width: width*0.14,
     height: width*0.14,
     borderRadius: 28,
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 5,
     zIndex:1,
   },
  containertag:{
    backgroundColor :'#fff',
    marginTop: 5 ,        // Space between the icon and the tag
    borderRadius:100,
    minWidth: width*0.1,
    justifyContent:'center',
    alignItems:'center',
    maxWidth:width*0.1,
  },
  tagText: {
   fontSize: width * 0.02,        // Adjust size as needed
   color: '#a5a5a5',    // Default color for the tag

 },
  animationContainer: {
   alignItems: 'center',
   justifyContent: 'center',
   flex: 1,
 },
  countdownContainer: {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  top: 80,
  left: 0,
  right: 0,
  bottom: 0,
},
countdownText: {
  fontSize: width*0.17,
  fontWeight: 'bold',
  color: 'white',
},
  card: {
    marginBottom: 10,

  },
  clientInfoRow: {
    flexDirection: 'row', // Horizontal alignment of columns
   flexWrap: 'wrap',     // Allow wrapping of items in case of overflow
   justifyContent: 'space-between', // Space out the columns evenly


  },
  clientInfoColumn2: {
    flex: 1,              // Take up available space
    alignItems: 'center',
    justifyContent:'center',
    borderWidth:1,
    borderRadius:10,
    borderColor:'transparent',
    padding:width * 0.02,
    backgroundColor:'#f9f9f9',
    margin:2,
    minWidth:width*0.15,
  },
  contact:{
      alignItems: 'center',
      justifyContent:'center',
  },
  containercamera: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
camera: {
  width: '100%',
  height: '100%',
  position: 'absolute',
},
overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
},
darkOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Darker outside the rectangle
  zIndex: 2,  // Behind the focus rectangle but above the camera
},
focusRectangle: {
  width: width * 0.6,
  height: 100,
  borderWidth: 0.5,  // Fine red border
  borderColor: 'transparent',
  borderRadius: 10,
  backgroundColor: 'transparent',
  zIndex: 1,  // Above the dark overlay
},
roundButton: {
  position: 'absolute',
  top: 0,  // Top-right position
  right: 0,
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#FFF',  // White background for button
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
cameraOffView: {
  width: '100%',
  height: '100%',
  backgroundColor: '#333',  // Full black when camera is off
  justifyContent: 'center',
  alignItems: 'center',
},
cameraOffText: {
  fontSize: 18,
  color: 'white',
  textAlign: 'center',
},
  keyboard: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems:'center',
  },

  contentContainer:{
    flex:1,
    padding:15,
      zIndex: 10,
  },

  bottomsheetcontainer:{
    backgroundColor:'transparent',
    zIndex: 10,
  },

  backgroundcontainer:{
      backgroundColor:'white'
  },

  handlebottomsheet:{
    backgroundColor:'transparent'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex:1,
  },
  key: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 5,
    borderRadius: 300,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.2,
    height: width * 0.3,
    borderRadius: width * 0.02,
    borderWidth: width * 0.003,
    borderColor: '#666',
  },
  keyText: {
    fontSize: width * 0.05,
    color:'black',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider2: {
    marginVertical: 5,
    backgroundColor: 'transparent',
  },

  container: {
    flex: 0.965,
    backgroundColor: '#fff',
    position:'relative',
  },
  container2: {
      flex: 1,
    position:'relative',


  },

  NotificationBox: {
   position: 'absolute', // Position it absolutely to overlap other content
   top: 0, // Adjust the position as needed
   left: 0,
   right: 0,
   height: 50, // Set the height or other dimensions as required
   backgroundColor: 'green', // Background color or other styling
   zIndex: 1, // Ensure it appears above other content
 },
 popupText: {
    color: 'white',
    fontSize: 16,
  },
  cameraBox: {
    flex: 1,
    margin: width * 0.03,
    borderRadius: width * 0.2,
    borderWidth: 1,
    borderColor: 'transparent',
    width:'48%'
  },
  ButtonBox: {
    flex: 1,
    margin: width * 0.03,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: 'transparent',


  },


 invoiceSection: {

    paddingHorizontal: width * 0.03,
    paddingVertical:width * 0.02,
    backgroundColor: '#fff', // Set background color for the invoice section
    borderTopLeftRadius: width * 0.04,
    borderTopRightRadius: width * 0.04,
    position: 'relative', // Set position relative for overlapping effect
    marginTop: -width * 0.15, // Negative margin to overlap with the camera section
    // Shadow effect for the invoice section

    elevation: 1, // For Android shadow
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  date: {
    fontSize: width * 0.04,
    color: '#666',
  },
  productList: {
    marginTop: width * 0.03,
  },

  productCard: {


    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.002,
    borderColor : 'transparent',
    elevation: 1,


  },
  productCardFree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.02,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor:'transparent',
      elevation: 1,


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


  productCard1: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   padding: width * 0.03,
   marginBottom: width * 0.03,
   backgroundColor: '#fff',
   borderRadius: width * 0.02,
   borderWidth: width * 0.003,
   borderColor: '#666',
   elevation: 2,
   width: '100%', // This will make sure two cards fit in a row
 },
 cardListContent: {

},
  longPressedBackground: {

  },
  icon:{
    padding:10,
  },
  icon2:{
    padding:10,
    width:width*0.18,
    height: width * 0.18,
  },
  column00: {
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
  column000: {
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
  column0000: {
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
  column1: {
      flex: 1,
    padding: width * 0.02,
    alignItems:'left',
    justifyContent:'center',
  },
  column2: {
    flex: 0.5,
    padding: width * 0.02,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
  },
    column3: {
        flex: 0.08,
  paddingRight:10,
  justifyContent:'center',
      alignItems: 'left',
    },
  productNameFree: {
    fontSize: width * 0.030,
    fontWeight: 'bold',
    color:'#ccc9c9',
    textTransform:'uppercase'
  },
  productDetailsFree: {
    fontSize: width * 0.03,
    color: '#ccc9c9',
  },
  productName: {
  fontSize: width * 0.03,
    fontWeight: 'bold',
    textTransform:'uppercase',
  },
  productNameAction: {
    fontSize: width * 0.050,
  },
  productDetails: {
  fontSize: width * 0.025,
    color: '#999',
  },


  column0: {
    flex: 0.1,
    alignItems: 'flex-end',
    paddingHorizontal:20,
  },
  totalLabel: {
  fontSize: width * 0.02,
    color: '#666',
  },
  totalPrice: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    backgroundColor: '#3682B3',
    borderRadius: 50,
    paddingHorizontal: 10,
    color: 'white',
    textAlign: 'center',
    overflow: 'hidden',  // Ensures text is clipped within rounded borders
  },
  totalLabelFree: {
    fontSize: width * 0.02,
    color: '#ccc9c9',
  },
  totalPriceFree: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    backgroundColor: '#ccc9c9',
    borderRadius: 50,
    paddingHorizontal: 10,
    textAlign: 'center',
    overflow: 'hidden',  // Ensures text is clipped within rounded borders
    color: 'white',
  },
  totalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: width * 0.13,
    borderTopWidth: 1,
    borderTopColor: '#e4e9f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,

  },


  totalText: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  leftAction: {
    backgroundColor: 'green',

    alignItems: 'center',
    width: width * 0.25,

    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.03,
    marginBottom: width * 0.03,

    borderRadius: width * 0.02,
    borderWidth: width * 0.0005,
    borderColor: 'black',
    elevation: 2,
  },
  rightAction: {
    backgroundColor: 'red',
    alignItems: 'center',
    width: width * 0.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.03,
    marginBottom: width * 0.03,

    borderRadius: width * 0.02,
    borderWidth: width * 0.0005,
    borderColor: 'black',
    elevation: 2,
  },
  actionText: {
    color: 'white',
    fontSize: width * 0.04,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContent: {
    width: width * 0.8,
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: width * 0.03,
  },
  input: {
    width: '100%',
    padding: width * 0.03,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: width * 0.03,
  },
  picker: {
    width: '100%',
    marginBottom: width * 0.03,
  },
  buttonContainer: {
    height:60,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default HomeScreen;
