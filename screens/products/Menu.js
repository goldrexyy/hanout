import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar, Divider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Ionicons from "@expo/vector-icons/Ionicons";

import axios from 'axios';


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');

const productsWithoutEAN = [
   { id: '1989', name: 'Maroc Telecom',quantity:1, price:10, icon: 'call' },
   { id: '2949', name: 'Orange',quantity:1,price:10, icon: 'call' },
   { id: '3667', name: 'Inwi',quantity:1,price:10, icon: 'call' },
   { id: '199', name: 'Egg',quantity:1, price:10, icon: 'egg' },
   { id: '299', name: 'Produits locaux',quantity:1,price:10, icon: 'beaker' },
   { id: '366', name: 'Patte',quantity:1,price:10, icon: 'beaker' },
   { id: '4525', name: 'Épices',quantity:1, price:10, icon: 'leaf' },
   { id: '225', name: 'Vegetables',quantity:1,price:10, icon: 'nutrition' },
   { id: '611', name: 'Legume',quantity:1,price:10, icon: 'nutrition' },
   { id: '111', name: 'Bread',quantity:1, price:10, icon: 'beaker' },
 ];

 export default function Menu({ OpenProduct, isPressed }) {
   const [loading, setLoading] = useState(true);
   const [productsNoEAN, setProductsNoEAN] = useState(productsWithoutEAN);
   const [searchTerm, setSearchTerm] = useState('');
   const [filteredProducts, setFilteredProducts] = useState(productsNoEAN);

   useEffect(() => {
     // Simulate fetching products
     setProductsNoEAN(productsWithoutEAN);
     setLoading(false);
        console.log('stat', isPressed);
   }, []);

   const searchText = useCallback((value) => {
     setSearchTerm(value);
     const filtered = value
       ? productsNoEAN.filter(product => product.name.toLowerCase().includes(value.toLowerCase()))
       : productsNoEAN;
     setFilteredProducts(filtered);
   }, [productsNoEAN]);

   const renderCardItem = useCallback(({ item }) => (
     <TouchableOpacity
       style={styles.productCard1}
       onPress={() => OpenProduct(item.name)}
     >
       <View
         style={[
           styles.column0,
           { backgroundColor: isPressed ? '#f9f9f9' : '#f9f9f9' }, // Conditional background color
         ]}
       >
         <Ionicons name={item.icon} size={40} color={isPressed ? '#3682B3' : '#D15D5D'} style={styles.icon} />
       </View>
       <View style={styles.column1}>
         <Text style={styles.productName}>{item.name}</Text>
       </View>
     </TouchableOpacity>
   ), [OpenProduct]);

   return (
     <Layout style={styles.container}>
     <View style={styles.cardContent}>

     <View
         style={[
         styles.column11,
         {backgroundColor:isPressed ? '#3682B3' : '#D15D5D' }, // Conditional background color
             ]}
         >
         <Ionicons name="cube" size={width * 0.1} color="white" style={styles.icon} />
       </View>
       <View
           style={[
           styles.column2,
           {backgroundColor:isPressed ? '#3682B3' : '#D15D5D' }, // Conditional background color
               ]}
           >
           <Text style={styles.Selecttext8}> Selectionner une catégorie</Text>
       </View>
     </View>
     <View style={styles.container2}>
       <TextInput
         style={styles.searchInput}
         placeholder="Trouver une catégorie.."
         value={searchTerm}
         onChangeText={searchText}
       />
       <Divider style={styles.divider2} />
       <FlatList
     data={filteredProducts}
     renderItem={renderCardItem}
     keyExtractor={item => item.id}
     showsVerticalScrollIndicator={false}
     numColumns={4}  // Ensure this is set to 3
     columnWrapperStyle={{ justifyContent: 'flex-start' }}
     contentContainerStyle={styles.cardListContent}
 />
     </View>
       </Layout>
   );
 }

// Styles with responsive design
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
  },
  column11: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3682B3',
    flex: 0.3,
    height: 100,
  },
  column2: {
    flex: 1,
    padding: 3,
    backgroundColor: '#3682B3',
    justifyContent: 'center',
    alignItems: 'center',
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
  icon:{
    padding:10,
  },
  Selecttext8: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  divider2: {
    marginVertical: 5,
    backgroundColor: '#E4E9F2',
  },
  productCard1: {
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: width * 0.02,
     marginRight:width * 0.025,
     backgroundColor: '#fff',
     borderRadius: width * 0.02,
     borderWidth: width * 0.003,
     borderColor: '#666',
     width: '23%',  // Fill the column
   },
 productName: {
   fontSize: width * 0.025,
   alignItems:'left',
   justifyContent: 'center',
     fontWeight: 'bold',
 },
 productDetails: {
   fontSize: width * 0.04,
   color: '#666',
 },

 column0: {
   borderRadius: width * 0.02,
   borderWidth: width * 0.003,
   borderColor: 'transparent',
   alignItems: 'center',
   backgroundColor:'#3682B3',
    justifyContent: 'center',
    width:'100%',
 },
 column1: {
    alignItems: 'left',
     justifyContent: 'center',
     paddingVertical:5,
 },
 totalLabel: {
   fontSize: width * 0.035,
   color: '#666',
 },
 totalPrice: {
   fontSize: width * 0.045,
   fontWeight: 'bold',
 },

  cardListContent: {

  },
 container2: {
   flex:1,
   backgroundColor: '#fff',
   position:'relative',
   paddingVertical:10,
   width:'95%'
 },
});
