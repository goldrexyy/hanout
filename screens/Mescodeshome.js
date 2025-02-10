import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator, SectionList, RefreshControl, Image} from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar, Divider } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import moment from 'moment';

import NewClient from './clients/NewClient';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import LoadingScreen from './LoadingScreen'; // Import your LoadingScreen
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



const Client = React.memo(({  OpenProduct, isPressed }) => {
    console.log('start client bottom');
  // State variables
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState(data);

  const [clients, setClients] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');


  const categories = [{"idUnique":"001","nom":"Marché","type":"catégorie","icon":"marche-icon"},{"idUnique":"002","nom":"Boulangerie","type":"catégorie","icon":"boulangerie-icon"},{"idUnique":"003","nom":"Telecom","type":"catégorie","icon":"telecom-icon"},{"idUnique":"004","nom":"Gas","type":"catégorie","icon":"gas-icon"},{"idUnique":"005","nom":"Glaces & Surgelé","type":"catégorie","icon":"glaces-surgele-icon"},{"idUnique":"006","nom":"Lait & Fromage","type":"catégorie","icon":"produits-laitiers-icon"},{"idUnique":"007","nom":"Epicerie","type":"catégorie","icon":"epicerie-icon"},{"idUnique":"008","nom":"Conserve","type":"catégorie","icon":"conserve-icon"},{"idUnique":"009","nom":"Farine","type":"catégorie","icon":"farine-icon"},{"idUnique":"010","nom":"Preparation pattiserie","type":"catégorie","icon":"preparation-pattiserie-icon"},{"idUnique":"011","nom":"Huiles Vinaigres","type":"catégorie","icon":"huiles-vinaigres-icon"},{"idUnique":"012","nom":"Pates","type":"catégorie","icon":"pates-icon"},{"idUnique":"013","nom":"Sauces","type":"catégorie","icon":"sauces-icon"},{"idUnique":"014","nom":"Epices","type":"catégorie","icon":"epices-icon"},{"idUnique":"015","nom":"Sucre","type":"catégorie","icon":"sucre-icon"},{"idUnique":"016","nom":"Petit déjeuner","type":"catégorie","icon":"petit-dejeuner-icon"},{"idUnique":"017","nom":"Biscuiterie","type":"catégorie","icon":"biscuiterie-icon"},{"idUnique":"018","nom":"Boissons","type":"catégorie","icon":"boissons-icon"},{"idUnique":"019","nom":"Boucherie","type":"catégorie","icon":"boucherie-icon"},{"idUnique":"020","nom":"Bébé","type":"catégorie","icon":"bebe-icon"},{"idUnique":"021","nom":"Hygiène, beauté , soin","type":"catégorie","icon":"hygiene-beaute-soin-icon"},{"idUnique":"022","nom":"Entretien, nettoyage","type":"catégorie","icon":"entretien-nettoyage-icon"},{"idUnique":"023","nom":"Jardin et plein air","type":"catégorie","icon":"jardin-plein-air-icon"},{"idUnique":"024","nom":"Librairie","type":"catégorie","icon":"librairie-icon"},{"idUnique":"025","nom":"Animaux","type":"catégorie","icon":"animaux-icon"}];

  // Create an icon mapping
  const iconMapping = {
    'marche-icon': require('../assets/categories/marche-icon.png'),
    'boulangerie-icon': require('../assets/categories/boulangerie-icon.png'),
    'telecom-icon': require('../assets/categories/telecom-icon.png'),
    'gas-icon': require('../assets/categories/gas-icon.png'),
    'glaces-surgele-icon': require('../assets/categories/glaces-surgele-icon.png'),
    'produits-laitiers-icon': require('../assets/categories/produits-laitiers-icon.png'),
    'epicerie-icon': require('../assets/categories/epicerie-icon.png'),
    'conserve-icon': require('../assets/categories/conserve-icon.png'),
    'farine-icon': require('../assets/categories/farine-icon.png'),
    'preparation-pattiserie-icon': require('../assets/categories/preparation-pattiserie-icon.png'),
    'huiles-vinaigres-icon': require('../assets/categories/huiles-vinaigres-icon.png'),
    'pates-icon': require('../assets/categories/pates-icon.png'),
    'sauces-icon': require('../assets/categories/sauces-icon.png'),
    'epices-icon': require('../assets/categories/epices-icon.png'),
    'sucre-icon': require('../assets/categories/sucre-icon.png'),
    'petit-dejeuner-icon': require('../assets/categories/petit-dejeuner-icon.png'),
    'biscuiterie-icon': require('../assets/categories/biscuiterie-icon.png'),
    'boissons-icon': require('../assets/categories/boissons-icon.png'),
    'boucherie-icon': require('../assets/categories/boucherie-icon.png'),
    'bebe-icon': require('../assets/categories/bebe-icon.png'),
    'hygiene-beaute-soin-icon': require('../assets/categories/hygiene-beaute-soin-icon.png'),
    'entretien-nettoyage-icon': require('../assets/categories/entretien-nettoyage-icon.png'),
    'jardin-plein-air-icon': require('../assets/categories/jardin-plein-air-icon.png'),
    'librairie-icon': require('../assets/categories/librairie-icon.png'),
    'animaux-icon': require('../assets/categories/animaux-icon.png'),
    'empty': require('../assets/categories/empty.png'),
    'empty-tr': require('../assets/categories/empty-tr.png'),
  };

  const handlePress = (item) => {
    const prefix = item.idUnique.substring(0, 3);
    OpenProduct(item);
  };

  // Filtered list based on search input
  const filteredData = categories;

  const searchText = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCardItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.productCard1}
      onPress={() => handlePress(item)}
    >
      <View style={[styles.column0, { backgroundColor: 'transparent' }]}>
      <Image
             source={iconMapping[item.icon]} // Use the mapped icon
             style={styles.icon}
           />
      </View>
      <View style={styles.column1}>
        <Text style={styles.productName}>{item.idUnique}</Text>
        <Text style={styles.productName2}>{item.nom}</Text>
      </View>
    </TouchableOpacity>
  ), [isPressed]);

  return (

        <Layout style={styles.container}>

       <Text style={styles.Selecttext1}>Ajouter un produit à votre facture</Text>
        <Text style={styles.Selecttext2}>
          Regrouper vos codes en catégories vous aide à mieux les classer et les mémoriser. Choisir des préfixes définis pour chaque catégorie vous permettra de vous rappeler plus facilement du code produit que vous souhaitez ajouter à votre facture.
        </Text>
        <View style={styles.formContainerSearch}>
          <TextInput
            style={styles.searchInput}
            placeholder="Trouver une catégorie.."
            value={searchTerm}
            onChangeText={searchText}
          />
        </View>
          <View >
             <FlatList
               data={filteredCategories} // Use filtered categories
               renderItem={renderCardItem}
               keyExtractor={item => item.id}
               showsVerticalScrollIndicator={false}
               numColumns={3}
               columnWrapperStyle={{ justifyContent: 'flex-start' }}
               initialNumToRender={10} // Adjust as needed
             />

          </View>
        </Layout>
      );
     });
     export default Client;

