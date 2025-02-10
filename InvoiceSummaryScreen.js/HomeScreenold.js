import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView ,View, FlatList, TouchableOpacity , PermissionsAndroid , Dimensions } from 'react-native';
import {ApplicationProvider, Text, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';






const Home = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Bluetooth Headphones', quantity: 2, price: 89.99 },
{ id: '2', name: '4K Ultra HD TV', quantity: 1, price: 499.99 },
{ id: '3', name: 'Smartphone', quantity: 3, price: 699.99 },
{ id: '4', name: 'Laptop', quantity: 1, price: 1199.99 },
{ id: '5', name: 'Coffee Maker', quantity: 4, price: 49.99 },
{ id: '6', name: 'Electric Toothbrush', quantity: 5, price: 29.99 },
{ id: '7', name: 'Smartwatch', quantity: 2, price: 199.99 },
{ id: '8', name: 'Wireless Mouse', quantity: 6, price: 25.99 },
{ id: '9', name: 'Portable Speaker', quantity: 3, price: 59.99 }
  ]);
  const [longPressId, setLongPressId] = useState(null);
const [pressTimer, setPressTimer] = useState(null);
const { height } = Dimensions.get('window');









const getTotalAmount = () => {
   return products.reduce((acc, product) => acc + (product.quantity * product.price), 0);
 };
 const swipeableRefs = useRef(new Map());


  const deleteItem = (id) => {
    setProducts((prevProducts) => prevProducts.filter((item) => item.id !== id));

  };



  const handleLongPressStart = (id) => {
     const timer = setTimeout(() => {
       setLongPressId(id);
       deleteItem(id);
     }, 1000); // 3000ms = 3 seconds
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

  const incrementQuantity = (id) => {
   setProducts((prevProducts) =>
     prevProducts.map((item) =>
       item.id === id ? { ...item, quantity: item.quantity + 0.5 } : item
     )
   );
    const swipeRef = swipeableRefs.current.get(id);
     if (swipeRef) {
         console.log('works');
       swipeRef.close(); // Close the swipeable after action
     };
 };

 const dincrementQuantity = (id) => {
  setProducts((prevProducts) =>
    prevProducts.map((item) =>
    item.id === id ? (item.quantity > 0 ? { ...item, quantity: item.quantity - 0.5 } : item) : item
    )
  );

   const swipeRef = swipeableRefs.current.get(id);
    if (swipeRef) {
        console.log('works');
      swipeRef.close(); // Close the swipeable after action
    };
};



  const handleBarCodeScanned = ({ data }) => {
    console.log(`EAN code scanned: ${data}`);
    // Here you can add the logic to fetch product details using the EAN code.
  };





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
    return (
      <Swipeable
      ref={(ref) => {
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
          style={[
            longPressId === item.id && styles.longPressedBackground,
          ]}
          onPressIn={() => handleLongPressStart(item.id)}
          onPressOut={handleLongPressEnd}
        >
      <View style={styles.productCard}>
        <View style={styles.column1}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDetails}>
            Quantity:<Text style={{ fontWeight: 'bold' }}> {item.quantity}</Text> / Price: {item.price} dirham
          </Text>
        </View>
        <View style={styles.column2}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{totalPrice} dirham</Text>
        </View>
      </View>
      </TouchableOpacity>
      </Swipeable>
    );
  };



  return (
      <ApplicationProvider {...eva} theme={eva.light}>
 <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      {/* Camera section - 33% */}
      <View style={styles.cameraBox}>

       </View>

      {/* Invoice section - 67% */}
      <View style={styles.invoiceSection}>
        {/* Title and Date */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>List of Products</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {/* Products List */}
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          style={styles.productList}
          contentContainerStyle={styles.productListContent}
        />

        <View style={styles.totalContainer}>
         <Text style={styles.totalText}>Total of All Products</Text>
         <Text style={styles.totalAmount}>{getTotalAmount().toFixed(2)} dirham</Text>

         <Button  status='danger'>Create Invoice</Button>
       </View>


      </View>
    </View>
     </SafeAreaView>
       </ApplicationProvider>
  );
};

const styles = StyleSheet.create({

  containerPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  textPopup: {
    color: 'black',
    fontSize: 16,
  },

  productCard1: {
  flexDirection: 'row',
  padding: 10,
  backgroundColor: '#fff',
  marginBottom: 10,
  borderRadius: 8,
  elevation: 2,
},
  longPressedBackground: {
    backgroundColor: 'red', // Color for long press
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  leftAction: {
    backgroundColor: 'green',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  rightAction: {
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 20,
  },

  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  cameraBox: {
    flex: 0.33,
    margin: 16,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e4e9f2',
  },
  camera: {
    flex: 1,
  },
  invoiceSection: {
    flex: 0.67,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  productList: {
    marginTop: 10,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  productListContent: {
   paddingBottom: 60, // Ensures enough space for the total container
 },
  column1: {
    flex: 0.8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
  },
  column2: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },


  totalContainer: {
     position: 'absolute',
     bottom: 0,
     left: 0,
     right: 0,
     paddingVertical: 10,
     paddingHorizontal: 16,
      backgroundColor:'#efefef',
     borderTopWidth: 1,
     borderTopColor: '#e4e9f2',
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingBottom: 80,
   },
 totalText: {
   fontSize: 18,
   fontWeight: 'bold',
 },
 totalAmount: {
   fontSize: 18,
   fontWeight: 'bold',
 },


 highlightedItem: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   padding: 10,
   marginBottom: 10,
   backgroundColor: 'yellow',
   borderRadius: 8,
   elevation: 2,
  },

  highlightedText: {
   color: 'black', // Text color when highlighted
 },
});

export default Home;
