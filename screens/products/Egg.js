import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar, Divider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import { Swipeable } from 'react-native-gesture-handler';


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



export default function Egg({ AddProduct, item }) {
  // State variables
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [productsNoEAN, setProductsNoEAN] = useState([]);
  const swipeableRefs = useRef(new Map());

  const productsWithoutEAN = [
   { id: '1', name: 'Egg',brand:'', quantity:1,price:2, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'', icon: 'egg-outline' },
   { id: '2', name: 'Plateau Egg',brand:'', quantity:1,price:30, stock:0, nearbySolde:12, timesSold:50, avatar:'', ean:'', icon: 'egg-outline' },
 ];

 useEffect(() => {
   fetchProducts();
 }, []);

 const fetchProducts = async () => {
    setProductsNoEAN(productsWithoutEAN);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsWithoutEAN);

  const searchText = (value) => {
    setSearchTerm(value);  // Update the search term

    if (value) {
      // Filter products if there is a search term
      const filtered = productsNoEAN.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);  // Update the filtered list
    } else {
      // If search term is empty, reset to initial data
      setFilteredProducts(productsWithoutEAN);
    }
  };

 const incrementQuantity2 = (id) => {
   setFilteredProducts(prevProducts =>
     prevProducts.map(item =>
       item.id === id ? { ...item, quantity: item.quantity + 0.5 } : item
     )
   );

   const swipeRef = swipeableRefs.current.get(id);
   if (swipeRef) {
     swipeRef.close(); // Close swipeable after action
   }
 };

 const dincrementQuantity2 = (id) => {
   setFilteredProducts(prevProducts =>
     prevProducts.map(item =>
       item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 0.5 } : item
     )
   );

   const swipeRef = swipeableRefs.current.get(id);
   if (swipeRef) {
     swipeRef.close(); // Close swipeable after action
   }
 };

 const renderCardItem = ({ item }) => {
   // Calculate the total price with two decimal places
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
           swipeableRefs.current.set(item.id, ref); // Store the Swipeable reference
         }
       }}
       renderLeftActions={renderLeftActions} // Function to render left swipe actions
       onSwipeableRightWillOpen={() => dincrementQuantity2(item.id)} // Decrease quantity when swiped right
       renderRightActions={renderRightActions} // Function to render right swipe actions
       onSwipeableLeftWillOpen={() => incrementQuantity2(item.id)} // Increase quantity when swiped left
       friction={1}
     >
       <TouchableOpacity style={styles.productCard1} onPress={() => AddProduct(item)}>
         <View style={styles.column0}>
           {/* Icon for the product */}
           <Ionicons name={item.icon} size={width * 0.1} />
         </View>

         <View style={styles.column1}>
           {/* Product name */}
           <Text style={styles.productName}>{item.name}</Text>
           {/* Product details */}
           <Text style={styles.productDetails}>
             Qty: <Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text> / Price: {item.price}
           </Text>
         </View>

         <View style={styles.column2}>
           {/* Total price label */}
           <Text style={styles.totalLabel}>Total</Text>
           {/* Display total price */}
           <Text style={styles.totalPrice}>{totalPrice} DH</Text>
         </View>
       </TouchableOpacity>
     </Swipeable>
   );
 };



  return (
    <View style={styles.container2}>
      <TextInput style={styles.searchInput} placeholder="Search..." value={searchTerm} onChangeText={searchText} />
      <Divider style={styles.divider2} />
    <FlatList
      key={'productnoean'}
      data={filteredProducts}
      renderItem={renderCardItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.cardListContent}
     />
     </View>
  );
}

// Styles with responsive design
const styles = StyleSheet.create({
  searchInput: {
    height: 40,  // Set a fixed height
    borderRadius: width * 0.02,
    borderWidth: width * 0.003,
    borderColor: '#666',
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#F6F6F6',
    fontSize: width * 0.04,
    flexShrink: 0,  // Prevent shrinking
  },
  divider2: {
    marginVertical: 5,
    backgroundColor: '#E4E9F2',
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
 column1: {
   flex: 0.65,
   paddingLeft:width * 0.04,
 },
 column2: {
   flex: 0.25,
   alignItems: 'center',
 },
 column0: {
   flex: 0.2,
   alignItems: 'flex-end',
 },
 productName: {
   fontSize: width * 0.045,
   fontWeight: 'bold',
 },
 productDetails: {
   fontSize: width * 0.04,
   color: '#666',
 },

 column3: {
   flex: 0.1,
   alignItems: 'flex-end',
 },

 totalLabel: {
   fontSize: width * 0.035,
   color: '#666',
 },
 totalPrice: {
   fontSize: width * 0.045,
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
 container2: {
   backgroundColor: '#F6F6F6',
   position:'relative',
   padding:10,
 },
});