// Styles with responsive design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:10,
  },

  layout: {
    backgroundColor:'#fff',
    paddingHorizontal: 16,
    flex: 1,
    justifyContent:'center',
  },

  Selecttext: {
    fontSize: width * 0.06,
    paddingTop: width * 0.1,
    fontWeight: 'bold',
    color: 'white',
    padding: 15,
  },

  formContainer: {

    width:'100%',
    backgroundColor:'white',
    justifyContent:'center',

  },
  formContainer2: {
         flexDirection: 'row',
    width:'100%',
    backgroundColor:'white',


  },
  formContainerSearch: {
    flex:1,
    backgroundColor: '#fff',
    position:'relative',
    paddingVertical:10,
    width:'100%',
  },

  Selecttext1: {
    fontSize: width * 0.04,
    paddingTop: width * 0.02,
    fontWeight: 'bold',
    color: '#333',
    textTransform:'uppercase'
  },

  Selecttext111: {
    fontSize: width * 0.025,
    paddingTop: width * 0.02,
    fontWeight: 'bold',
    color: 'rgba(153, 153, 153, 0.5)',

  },
  Selecttext112: {
    fontSize: width * 0.025,
    paddingTop: width * 0.02,
    fontWeight: 'bold',
    color: '#333',

  },

  Selecttext2: {
    fontSize: width * 0.03,
    marginTop:width*0.01,
    color: '#999',
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
     width: '31.5%',  // Fill the column
   },

   icon:{
     padding:10,
     width:width*0.18,
     height: width * 0.18,
   },

   column1: {
      alignItems: 'center',
     justifyContent: 'center',
   },

   productName: {
       fontSize: width * 0.025,
       fontWeight: 'bold',
       textTransform: 'uppercase', // Converts text to uppercase
       padding: 2,
       flexWrap: 'wrap', // Allows text to wrap
       textAlign: 'left', // Aligns text to the left
   },

   productName2: {
       fontSize: width * 0.035,
       textTransform: 'uppercase', // Converts text to uppercase
       flexWrap: 'wrap', // Allows text to wrap
       textAlign: 'center', // Aligns text to the left
        fontWeight: 'bold',
        padding:5,
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

});
