import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity, Dimensions, Animated, Picker   } from 'react-native';
import { ApplicationProvider, Text, Button , Modal} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import InvoiceSettingsModal from './InvoiceSettingsModal'; // Adjust the import path as necessary
import ModalProduct from './ModalProduct';




// Fetch device dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Main Component
const Home = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Petit Beurre Biscuits', brand: 'LU', quantity: 2, price: 1.99, stock: 20, nearbySold: 12, timesSold: 50, avatar: 'https://via.placeholder.com/150?text=Petit+Beurre+Biscuits' },
   { id: '2', name: 'Chocolate Chip Cookies', brand: 'Oreo', quantity: 1, price: 2.49, stock: 15, nearbySold: 8, timesSold: 35, avatar: 'https://via.placeholder.com/150?text=Chocolate+Chip+Cookies' },
   { id: '3', name: 'Digestive Biscuits', brand: 'McVities', quantity: 3, price: 3.49, stock: 30, nearbySold: 15, timesSold: 60, avatar: 'https://via.placeholder.com/150?text=Digestive+Biscuits' },
   { id: '4', name: 'Butter Shortbread', brand: 'Walkers', quantity: 1, price: 4.99, stock: 10, nearbySold: 5, timesSold: 25, avatar: 'https://via.placeholder.com/150?text=Butter+Shortbread' },
   { id: '5', name: 'Coconut Biscuits', brand: 'Bahlsen', quantity: 4, price: 2.29, stock: 25, nearbySold: 10, timesSold: 40, avatar: 'https://via.placeholder.com/150?text=Coconut+Biscuits' },
   { id: '6', name: 'Wafer Biscuits', brand: 'Nestlé', quantity: 5, price: 1.79, stock: 50, nearbySold: 20, timesSold: 100, avatar: 'https://via.placeholder.com/150?text=Wafer+Biscuits' },
   { id: '7', name: 'Milk Chocolate Biscuits', brand: 'Milka', quantity: 2, price: 2.99, stock: 12, nearbySold: 6, timesSold: 30, avatar: 'https://via.placeholder.com/150?text=Milk+Chocolate+Biscuits' },
   { id: '8', name: 'Ginger Biscuits', brand: 'Belvita', quantity: 6, price: 2.19, stock: 18, nearbySold: 9, timesSold: 40, avatar: 'https://via.placeholder.com/150?text=Ginger+Biscuits' },
   { id: '9', name: 'Sugar-Free Biscuits', brand: 'Gerblé', quantity: 3, price: 3.99, stock: 20, nearbySold: 7, timesSold: 25, avatar: 'https://via.placeholder.com/150?text=Sugar-Free+Biscuits' }
  ]);
  const [longPressId, setLongPressId] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const swipeableRefs = useRef(new Map());
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const [isModalProductVisible, setModalProductVisible] = useState(false);
  const [productData, setProductData] = useState("Sample Data");



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
    setProducts(prevProducts => prevProducts.filter(item => item.id !== id));
    setPopupMessage('Product deleted');
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
  const dincrementQuantity = (id) => {
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
          style={[styles.productCard, longPressId === item.id && styles.longPressedBackground]}
          onPressIn={() => handleLongPressStart(item.id)}
          onPressOut={handleLongPressEnd}

        >
          <View style={styles.column1}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>
              Quantity: <Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text> / Price: {item.price} dirham
            </Text>
          </View>
          <View style={styles.column2}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{totalPrice} DH</Text>
          </View>
          <View style={styles.column3}>
             <Fontisto name="more-v-a" size={width * 0.06} color="black" onPress={() => openModalProduct(item)} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/* Notification Section */}

          {/* Camera Section */}
          <View style={styles.cameraBox} />

          {/* Invoice Section */}
          <View style={styles.invoiceSection}>
            {/* Title and Date */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>List of Products ({getLengthItem()})</Text>
              <Text style={styles.date} onPress={openModal}><Ionicons name="settings-sharp" size={width * 0.07}/></Text>
            </View>
            <InvoiceSettingsModal isVisible={isModalVisible} onClose={closeModal} />
            <ModalProduct
                 isVisible={isModalProductVisible}
                 product={productData}
                 onClose={closeModalProduct}
                 onUpdate={handleUpdate}
            />


            {/* Products List */}
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={item => item.id}
              style={styles.productList}
              contentContainerStyle={styles.productListContent}
            />
          </View>
          {/* Total Section */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>{getTotalAmount().toFixed(2)} DH TVA (20%)</Text>
          </View>

          <View style={styles.ButtonCreatInvoiceContainer}>
            <Button status="success"  >Create Invoice</Button>
          </View>
        </View>
      </SafeAreaView>
    </ApplicationProvider>
  );
};

// Stylesheet with Dimension-based adjustments for better compatibility
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingBottom:45,
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
    flex: 0.33,
    margin: width * 0.04,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#e4e9f2',
  },
  invoiceSection: {
    flex: 0.57,
    padding: width * 0.04,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.03,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  date: {
    fontSize: width * 0.04,
    color: '#666',
  },
  productList: {
    marginTop: width * 0.03,
  },
  productListContent: {
    paddingBottom: height * 0.1,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.03,
    marginBottom: width * 0.03,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    elevation: 2,
  },
  longPressedBackground: {
    backgroundColor: 'red',
  },
  column1: {
    flex: 0.8,
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
    flex: 0.19,
    alignItems: 'flex-end',
  },
  column2: {
    flex: 0.01,
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
  totalContainer: {
    flex: 0.04,
    backgroundColor: '#efefef',
    borderTopWidth: 1,
    borderTopColor: '#e4e9f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
  },
  ButtonCreatInvoiceContainer: {
    flex: 0.03,
    backgroundColor: '#efefef',
    borderTopWidth: 1,
    borderTopColor: '#e4e9f2',
    width : '100%',
    padding: width * 0.03,
  },

  totalText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  leftAction: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.25,
  },
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.25,
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
});

export default Home;
