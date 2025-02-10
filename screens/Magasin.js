import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

// Main options
const options = [
  { id: 1, title: 'Information sur mon magasin', icon: 'storefront-outline', category: 'mesinfos' },
  { id: 2, title: 'Gestion de mes produits', icon: 'cube-outline', category: 'products' },
  { id: 3, title: 'Gestion de stock', icon: 'library-outline', category: 'reports' },
  { id: 4, title: 'Synchroniser les données', icon: 'cloud-download-outline', category: 'Server' },
  { id: 5, title: 'Mon compte', icon: 'person-circle-outline', category: 'settings' }
];

// Sub-options for "Gestion des produits"
const subOptions = [
  { id: 1, title: 'Mes produits', icon: 'cube-outline', category: 'mesProduits' },
  { id: 2, title: 'Mes codes', icon: 'keypad-outline', category: 'ajouterCodeBarre' }
];

const NavigationPage = ({ navigation }) => {
  const [collapsedOption, setCollapsedOption] = useState(null);

  const handleOptionPress = (item) => {
    if (item.category === 'products') {
      // Toggle collapse for "Gestion des produits"
      setCollapsedOption(prev => (prev === item.id ? null : item.id));
    } else {
      setCollapsedOption(null);
      // Navigate to other pages
      if (item.category === 'mesinfos') navigation.navigate('Mesinfos');
      if (item.category === 'reports') navigation.navigate('Reports');
      if (item.category === 'settings') navigation.navigate('Settings');
    }
  };

  const handleSubOptionPress = (subItem) => {
    if (subItem.category === 'mesProduits') {
      navigation.navigate('MesProduits');
    } else if (subItem.category === 'ajouterCodeBarre') {
      navigation.navigate('Mescodes');
    }
  };

  const renderOptionItem = ({ item }) => (
    <View>
      <TouchableOpacity style={styles.optionCard} onPress={() => handleOptionPress(item)}>
        <View style={styles.cardContent}>
          {/* Column 1: Full blue background with icon */}
          <View style={styles.iconColumn}>
            <Ionicons name={item.icon} size={width * 0.07} color='white' />
          </View>
          {/* Column 2: Title */}
          <View style={styles.column2}>
            <Text style={styles.name}>{item.title}</Text>
          </View>
          {/* Column 3: Chevron */}
          <View style={styles.column3}>
            <Ionicons
              name={collapsedOption === item.id ? 'chevron-down-outline' : 'chevron-forward-outline'}
              size={width * 0.07}
              color='#8E8E93'
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Render Sub-options only for "Gestion des produits" */}
      {collapsedOption === item.id && item.category === 'products' &&
        subOptions.map((subItem) => (
          <TouchableOpacity key={subItem.id} style={styles.subOption} onPress={() => handleSubOptionPress(subItem)}>
            <View style={styles.subOptionContent}>
              <Ionicons name={subItem.icon} size={width * 0.06} color='#3682B3' />
              <Text style={styles.subOptionText}>{subItem.title}</Text>
              <Ionicons
                name='chevron-forward-outline'
                size={width * 0.06}
                color='#8E8E93'
                style={styles.subOptionChevron}
              />
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>

      <View style={{  backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <Text style={styles.Selecttext}>Magasin</Text>
      </View>



        <Layout style={styles.layout}>
        <View style={styles.card}>
              <View style={styles.avatarContainer}>

              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.namecard}>Moul Hanout</Text>
                <Text style={styles.code}>Code Unique: IF7766554433</Text>
                <Text style={styles.address}>Adresse: Rue Tansifet boulevard M6 N9</Text>
                <Text style={styles.phone}>Téléphone: 06-66-67-65-54</Text>
              </View>
              <View style={styles.qrContainer}>
                <QRCode
                  value='IF7766554433'
                  size={width * 0.3} // Taille du QR Code
                  color="white"
                  backgroundColor="transparent"
                />
              </View>
            </View>
        {/* Render Main Options */}
        <FlatList
    data={options}
    renderItem={renderOptionItem}
    keyExtractor={(item) => item.id.toString()}
    showsVerticalScrollIndicator={false} // Hides the scroll indicator
    contentContainerStyle={{ paddingBottom: 50 }} // Optional: add padding if needed
  />
        </Layout>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3682B3',

  },
  layout: {
    backgroundColor:'#fff',
    paddingHorizontal: 16,
    flex: 1,
    justifyContent:'center',
  },
  flat: {
    flex: 1,
    padding: 10,
  },
  Selecttext:{
    fontSize: width * 0.06,
    paddingTop:width*0.1,
    fontWeight: 'bold',
    color:'#333',
    paddingHorizontal:15,
  },
  header: {
    backgroundColor: '#3682B3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: width * 0.05,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.02,
    borderWidth: width * 0.003,
    borderColor: '#666',
    marginBottom: width * 0.04,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: width * 0.02,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  iconColumn: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: '#3682B3',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: width * 0.02,
    borderBottomLeftRadius: width * 0.02,
  },
  column2: {
    flex: 1,
    marginLeft: width * 0.05,
  },
  name: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#333',
  },
  column3: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subOption: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: width * 0.02,
    marginBottom: width * 0.02,
    marginLeft: width * 0.02,
  },
  subOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.05,
  },
  subOptionText: {
    fontSize: width * 0.04,
    color: '#333',
    flex: 1,
    marginLeft: width * 0.02,
  },
  subOptionChevron: {
    marginLeft: width * 0.02,
  },

  card: {
  backgroundColor: '#3682B3', // Fond bleu
  borderRadius: 10,
  padding: 15,
  marginVertical:10,
  alignItems: 'center',
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 5,
  width: width * 0.9, // Largeur de la carte
},
avatarContainer: {
  marginBottom: 10,
},
avatar: {
  width: width * 0.2, // Largeur de l'avatar
  height: width * 0.2, // Hauteur de l'avatar
  borderRadius: width * 0.1, // Pour un effet circulaire
},
infoContainer: {
  marginBottom: 10,
  alignItems: 'center',
},
namecard: {
  fontSize: 18,
  color: 'white',
  fontWeight: 'bold',
},
code: {
  fontSize: 14,
  color: 'white',
},
address: {
  fontSize: 14,
  color: 'white',
},
phone: {
  fontSize: 14,
  color: 'white',
},
qrContainer: {
  alignItems: 'center',
},
});

export default NavigationPage;
