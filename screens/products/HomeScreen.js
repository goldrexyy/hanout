import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity, Dimensions, Picker, ActivityIndicator , Animated  ,TextInput , ImageBackground, ScrollView} from 'react-native';
import { ApplicationProvider, Text, Button , Modal, Divider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import InvoiceSettingsModal from './InvoiceSettingsModal'; // Adjust the import path as necessary
import Alert from './Alert';
import ModalProduct from './ModalProduct';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Menu from './products/Menu';
import Egg from './products/Egg';
import LoadingScreen from './LoadingScreen'; // Import your LoadingScreen
import UnKnowProduct from './products/UnKnowProduct';
import MarocTelecom from './products/MarocTelecom';
import Orange from './products/Orange';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';
import NewProduct from './product/NewProduct';

SplashScreen.preventAutoHideAsync();




// Fetch device dimensions for responsive design
const { width, height } = Dimensions.get('window');




// Main Component
export default function App({ onPressStateChange }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [products, setProducts] = useState([]);

  const db = useSQLiteContext();
  const [loading, setLoading] = useState(false);
  const [longPressId, setLongPressId] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const swipeableRefs = useRef(new Map());
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const [isModalProductVisible, setModalProductVisible] = useState(false);
  const [productData, setProductData] = useState("Sample Data");
  const [compagnyName, setCompagnyName] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(); // Format: MM/DD/YYYY or based on locale
  const hours = currentDate.getHours().toString().padStart(2, '0');  // Gets hours in 24-hour format
  const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // Gets minutes
  const formattedTime = `${hours}:${minutes}`;
  const [newInvoiceId, setNewInvoiceId] = useState('');
  const [showCards, setShowCards] = useState(false);
  const [eggCards, setEggCards] = useState(false);
  const [maroctelecomCards, setMarocTelecomCards] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const productsfree = [
   { id: '1686876', name: 'Votre produit..',brand:'', quantity:1,price:0, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1105', icon: 'call-outline' },
   { id: '867672', name: 'Votre produit ..',brand:'', quantity:1,price:0, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1110', icon: 'call-outline' },
 ];
  const productsWithoutEAN = [
   { id: '1686876', name: 'Recharge 5Dh',brand:'', quantity:1,price:5, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1105', icon: 'call-outline' },
   { id: '867672', name: 'Recharge 10Dh',brand:'', quantity:1,price:10, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1110', icon: 'call-outline' },
   { id: '86786763', name: 'Recharge 20Dh',brand:'', quantity:1,price:20, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1120', icon: 'call-outline' },
   { id: '7867864', name: 'Recharge 50Dh',brand:'', quantity:1,price:50, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1150', icon: 'call-outline' },
   { id: '578687687', name: 'Recharge 100Dh',brand:'', quantity:1,price:100, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1100', icon: 'call-outline' },
   { id: '7867868766', name: 'Recharge 200Dh',brand:'', quantity:1,price:200, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'1200', icon: 'call-outline' },
 ];
  const debounceTimeout = useRef(null);
  const invoice = {
   idunique: '',
   compagnyname:'',
   custumername:'',
   dueTime: '',
   dueDate: '',
   products: [],
   subtotal: 350,
   taxRate: 0.20,
   taxAmount: 70,
   paid:true,
   clientid:null,
   total: 420,
 };
  const [showAlert, setShowAlert] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(true);
  const [keypadOpen, setKeyPadOpen] = useState(false);
  const [sound, setSound] = useState();
  const [editingId, setEditingId] = useState(null);  // Track which item is being edited
  const [newPrice, setNewPrice] = useState(0);
  const bottomSheetRef = useRef(null);
  const bottomSheetRefAction = useRef(null);

  const [isBottomOpened, setIsBottomOpened] = useState(false);
  const [isBottomOpenedAction, setIsBottomOpenedAction] = useState(false);

  const [codesData, setCodesData] = useState([]);
  const [codesDataMap, setCodesDataMap] = useState(new Map());
  const [scannedCode, setScannedCode] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [unKnowCodes, setUnKnowCodes] = useState(null);
  const inputRef2 = useRef(null);  // Reference for TextInput
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const {facing, setFacing} = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isPressed, setIsPressed] = useState(true);
  const [isModifyMode, setIsModifyMode] = useState(false); // Track if in modify mode
  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points

  const [scanningAllowed, setScanningAllowed] = useState(true);



  // Toggle camera visibility
   const toggleCamera = () => {
     setCameraOpen((prev) => !prev);
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
//Open
const expandBottomSheet = () => {
  bottomSheetRef.current?.expand();
//  setTimeout(() => {
  //     inputRef2.current.focus(); // Focus the input after 500ms
    // }, 50); // Adjust the delay time as needed (500ms = half a second)
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
     setIsFocused(false);  // Set focus state to false
     ResetMenu();
     setKeyPadOpen(false);       // Call ResetMenu when focused and pressed
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


   const expandBottomSheetAction = (item) => {
    setSelectedItem(item); // Store the selected item
     bottomSheetRefAction.current?.expand();
   //  setTimeout(() => {
     //     inputRef2.current.focus(); // Focus the input after 500ms
       // }, 50); // Adjust the delay time as needed (500ms = half a second)
     setIsBottomOpenedAction(true);
   };

     // Close
     const closeBottomSheetAction = () => {

        bottomSheetRefAction.current?.close();
        setSnapPoint(['25%']); // Set snap point to 75%
        setIsModifyMode(false); // Set to modify mode to show <AddProduct>
        setIsBottomOpenedAction(false);
      };

      const handleChangeAction = () => {
        setIsBottomOpenedAction(true);
        closeBottomSheetAction();
     //      setShowCards(false); // Reset menu (or hide cards) when focused
        setIsFocused(false);  // Set focus state to false
        ResetMenu();
        setKeyPadOpen(false);       // Call ResetMenu when focused and pressed
       };


  useEffect(() => {
    // Check if invoiceSent parameter is true
    if (route.params?.invoiceSent) {
      setProducts([]);
      handleAction();
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
       const asset = Asset.fromModule(require('../assets/codes.csv'));
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




   const handleEditPrice = (item) => {
      setEditingId(item.id);   // Set the currently editing item's ID
      setNewPrice(''); // Prepopulate the TextInput with the current price
      setIsEditing(true);
      setTimeout(() => {
      inputRef.current?.focus(); // Focus on TextInput when entering edit mode
    }, 0);


    };
   // Handle saving the new price
const handleSavePrice = (id) => {
  const updatedProducts = products.map(product => {
    if (product.id === id) {
      return { ...product, price: newPrice };  // Update price for the correct product
    }
    return product;
  });
  setProducts(updatedProducts);  // Update the products array
  setEditingId(null);
  setIsEditing(false);          // Exit edit mode
};

const handlePress = () => {
  if (products.length > 0) {
    const newPressedState = !isPressed; // Toggle state
    setIsPressed(newPressedState); // Update local state
    onPressStateChange(newPressedState); // Send state to parent
  }
};
 const handleCodeCheck = () => {
    // Check if the input value matches any product in the "database"
    const foundProduct = productsWithoutEAN.find(product => product.ean === inputValue);
    if (foundProduct) {
      AddProduct(foundProduct);
      console.log(`Code exists! Product name: ${foundProduct.name}`);
      // Perform any action you want here when a match is found
    } else {
      console.log('Code does not exist.');
    }
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

 const fetchProducts = async () => {

  };
 const fetchLatestInvoice = async () => {
      try {
        // Fetch the latest facture using query parameters
        const response = await axios.get('http://localhost:3000/factures?_sort=id&_order=desc&_limit=1');
        const factures = response.data;


        if (factures.length > 0) {
          const latestFacture = factures[0]; // Get the latest facture
          console.log('last facture', factures[0].idunique);
          // Extract the last idunique
          const lastIdUnique = latestFacture.idunique;


          // Extract the numeric part of the idunique (e.g., "123456" from "INV123456")
          const idNumber = parseInt(lastIdUnique.replace('INV', ''), 10);

          // Increment the number by 1
          const newIdNumber = idNumber + 1;

          // Form the new idunique (e.g., "INV123457")
          const newIdUnique = `INV${newIdNumber}`;

          // Set the new idunique to the state (or use it directly)
          setNewInvoiceId(newIdUnique);

          console.log(`New Invoice ID: ${newIdUnique}`);
        }
      } catch (error) {
        console.error('Error fetching the latest facture:', error);
      }
    };


 if (loading) {
   return <LoadingScreen />; // Display the loading screen
  }

// Create Invoice
  const CreateInvoice = () => {
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

   invoice.idunique = newInvoiceId;
   invoice.products = products;
   invoice.total = getTotalAmount();
   invoice.compagnyname = compagnyName;
   invoice.custumername = 'Yassine Jennane';
   invoice.dueDate = formattedDate;
   invoice.dueTime = formattedTime;
   invoice.userid = userId;
   invoice.isPaid = isPressed;
   console.log('compagny name', invoice.idunique);
   navigation.navigate("Invoice",{ invoice } );

 };

 // Modal produit
  const openModalProduct = (product) => {
    setProductData(product);
    console.log('product selected :', productData )
    setModalProductVisible(true);
  };

  const closeModalProduct = () => {
    setModalProductVisible(false);
  };

  const handleUpdate = (updatedProduct) => {
  setProducts(prevProducts =>
    prevProducts.map(product =>
      product.id === updatedProduct.id
        ? { ...product, ...updatedProduct }
        : product
    )
  );

};

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

  // Function to calculate total amount for all products
  const getTotalAmount = () => {
    return products.reduce((acc, product) => acc + (product.quantity * product.price), 0);
  };

  // Function to calculate total length for all products
  const getLengthItem = () => {
    return itemCount = products.length;
  };

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
    closeBottomSheetAction();

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
        friction={1}
      >
        <TouchableOpacity
          style={[styles.productCardFree, longPressId === item.id && styles.longPressedBackground]}
          onPressIn={() => handleLongPressStart(item.id)}
          onPressOut={handleLongPressEnd}
        >
        <View style={styles.column000}>
          <Ionicons name="cube" size={width * 0.1} color='white' style={styles.icon} />
        </View>
          <View style={styles.column1}>
            <Text style={styles.productNameFree}>{item.name}</Text>
            <Text style={styles.productDetailsFree}>
              Qty: {item.quantity} / Price: {item.price}
            </Text>
          </View>
          <View style={styles.column2}>
            <Text style={styles.totalLabelFree}>Total</Text>


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
                  <Text style={styles.totalPriceFree}>{totalPrice} DH</Text>
                    )}

          </View>
          <View style={styles.column3}>
              {editingId === item.id ? (
    <Ionicons
      name="checkmark-circle-sharp"
      size={isEditing ? width * 0.13 : width * 0.06}
      color="green"
      onPress={() => {
        handleSavePrice(item.id, newPrice); // Save the price
        handleEditPrice(false);     // Exit editing mode
      }}
    />
  ) : (
    <Ionicons
      name="reorder-four"
      size={width * 0.06}
      color="#ccc9c9"

    />
  )
}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  // Render function for each product item in the list
  // Render function for each product item in the list
  const renderProductItem = ({ item }) => {
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
          onPress={() => expandBottomSheetAction(item)} // Enter editing mode
          onPressIn={() => handleLongPressStart(item.id)}
          onPressOut={handleLongPressEnd}
        >
        <View
  style={[
    styles.column00,
    {backgroundColor: item.price === 0 ? '#a5a5a5' : isPressed ? '#3682B3' : '#D15D5D' }, // Conditional background color
  ]}
>
  <Ionicons
    name={item.price === 0 ? 'add' : 'cube'} // Conditional icon
    size={width * 0.1}
    color="white"
    style={styles.icon}
  />
</View>
          <View style={styles.column1}>
            <Text style={styles.productName}>{item.name}</Text>
            {item.name === 'Produit non reconnu' && (
              <Text style={styles.productDetails}>{item.ean}</Text>
             )}
            <Text style={styles.productDetails}>
              Qty: <Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text> / Price: {item.price}
            </Text>
          </View>

          <View style={styles.column2}>
            <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>{totalPrice} DH</Text>
          </View>

          <View style={styles.column3}>
            <Ionicons
              name="reorder-four"
              size={width * 0.06}
              color="#666"
              onPress={() => expandBottomSheetAction(item)} // Enter editing mode
            />
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };


  //Reset Menu
  const ResetMenu = () => (
   setShowCards(false),
   setSelectedComponent(false),
   setEggCards(false),
   setInputValue(''),
   setIsFocused(false)
  );

  //OpenComponent
  const OpenProduct = (productName) => {
  if (productName === 'Egg') {
    setSelectedComponent('Egg');
    setKeyPadOpen(false);
  } else if ((productName === 'Maroc Telecom')) {
    setKeyPadOpen(false);
    setSelectedComponent('MarocTelecom');
  } else if ((productName === 'Orange')) {
    setKeyPadOpen(false);
    setSelectedComponent('Orange');
  }
};

  const handleButtonPress = (value) => {
    inputRef.current.focus();
    setInputValue((prevValue) => prevValue + value);

  };

  const handleClear = () => {
  setInputValue('');
  inputRef.current.focus();
  };

 const handleDelete = () => {
   setInputValue((prevValue) => prevValue.slice(0, -1));
   inputRef.current.focus();
 };

 const Keepfocused = () => {
    inputRef.current.focus();
  };


  const handleBarcodeRead = (event) => {
    setInputValue(event.data); // Assuming `event.data` contains the scanned EAN
    handleCodeCheck(); // Call your function to check the code
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

  // Log the scanned data for debugging
  console.log("Scanned Code: ", data);

  // Find the row in codesData that matches the scanned data
  const foundRow = codesDataMap.get(data.trim().toLowerCase());

  if (foundRow) {
    // If the code exists in codesData, proceed to check products
    await AddProductafterScan(foundRow); // Call the function to handle known product
    console.log("Found product: ", foundRow.codes);
  } else {
    // Handle unknown product logic as before
    handleUnknownProduct(data);
  }

  // Allow scanning again after a delay (e.g., 1 second)
  setTimeout(() => {
    setScanningAllowed(true);
  }, 1000); // Adjust the delay as necessary
};

const handleUnknownProduct = (data) => {
  const unknownProductIndex = products.findIndex(product => product.ean === data && product.name === 'Produit non reconnu');

  if (unknownProductIndex !== -1) {
    // If "Produit non reconnu" exists, increment its quantity
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[unknownProductIndex].quantity += 1; // Increment quantity by 1
      return updatedProducts;
    });
    playSounderror();
  } else {
    // If it doesn't exist, add a new unknown product
    setProducts(prevProducts => [
      {
        id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Ensure unique ID
        name: 'Produit non reconnu',
        brand: '',
        quantity: 1,
        price: 0,
        stock: 0,
        nearbySold: 0,
        timesSold: 0,
        avatar: '',
        ean: data, // Use scanned data as EAN
        exists: false // Set exists property for unknown products
      },
      ...prevProducts // Add new product at the beginning
    ]);
    playSounderror();
  }

  setUnKnowCodes(data);
  setSelectedComponent('unknow');
  setSearchResult(null);
  console.log("No matching row found.");
};

const AddProductafterScan = async (item) => {
  // Check if the product already exists based on EAN
  const existingProductIndex = products.findIndex(product => product.ean === item.codes);
  console.log('Product code: ', item.codes);

  if (existingProductIndex !== -1) {
    // If the product exists, update its quantity
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[existingProductIndex].quantity += 1; // Increment quantity by 1
      return updatedProducts;
    });
    playSound();
  } else {
    // If the product doesn't exist, add it as a new product
    setProducts(prevProducts => [
      {
        id: prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1, // Ensure unique ID
        name: item.name,
        brand: item.codes,
        quantity: 1,
        price: item.price,
        stock: 0,
        nearbySold: 0,
        timesSold: 0,
        avatar: '',
        ean: item.codes, // Use item.codes as EAN
        exists: true // Set exists property for known products
      },
      ...prevProducts // Add new product at the beginning
    ]);
    playSound();
  }

  // Reset other states and UI as necessary
};


  //AddProduct
  const AddProduct = (item) => {
  //handleAction();
  setProducts(prevProducts => [
    { id: prevProducts.length + 1,
      name: item.name,
      brand: item.brand,
      quantity: item.quantity,
      price: item.price,
      stock: item.stock,
      nearbySold: item.nearbySold,
      timesSold: item.timesSold,
      avatar: item.avatar,
      ean: item.ean
    },
    ...prevProducts // Add new product at the beginning
  ]);
  ResetMenu();
  setIsFocused(false);
  setKeyPadOpen(false);
  setIsBottomOpened(false);
  closeBottomSheet();
    playSound();

  if (inputRef.current) {
        inputRef.current.blur(); // Blur the input field
  }
};

  const closeModalSetting = () => {
  ResetMenu();
  setIsFocused(false);
  };

  const handleAction = () => {
      setShowAlert(true);
  };

  const handleDismiss = () => {
   setShowAlert(false); // Reset the alert state to allow future alerts
 };

 const focusInput = () => {
  setIsFocused(!isFocused);
  if (inputRef.current) {
    inputRef.current.focus();  // Programmatically focus the input
  }
};

const OpenModifyItem = () => {
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
  flex: 0.38,

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








  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/* Notification Section */}
          {/* Camera Section */}

         <View style={styless.BoxwithCamera} >
            <View style={styles.containercamera}>
   {cameraOpen ? (
     <>
       {/* Camera View */}
       <CameraView
         style={styles.camera}
         facing="back" // Specify camera direction (back or front)
         barcodeScannerEnabled
         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
         barcodeScannerSettings={{
           barcodeTypes: ['ean13', 'ean8'],
         }}
       />
     </>
   ) : (
     <View style={styles.cameraOffView}></View>
   )}
            </View>
         </View>

          {/* Invoice Section */}
          <View style={styles.invoiceSection}>
          <View style ={styles.card} >
            <View style={styles.clientInfoRow}>


            {/* Column 3: Total Paid */}
            <View
         style={styles.clientInfoColumn2}
       >
         <TouchableOpacity style={styles.contact} onPress={toggleCamera}>
         <Ionicons
name="camera-outline"
size={width * 0.08}
color={
cameraOpen
? isPressed
? '#3682B3' // Blue if pressed
: '#D15D5D' // Red if not pressed
: '#a5a5a5' // Gray icon when products.length is 0
}
/>
         </TouchableOpacity>
       </View>

       <View  style={[
          styles.clientInfoColumn2,
          { backgroundColor: isFocused ? '#3682B3' : '#f9f9f9' }, // Conditional background color
        ]}>
<TouchableOpacity
 style={styles.contact}
 onPress={() => {
   if (!isFocused) {
     expandBottomSheet();
     setIsBottomOpened(true);
     setIsFocused(true);
     setKeyPadOpen(false);
   } else {
     closeBottomSheet();
     setIsBottomOpened(true);
     setIsFocused(false);
     ResetMenu();
     setKeyPadOpen(false);
   }
 }}
>
 <Ionicons
   name="cube-outline"
   size={width * 0.08}
   color={isFocused ? '#fff' : '#a5a5a5'} // Conditional icon color
 />
</TouchableOpacity>
</View>
              {/* Column 4: Total Unpaid */}
              <View style={styles.clientInfoColumn2}>
                <TouchableOpacity  style={styles.contact}  >
                  <Ionicons name="keypad-outline" size={width * 0.08} color="#a5a5a5"/>
               </TouchableOpacity>
              </View>


                          <View
                            style={styles.clientInfoColumn2}
                          >
                            <TouchableOpacity
                              style={styles.contact}
                              onPress={products.length > 0 ? handlePress : null} // Only attach the press handler if products.length === 0
                            >
                            <Ionicons
  name="receipt-outline"
  size={width * 0.08}
  color={
    products.length > 0
      ? isPressed
        ? '#3682B3' // Blue if pressed
        : '#D15D5D' // Red if not pressed
      : '#a5a5a5' // Gray icon when products.length is 0
  }
/>
                            </TouchableOpacity>
                          </View>

              <View style={styles.clientInfoColumn2}>
                <TouchableOpacity  style={styles.contact}  >
                  <Ionicons name="people-outline" size={width * 0.08} color="#a5a5a5"/>
               </TouchableOpacity>
              </View>



              <View  style={
                 styles.clientInfoColumn2}>
                <TouchableOpacity  style={styles.contact} onPress={() =>  setProducts([])} >
                <Ionicons
name="trash-outline"
size={width * 0.08}
color={
products.length > 0
? isPressed
? '#3682B3' // Blue if pressed
: '#D15D5D' // Red if not pressed
: '#a5a5a5' // Gray icon when products.length is 0
}
/>
               </TouchableOpacity>
              </View>
            </View>
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

    />
  ) : (
    <FlatList
      key={'invoice'}
      data={productsfree}
      renderItem={renderProductItemFree}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      style={styles.productList}

    />
  )}

            </View>
         </View>
          {/* Total Section */}


          <View style={styless.ButtonCreatInvoiceContainer}>

          <Button
        style={[
          styless.creatinvoicebutton,
          {
            backgroundColor: products.length === 0 ? '#f9f9f9' : (isPressed ? '#3682B3' : '#D15D5D'), // Disabled color if no products, otherwise check isPressed
          },
        ]}
        onPress={() => CreateInvoice()}
        disabled={products.length === 0} // Disable if no products
      >
      VALIDER • {getTotalAmount().toFixed(2)} DH TVA (20%)
      </Button>

          </View>
          <View style={styles.containera}>
            <Alert message="Action Completed!" visible={showAlert} onDismiss={handleDismiss}/>
         </View>




         <BottomSheet
     ref={bottomSheetRef}
     index={-1} // Starts closed
     snapPoints={['75%']}
     enableContentPanningGesture={true}
     enableHandlePanningGesture={true}
     backgroundStyle={styles.backgroundcontainer}
     style={styles.bottomsheetcontainer}
     handleStyle={styles.handlebottomsheet}
     enablePanDownToClose={true} // Allow closing by dragging down
      backdropComponent={renderBackdrop}
      onChange={(index) => {
       if (index !== 0) {
        handleChange();
     }
  }}
   >

   <BottomSheetView style={styles.contentContainer}>


   {selectedComponent === '' ? (
     <Menu OpenProduct={OpenProduct} />
   ) : selectedComponent === 'unknow' ? (
     <UnKnowProduct codes= {unKnowCodes} AddProduct={AddProduct} inputRef2={inputRef2} />
   ) : selectedComponent === 'Egg' ? (
     <Egg AddProduct={AddProduct} />
   ) : selectedComponent === 'MarocTelecom' ? (
     <MarocTelecom AddProduct={AddProduct} />
   ) : selectedComponent === 'Orange' ? (
     <Orange AddProduct={AddProduct} />
   ) : selectedComponent === 'Setting' ? (
     <InvoiceSettingsModal onClose={closeModalSetting} />
   ) : keypadOpen ? (
     <View style={styles.container2}>
       <TextInput
         style={stylessearch.searchInput}
         value={inputValue}
         placeholder="Enter products code"
         showSoftInputOnFocus={false}
         ref={inputRef} // Attach ref to TextInput
       />
       <Divider style={styles.divider2} />
       <TouchableOpacity onPress={() => Keepfocused()}>
         <View style={styles.keyboard}>
           <View style={styles.row}>
             {[1, 2, 3].map((num) => (
               <TouchableOpacity key={num} style={styles.key} onPress={() => handleButtonPress(num.toString())}>
                 <Text style={styles.keyText}>{num}</Text>
               </TouchableOpacity>
             ))}
             <TouchableOpacity style={styles.key} onPress={handleDelete}>
               <Text style={styles.keyText}>⌫</Text>
             </TouchableOpacity>
           </View>

           <View style={styles.row}>
             {[4, 5, 6, 0].map((num) => (
               <TouchableOpacity key={num} style={styles.key} onPress={() => handleButtonPress(num.toString())}>
                 <Text style={styles.keyText}>{num}</Text>
               </TouchableOpacity>
             ))}
           </View>

           <View style={styles.row}>
             {[7, 8, 9].map((num) => (
               <TouchableOpacity key={num} style={styles.key} onPress={() => handleButtonPress(num.toString())}>
                 <Text style={styles.keyText}>{num}</Text>
               </TouchableOpacity>
             ))}
             <TouchableOpacity style={styles.key} onPress={handleClear}>
               <Text style={styles.keyText}>C</Text>
             </TouchableOpacity>
           </View>
         </View>
       </TouchableOpacity>
     </View>
   ) :    <Menu OpenProduct={OpenProduct} />}


 </BottomSheetView>

     {/* Bottom Sheet Content */}
   </BottomSheet>


            <BottomSheet
        ref={bottomSheetRefAction}
        index={-1} // Starts closed
        snapPoints={snapPoint}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        backgroundStyle={styles.backgroundcontainer}
        style={styles.bottomsheetcontainer}
        handleStyle={styles.handlebottomsheet}
        enablePanDownToClose={true} // Allow closing by dragging down
         backdropComponent={renderBackdrop}
         onClose={() => {
   setIsBottomOpenedAction(false); // Example of setting a state when closed
   setSnapPoint(['25%']); // Set snap point to 75%
    setIsModifyMode(false); // Set to modify mode to show
 }}

      >

      <BottomSheetView >
         {/* Conditional Rendering based on isModifyMode */}
         {!isModifyMode ? (
           <>
             {/* Action Buttons for Modify or Delete */}
             <TouchableOpacity style={styles.ActionBottom} onPress={() => OpenModifyItem()}>
               <View style={styles.column0000}>
                 {selectedItem ? (
                   selectedItem.exists ? (
                     <Ionicons name="options" size={width * 0.08} style={styles.icon} />
                   ) : (
                     <Ionicons name="add" size={width * 0.08} style={styles.icon} />
                   )
                 ) : null}
               </View>
               <View style={styles.column1}>
                 <Text style={styles.productNameAction}>
                   {selectedItem ? (selectedItem.exists ? 'Modifier ce produit' : 'Ajouter ce produit') : ''}
                 </Text>
               </View>
             </TouchableOpacity>

             <TouchableOpacity style={styles.ActionBottom} onPress={() => deleteItem(selectedItem.id)}>
               <View style={styles.column0000}>
                 <Ionicons name="trash" size={width * 0.08} color='#D15D5D' style={styles.icon} />
               </View>
               <View style={styles.column1}>
                 <Text style={[styles.productNameAction, { color: '#D15D5D' }]}> Supprimer ce produit</Text>
               </View>
             </TouchableOpacity>
           </>
         ) : (

           <NewProduct selectedItem={selectedItem} />
         )}
       </BottomSheetView>

      </BottomSheet>


        </View>
      </SafeAreaView>
    </ApplicationProvider>
  );
};

// Stylesheet with Dimension-based adjustments for better compatibility
const styles = StyleSheet.create({
  countdownContainer: {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
countdownText: {
  fontSize: 72,
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
    borderWidth:1,
    borderRadius:10,
    borderColor:'transparent',
    padding:width * 0.02,
    backgroundColor:'#f9f9f9',
    margin:2,

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
  backgroundColor: '#191919',  // Full black when camera is off
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
    flex: 0.95,
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
    flex: 0.57,
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
    justifyContent: 'space-between',
    marginBottom: width * 0.02,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor:'#666',

  },
  productCardFree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.02,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.003,
    borderColor:'#ccc9c9',


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
  column00: {
    backgroundColor:'#3682B3',
    alignItems:'center',
    justifyContent:'center',
  },
  column000: {
    backgroundColor:'#a5a5a5',
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
    flex: 0.3,
    padding: width * 0.02,
    alignItems:'left',
    justifyContent:'center',
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
  },
  productDetailsFree: {
    fontSize: width * 0.03,
    color: '#ccc9c9',
  },
  productName: {
    fontSize: width * 0.030,
    fontWeight: 'bold',
  },
  productNameAction: {
    fontSize: width * 0.050,
  },
  productDetails: {
    fontSize: width * 0.03,
    color: '#666',
  },


  column0: {
    flex: 0.1,
    alignItems: 'flex-end',
    paddingHorizontal:20,
  },
  totalLabel: {
    fontSize: width * 0.03,
    color: '#666',
  },
  totalPrice: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  totalLabelFree: {
    fontSize: width * 0.03,
    color: '#ccc9c9',
  },
  totalPriceFree: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#ccc9c9',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});
