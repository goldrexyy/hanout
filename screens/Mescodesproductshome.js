import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator, SectionList, RefreshControl, Image} from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar, Divider } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import moment from 'moment';

import NewClient from './clients/NewClient';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import LoadingScreen from './LoadingScreen'; // Import your LoadingScreen
import * as SplashScreen from 'expo-splash-screen';

import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

SplashScreen.preventAutoHideAsync();


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



const Client = React.memo(({  prefix, isPressed, goBackCat, OpenCategory, subcat, goBack, AddProduct}) => {
    console.log('start client bottom');
  // State variables
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState(data);

    const db = useSQLiteContext();
      const swipeableRefs = useRef(new Map());

  const [clients, setClients] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const categories  = [{"icon": "marche-icon", "idUnique": "0011", "nom": "Fruits", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0012", "nom": "Fruits secs", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0013", "nom": "Légumes", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0014", "nom": "Salades", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0015", "nom": "Herbes", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0016", "nom": "Condiments", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0017", "nom": "Viande", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0018", "nom": "Volailles", "parent": "001", "type": "sous-catégorie"}, {"icon": "marche-icon", "idUnique": "0019", "nom": "Khlii", "parent": "001", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0021", "nom": "Pain", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0022", "nom": "Pain de mie", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0023", "nom": "Veinoiserie", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0024", "nom": "Pain sandwich", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0025", "nom": "Fond Pizza", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0026", "nom": "Levure pain", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0027", "nom": "Feuille Pastilla", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0028", "nom": "Madeleine", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "0029", "nom": "Cake", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "00210", "nom": "Pattiserie", "parent": "002", "type": "sous-catégorie"}, {"icon": "boulangerie-icon", "idUnique": "00211", "nom": "Gateau traditionnels", "parent": "002", "type": "sous-catégorie"}, {"icon": "telecom-icon", "idUnique": "0031", "nom": "Recharge IAM", "parent": "003", "type": "sous-catégorie"}, {"icon": "telecom-icon", "idUnique": "0032", "nom": "Recharge Orange", "parent": "003", "type": "sous-catégorie"}, {"icon": "telecom-icon", "idUnique": "0033", "nom": "Recharge INWI", "parent": "003", "type": "sous-catégorie"}, {"icon": "gas-icon", "idUnique": "0041", "nom": "Bobine gas", "parent": "004", "type": "sous-catégorie"}, {"icon": "glaces-surgele-icon", "idUnique": "0051", "nom": "Batonnets", "parent": "005", "type": "sous-catégorie"}, {"icon": "glaces-surgele-icon", "idUnique": "0052", "nom": "Cornets", "parent": "005", "type": "sous-catégorie"}, {"icon": "glaces-surgele-icon", "idUnique": "0053", "nom": "Pots", "parent": "005", "type": "sous-catégorie"}, {"icon": "glaces-surgele-icon", "idUnique": "0054", "nom": "Plat surgelé", "parent": "005", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0061", "nom": "Fromage à la découpe", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0062", "nom": "Fromage étrangers", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0063", "nom": "Fromage à tartiner", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0064", "nom": "Fromage portions", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0065", "nom": "Fromages edam", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0066", "nom": "Fromage tranches", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0067", "nom": "Fromage rapés", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0068", "nom": "Camembert", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "0069", "nom": "Fromage frais", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00610", "nom": "Mozzarela", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00611", "nom": "Feta", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00612", "nom": "Ricotta", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00613", "nom": "Lait", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00614", "nom": "Lben", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00615", "nom": "Lait aromatisé", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00616", "nom": "Lait végétal", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00617", "nom": "Oeufs", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00618", "nom": "Yaourts aromatisés", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00619", "nom": "Yaourt allégés", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00620", "nom": "Yaourts natures", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00621", "nom": "Yaourts à boire", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00622", "nom": "Raib", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00623", "nom": "Crème desserts", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00624", "nom": "Yaourt enfants", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00625", "nom": "Jus de fruits au lait", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00626", "nom": "Creme fraiche", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00627", "nom": "Creme longue conservation", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00628", "nom": "Creme pattissières", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00629", "nom": "Beurre", "parent": "006", "type": "sous-catégorie"}, {"icon": "produits-laitiers-icon", "idUnique": "00630", "nom": "Margarine", "parent": "006", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0071", "nom": "Cuisine asiatique", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0072", "nom": "Cuisine orientales", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0073", "nom": "Cuisine latine", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0074", "nom": "Soupe à rechauffer", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0075", "nom": "Soupe déshydratées", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0076", "nom": "Chocolat patissiers", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0077", "nom": "Semoule", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0078", "nom": "Argan", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "0079", "nom": "Assaisonnement", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00710", "nom": "Riz", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00711", "nom": "Risotto", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00712", "nom": "Blé cuit", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00713", "nom": "Quinoa", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00714", "nom": "Purée", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00715", "nom": "Couscous", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00716", "nom": "Légumes secs", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00717", "nom": "Olives", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00718", "nom": "Citrons confits", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00719", "nom": "Tapenades", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00720", "nom": "Cornichons", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00721", "nom": "Captres", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00722", "nom": "Condiments", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00723", "nom": "Sels", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00724", "nom": "Bouillons", "parent": "007", "type": "sous-catégorie"}, {"icon": "epicerie-icon", "idUnique": "00725", "nom": "Edulcorants", "parent": "007", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0081", "nom": "Thons nature", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0082", "nom": "Thons en sauce", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0083", "nom": "Sardines", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0084", "nom": "Maquereaux", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0085", "nom": "Champignons", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0086", "nom": "Macedoine", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0087", "nom": "Petits pois", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0088", "nom": "Mais", "parent": "008", "type": "sous-catégorie"}, {"icon": "conserve-icon", "idUnique": "0089", "nom": "Coeur de palmier", "parent": "008", "type": "sous-catégorie"}, {"icon": "farine-icon", "idUnique": "0091", "nom": "Farine complète", "parent": "009", "type": "sous-catégorie"}, {"icon": "farine-icon", "idUnique": "0092", "nom": "Farine farinot", "parent": "009", "type": "sous-catégorie"}, {"icon": "farine-icon", "idUnique": "0093", "nom": "Farine fleur patissière", "parent": "009", "type": "sous-catégorie"}, {"icon": "preparation-pattiserie-icon", "idUnique": "0101", "nom": "Flan", "parent": "010", "type": "sous-catégorie"}, {"icon": "preparation-pattiserie-icon", "idUnique": "0102", "nom": "Mousses", "parent": "010", "type": "sous-catégorie"}, {"icon": "preparation-pattiserie-icon", "idUnique": "0103", "nom": "Levure", "parent": "010", "type": "sous-catégorie"}, {"icon": "preparation-pattiserie-icon", "idUnique": "0104", "nom": "Preparation de geateaux", "parent": "010", "type": "sous-catégorie"}, {"icon": "preparation-pattiserie-icon", "idUnique": "0105", "nom": "Crème pattisière", "parent": "010", "type": "sous-catégorie"}, {"icon": "huiles-vinaigres-icon", "idUnique": "0111", "nom": "Huile olive", "parent": "011", "type": "sous-catégorie"}, {"icon": "huiles-vinaigres-icon", "idUnique": "0112", "nom": "Huile cuisson", "parent": "011", "type": "sous-catégorie"}, {"icon": "huiles-vinaigres-icon", "idUnique": "0113", "nom": "Vinaigres", "parent": "011", "type": "sous-catégorie"}, {"icon": "huiles-vinaigres-icon", "idUnique": "0114", "nom": "Vinaigrettes", "parent": "011", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0121", "nom": "Spaghetti", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0122", "nom": "Tagliatelles", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0123", "nom": "Fusilli", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0124", "nom": "Penne", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0125", "nom": "Farfalle", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0126", "nom": "Lasagne", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0127", "nom": "Raviolis", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0128", "nom": "Cannelloni", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "0129", "nom": "Cheveux d'anges", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "01210", "nom": "Macaroni", "parent": "012", "type": "sous-catégorie"}, {"icon": "pates-icon", "idUnique": "01211", "nom": "Pâtes spéciales", "parent": "012", "type": "sous-catégorie"}, {"icon": "sauces-icon", "idUnique": "0131", "nom": "Concentré tomate", "parent": "013", "type": "sous-catégorie"}, {"icon": "sauces-icon", "idUnique": "0132", "nom": "Sauce pâtes", "parent": "013", "type": "sous-catégorie"}, {"icon": "sauces-icon", "idUnique": "0133", "nom": "Sauces pizza", "parent": "013", "type": "sous-catégorie"}, {"icon": "sauces-icon", "idUnique": "0134", "nom": "Moutarde", "parent": "013", "type": "sous-catégorie"}, {"icon": "sauces-icon", "idUnique": "0135", "nom": "Mayonnaise", "parent": "013", "type": "sous-catégorie"}, {"icon": "sauces-icon", "idUnique": "0136", "nom": "Ketchup", "parent": "013", "type": "sous-catégorie"}, {"icon": "sauces-icon", "idUnique": "0137", "nom": "Sauce piquante", "parent": "013", "type": "sous-catégorie"}, {"icon": "epices-icon", "idUnique": "0141", "nom": "Épices en flacon", "parent": "014", "type": "sous-catégorie"}, {"icon": "epices-icon", "idUnique": "0142", "nom": "Épices en sachet", "parent": "014", "type": "sous-catégorie"}, {"icon": "epices-icon", "idUnique": "0143", "nom": "Herbes", "parent": "014", "type": "sous-catégorie"}, {"icon": "epices-icon", "idUnique": "0144", "nom": "Aide culinaire", "parent": "014", "type": "sous-catégorie"}, {"icon": "epices-icon", "idUnique": "0145", "nom": "Mélanges épices", "parent": "014", "type": "sous-catégorie"}, {"icon": "sucre-icon", "idUnique": "0151", "nom": "Sucre granulé", "parent": "015", "type": "sous-catégorie"}, {"icon": "sucre-icon", "idUnique": "0152", "nom": "Sucre morceau", "parent": "015", "type": "sous-catégorie"}, {"icon": "sucre-icon", "idUnique": "0153", "nom": "Pain de sucre", "parent": "015", "type": "sous-catégorie"}, {"icon": "sucre-icon", "idUnique": "0154", "nom": "Sucre glace", "parent": "015", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0161", "nom": "Miels", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0162", "nom": "Sirops", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0163", "nom": "Pâtes à tartiner", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0164", "nom": "Beurre de cacahuète", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0165", "nom": "Amlou", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0166", "nom": "Café moulu", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0167", "nom": "Capsules", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0168", "nom": "Grains", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "0169", "nom": "Soluble", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01610", "nom": "Céréales", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01611", "nom": "Corn Flakes", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01612", "nom": "Biscottes", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01613", "nom": "Céréales enfants", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01614", "nom": "Galettes", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01615", "nom": "Pains épices", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01616", "nom": "Muesli", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01617", "nom": "Avoine", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01618", "nom": "Chocolat en poudre", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01619", "nom": "Lait en poudre", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01620", "nom": "Confiture", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01621", "nom": "Infusion", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01622", "nom": "Tisanes", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01623", "nom": "Thé noir", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01624", "nom": "Thé parfumé", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01625", "nom": "Thé vert filament", "parent": "016", "type": "sous-catégorie"}, {"icon": "petit-dejeuner-icon", "idUnique": "01626", "nom": "Thé vert grains", "parent": "016", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0171", "nom": "Chips", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0172", "nom": "Tortillas", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0173", "nom": "Chips soufflées", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0174", "nom": "Biscuits", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0175", "nom": "Cacahuètes", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0176", "nom": "Pistaches", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0177", "nom": "Noix", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0178", "nom": "Biscuits diététiques", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "0179", "nom": "Biscuits secs", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01710", "nom": "Biscuits aux fruits", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01711", "nom": "Biscuits chocolat", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01712", "nom": "Biscuits pâtissiers", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01713", "nom": "Cookies", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01714", "nom": "Madeleines", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01715", "nom": "Génoises", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01716", "nom": "Cakes", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01717", "nom": "Gaufrettes", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01718", "nom": "Bonbons", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01719", "nom": "Caramels", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01720", "nom": "Confiserie", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01721", "nom": "Gommes", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01722", "nom": "Chewing gum", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01723", "nom": "Sucettes", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01724", "nom": "Barres chocolatées", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01725", "nom": "Confiserie chocolat", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01726", "nom": "Nougat", "parent": "017", "type": "sous-catégorie"}, {"icon": "biscuiterie-icon", "idUnique": "01727", "nom": "Tablettes de chocolat", "parent": "017", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0181", "nom": "Eaux plates", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0182", "nom": "Eaux gazeuses", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0183", "nom": "Eaux aromatisées", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0184", "nom": "Sirops", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0185", "nom": "Jus frais naturel", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0186", "nom": "Pur jus", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0187", "nom": "Jus orange", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0188", "nom": "Jus exotique", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "0189", "nom": "Format pocket", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "01810", "nom": "Autre jus", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "01811", "nom": "Colas", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "01812", "nom": "Boisson gazeuse", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "01813", "nom": "Ice Tea", "parent": "018", "type": "sous-catégorie"}, {"icon": "boissons-icon", "idUnique": "01814", "nom": "Ice Coffee", "parent": "018", "type": "sous-catégorie"}, {"icon": "boucherie-icon", "idUnique": "0191", "nom": "Charcuterie", "parent": "019", "type": "sous-catégorie"}, {"icon": "boucherie-icon", "idUnique": "0192", "nom": "Mortadelles", "parent": "019", "type": "sous-catégorie"}, {"icon": "boucherie-icon", "idUnique": "0193", "nom": "Saucissons", "parent": "019", "type": "sous-catégorie"}, {"icon": "boucherie-icon", "idUnique": "0194", "nom": "Jambons", "parent": "019", "type": "sous-catégorie"}, {"icon": "boucherie-icon", "idUnique": "0195", "nom": "Hot dog", "parent": "019", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0201", "nom": "Lait de croissance", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0202", "nom": "Céréales", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0203", "nom": "Biscuits", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0204", "nom": "Desserts", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0205", "nom": "Compotes", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0206", "nom": "Couches", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0207", "nom": "Shampoings", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0208", "nom": "Savons bébé", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "0209", "nom": "Crèmes", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "02010", "nom": "Huiles", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "02011", "nom": "Laits hydratants", "parent": "020", "type": "sous-catégorie"}, {"icon": "bebe-icon", "idUnique": "02012", "nom": "Lingettes", "parent": "020", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0211", "nom": "Shampoings", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0212", "nom": "Masques cheveux", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0213", "nom": "Gels", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0214", "nom": "Produits coiffants", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0215", "nom": "Coloration", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0216", "nom": "Accessoires cheveux", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0217", "nom": "Gel douche", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0218", "nom": "Savons en barres", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "0219", "nom": "Savons en liquide", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02110", "nom": "Accessoires douche", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02111", "nom": "Déodorants", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02112", "nom": "Eau de toilette", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02113", "nom": "Rasage homme", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02114", "nom": "Soins visage homme", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02115", "nom": "Hygiène féminine", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02116", "nom": "Epilation Dépilation", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02117", "nom": "Maquillage yeux", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02118", "nom": "Maquillage visage", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02119", "nom": "Maquillage lèvres", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02120", "nom": "Démaquillants Dissolvants", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02121", "nom": "Accessoires maquillage", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02122", "nom": "Dentifrice", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02123", "nom": "Brosse à dents", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02124", "nom": "Bain bouche", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02125", "nom": "Fil dentaire", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02126", "nom": "Lait hydratant", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02127", "nom": "Crème main", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02128", "nom": "Masque nettoyant", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02129", "nom": "Crème visage", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02130", "nom": "Protection solaire", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02131", "nom": "Pansements", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02132", "nom": "Parapharmacie", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02133", "nom": "Accessoires manucure", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02134", "nom": "Trousse", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02135", "nom": "Papier toilette", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02136", "nom": "Mouchoirs", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02137", "nom": "Cotons", "parent": "021", "type": "sous-catégorie"}, {"icon": "hygiene-beaute-soin-icon", "idUnique": "02138", "nom": "Coton tiges", "parent": "021", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0221", "nom": "Lessive à la main", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0222", "nom": "Lessive machine", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0223", "nom": "Lessive liquide", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0224", "nom": "Assouplissants", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0225", "nom": "Tide", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0226", "nom": "Ariel", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0227", "nom": "Liquide vaisselle", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0228", "nom": "Pastilles", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "0229", "nom": "Gel de lavage", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02210", "nom": "Pâte lavante", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02211", "nom": "Désodorisante", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02212", "nom": "Bougies Parfumées", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02213", "nom": "Eau de javel", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02214", "nom": "Gel wc", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02215", "nom": "Déboucheurs", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02216", "nom": "Dégraissant", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02217", "nom": "Vitre", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02218", "nom": "Meuble", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02219", "nom": "Nettoyant sol", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02220", "nom": "Essuie tout", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02221", "nom": "Papier alu", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02222", "nom": "Sacs poubelle", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02223", "nom": "Eponges", "parent": "022", "type": "sous-catégorie"}, {"icon": "entretien-nettoyage-icon", "idUnique": "02224", "nom": "Insecticides", "parent": "022", "type": "sous-catégorie"}, {"icon": "jardin-plein-air-icon", "idUnique": "0231", "nom": "Produit entretien", "parent": "023", "type": "sous-catégorie"}, {"icon": "jardin-plein-air-icon", "idUnique": "0232", "nom": "Piles", "parent": "023", "type": "sous-catégorie"}, {"icon": "jardin-plein-air-icon", "idUnique": "0233", "nom": "Lampes électriques", "parent": "023", "type": "sous-catégorie"}, {"icon": "jardin-plein-air-icon", "idUnique": "0234", "nom": "Interrupteurs", "parent": "023", "type": "sous-catégorie"}, {"icon": "jardin-plein-air-icon", "idUnique": "0235", "nom": "Prises", "parent": "023", "type": "sous-catégorie"}, {"icon": "jardin-plein-air-icon", "idUnique": "0236", "nom": "Jardinage", "parent": "023", "type": "sous-catégorie"}, {"icon": "jardin-plein-air-icon", "idUnique": "0237", "nom": "Barbecue", "parent": "023", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0241", "nom": "Cahiers", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0242", "nom": "Registre", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0243", "nom": "Couvres livres", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0244", "nom": "Stylos", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0245", "nom": "Crayons de couleurs", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0246", "nom": "Marqueurs", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0247", "nom": "Traçage", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0248", "nom": "Colles", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "0249", "nom": "Correcteurs", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02410", "nom": "Taille crayons", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02411", "nom": "Ardoise", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02412", "nom": "Dessin", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02413", "nom": "Loisir créatif", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02414", "nom": "Livre scolaire", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02415", "nom": "Langue", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02416", "nom": "Dictionnaire", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02417", "nom": "Coran", "parent": "024", "type": "sous-catégorie"}, {"icon": "librairie-icon", "idUnique": "02418", "nom": "Livre enfants", "parent": "024", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0251", "nom": "Croquettes chat", "parent": "025", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0252", "nom": "Terrine barquette", "parent": "025", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0253", "nom": "Pochons chat", "parent": "025", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0254", "nom": "Litière chat", "parent": "025", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0255", "nom": "Croquettes chiens", "parent": "025", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0256", "nom": "Boîtes chien", "parent": "025", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0257", "nom": "Friandises", "parent": "025", "type": "sous-catégorie"}, {"icon": "animaux-icon", "idUnique": "0258", "nom": "Accessoires chiens", "parent": "025", "type": "sous-catégorie"}];

    const iconMapping = {
      'cartinvoice': require('../assets/invoice/cartinvoice.png'),

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
    };

    useEffect(() => {
      FetchCategories();
    }, []);


    //Fetch clients
    const FetchCategories = async () => {
      try {
        const category = 'subcategory'; // Replace with the desired category value
        const prefixcategory = subcat.idUnique.slice(0, 4); // Use the passed prefix value

        // Modify the query to filter by both `type` and the first 3 digits of `idunique`
        const result = await db.getAllAsync(
    `SELECT * FROM detailsfacture
     WHERE deleted = 0
       AND substr(productid, 1, 4) = ?
       AND id IN (
         SELECT MAX(id)
         FROM detailsfacture
         WHERE deleted = 0
           AND substr(productid, 1, 4) = ?
         GROUP BY substr(productid, 1, 4)
       )`,
    [prefixcategory, prefixcategory]
  );

        // Update the data state with the fetched results
        setProducts(result);
          console.log('products catégory', result);
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    };

  const handlePress = (item) => {
    OpenCategory(item);
  };

  // Filtered list based on search input
  const filteredData = categories;

  const searchText = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Filter categories based on search term and prefix for idUniq
  const filteredCategories = categories.filter((category) =>
    category.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
    category.idUnique.slice(0, 3) === prefix.idUnique.slice(0, 3)
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


  // Function to increment the product quantity by 0.5
  const incrementQuantity = (id) => {
    setProducts(prevProducts =>
      prevProducts.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
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
        item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 0.25 } : item
      )
    );

    const swipeRef = swipeableRefs.current.get(id);
    if (swipeRef) {
      swipeRef.close(); // Close swipeable after action
    }
  };
  // Render function for each product item in the list
  const renderProductItem = ({ item }) => {

    const totalPrice = parseFloat(((item.quantity/item.quantity) * (item.total/item.quantity)).toFixed(2));


    return (
      <TouchableOpacity style={styles.productCard} onPress={() => AddProduct(item)}>
      <View style={styles.column00}>
        <Image
        source={iconMapping['cartinvoice']}
          style={styles.icon2}
        />
      </View>
        <View style={styles.column1}>
          <Text style={styles.productName}>{item.productname}  </Text>
            <Text style={styles.productDetails}>{item.productid}</Text>
          <Text style={styles.productDetails}>
            Qty: <Text style={{ fontWeight: 'bold', color:'#000', fontSize:width*0.04 }}>1</Text> | Prix: <Text style={{ fontWeight: 'bold' }}>{(item.total/item.quantity).toFixed(2)} Dh</Text>
          </Text>
        </View>

        <View style={styles.column2}>
          <Text style={styles.totalLabel}>Total in Dh</Text>
          <Text style={styles.totalPrice} numberOfLines={1} adjustsFontSizeToFit={true}>{totalPrice} Dh</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (

        <Layout style={styles.container}>
        <TouchableOpacity onPress={() => goBackCat()} style={{flexDirection:'row',  alignItems:'center'}}>
          <View style={styles.circle}>
            <Ionicons name="arrow-back" size={width * 0.07} color="#333" />
          </View>
            <Text style={styles.Selecttext1}>  Ajouter un produit à votre facture</Text>
        </TouchableOpacity>
        <Text style={styles.Selecttext2}>
          Regrouper vos codes en catégories vous aide à mieux les classer et les mémoriser. Choisir des préfixes définis pour chaque catégorie vous permettra de vous rappeler plus facilement du code produit que vous souhaitez ajouter à votre facture.
        </Text>
        <View style={styles.formContainerSearch}>
          <TextInput
            style={styles.searchInput}
            placeholder="Trouver un produit.."
            value={searchTerm}
            onChangeText={searchText}
          />
        </View>
          <View >


          <FlatList
            key={'invoice'}
            data={products}
            renderItem={renderProductItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            style={styles.productList}
          />

          </View>
        </Layout>
      );
     });
     export default Client;

// Styles with responsive design
const styles = StyleSheet.create({
  icon2:{
    padding:10,
    width:width*0.18,
    height: width * 0.18,
  },
  column1: {
      flex: 1,
    padding: width * 0.02,
    alignItems:'left',
    justifyContent:'center',
  },
  productName: {
  fontSize: width * 0.03,
    fontWeight: 'bold',
    textTransform:'uppercase',
  },
  productDetails: {
  fontSize: width * 0.025,
    color: '#999',
  },
  column2: {
    flex: 0.5,
    padding: width * 0.02,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
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
  column00: {
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.002,
    borderColor : 'transparent',
    elevation: 2,
  },

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
    fontSize: width * 0.035,
    paddingTop: width * 0.001,
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
