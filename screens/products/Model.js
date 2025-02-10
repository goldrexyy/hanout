import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar, Divider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import { Swipeable } from 'react-native-gesture-handler';


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



export default function Egg({ navigation, route }) {
  // State variables
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [productsNoEAN, setProductsNoEAN] = useState([]);
  const swipeableRefs = useRef(new Map());

  const productsWithoutEAN = [
   { id: '1', name: 'Egg',quantity:1, price:10, icon: 'egg-outline' },
   { id: '2', name: 'Farine',quantity:1,price:10, icon: 'bag-outline' },
   { id: '3', name: 'Patte',quantity:1,price:10, icon: 'nutrition-outline' },
   { id: '4', name: 'Épices',quantity:1, price:10, icon: 'leaf-outline' },
   { id: '5', name: 'Vegetables',quantity:1,price:10, icon: 'leaf-outline' },
   { id: '6', name: 'Legume',quantity:1,price:10, icon: 'leaf-outline' },
 ];

 useEffect(() => {
   fetchProducts();
 }, []);

 const fetchProducts = async () => {
    setProductsNoEAN(productsWithoutEAN);
  };

 const incrementQuantity2 = (id) => {
   setProductsNoEAN(prevProducts =>
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
   setProductsNoEAN(prevProducts =>
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
       <TouchableOpacity style={styles.productCard1} onPress={() => setShowCards(!showCards)}>
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
    <FlatList
      key={'productnoean'}
      data={productsNoEAN}
      renderItem={renderCardItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.cardListContent}
     />
  );
}

// Styles with responsive design
const styles = StyleSheet.create({
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
 },
 productName: {
   fontSize: width * 0.045,
   fontWeight: 'bold',
 },
 productDetails: {
   fontSize: width * 0.04,
   color: '#666',
 },
 column2: {
   flex: 0.25,
   alignItems: 'flex-end',
 },
 column3: {
   flex: 0.1,
   alignItems: 'flex-end',
 },
 column0: {
   flex: 0.1,
   alignItems: 'flex-end',
   paddingHorizontal:20,
 },
 totalLabel: {
   fontSize: width * 0.035,
   color: '#666',
 },
 totalPrice: {
   fontSize: width * 0.045,
   fontWeight: 'bold',
 },
});
