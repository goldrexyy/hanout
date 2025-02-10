import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, ScrollView, FlatList, Image} from 'react-native';
import { Avatar, Layout, Button } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'; // Adjust import if needed


import PhoneInput from "react-native-phone-number-input";

const { width } = Dimensions.get('window');


const NewClient = ({AddClient}) => {
  const [client, setClient] = useState({
    idunique: '899968686864',
    name: '',
    avatar: '', // Default avatar
    number:'',
    userid: 1,
    nbrunpaid: 0,
    lat: 0,
    long: 0,
    nbrinvoice: 0,
    nbrpaid: 0,
    deleted: 0,
    description:'',
  });



  const [showDescription, setShowDescription] = useState(false);
   const phoneInput = useRef(null); // Reference for the Input inside NewClient


   const iconMapping = {
     'user': require('../../assets/users/user.png'),
     'user2': require('../../assets/users/user2.png'),
     'user3': require('../../assets/users/user3.png'),
     'user4': require('../../assets/users/user4.png'),
   };

   const iconMappingwhite = {
     'user-white': require('../../assets/users/user-white.png'),
     'user2-white': require('../../assets/users/user2-white.png'),
     'user3-white': require('../../assets/users/user3-white.png'),
     'user4-white': require('../../assets/users/user4-white.png'),
   };

   // Array of avatars for the carousel
   const initialAvatars = [
     { id: 'user-white', name: 'user'},
     { id: 'user2-white', name: 'user2'},
     { id: 'user3-white', name: 'user3'},
     { id: 'user4-white', name: 'user4' },
   ];

    const [avatars, setAvatars] = useState(initialAvatars); // State to track avatars

    const handleAvatarPress = (name) => {
    // Update the state to reflect which avatar is selected
    const updatedAvatars = avatars.map((avatar) => ({
      ...avatar,
      selected: avatar.name === name ? true : false,
    }));

    setAvatars(updatedAvatars);
  };

  const renderAvatar = ({ item }) => (
    <TouchableOpacity onPress={() => handleAvatarPress(item.name)}>
      <Image
        source={item.selected ? iconMapping[item.name] : iconMappingwhite[item.id]}
        style={styles.avatar}
      />
    </TouchableOpacity>
  );


  const handleAddClient = () => {
    AddClient(client);
    // Logic to add product to the list
    console.log('Product added to list:', client);
  };

  const styles = StyleSheet.create({
    flatListContent: {
       paddingHorizontal: 10, // Add horizontal padding to the FlatList
     },
    input2: {

      borderRadius: width * 0.02,
      borderWidth : width * 0.003,
      borderColor : '#666',
      backgroundColor: '#F6F6F6',
      fontSize: width * 0.04,
      height:60,
      margin:10,
      width:width * 0.9,
    },

    input3: {

      borderRadius: width * 0.02,
      borderWidth : width * 0.003,
      borderColor : '#666',
      backgroundColor: '#F6F6F6',
      fontSize: width * 0.04,
      height:100,
      margin:10,
      width:width * 0.9,
      padding:10,
    },

      flagContainer: {
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: 8,
},
Selecttext14: {
  fontSize: width * 0.04,
  color: '#333',
  fontWeight: 'bold',
},
Selecttext144: {
  fontSize: width * 0.03,
  color: '#666',
},
container: {

     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 20, // Add some vertical padding

},
container2: {
  padding: 10,
},
titleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginLeft: 8,
  color: '#FF4C4C', // Red color for emphasis
},
infoText: {
  fontSize: 16,
  marginBottom: 16,
  textAlign: 'center',
  color: '#555555', // Dark gray for better readability
},
avatar: {
  marginBottom: 16,
},
formContainer: {
  padding: 10,
  width: '100%',
},
input: {
  borderRadius: width * 0.02,
  borderWidth: width * 0.003,
  borderColor: '#666',
  padding: 10,
  backgroundColor: '#F6F6F6',
  fontSize: width * 0.04,
  height: 50,
  margin: 10,
},
input2: {
  borderRadius: width * 0.02,
  borderWidth: width * 0.003,
  borderColor: '#666',
  backgroundColor: '#F6F6F6',
  fontSize: width * 0.04,
  height: 60,
  margin: 10,
  width: width * 0.9,
},
input3: {
  borderRadius: width * 0.02,
  borderWidth: width * 0.003,
  borderColor: '#666',
  backgroundColor: '#F6F6F6',
  fontSize: width * 0.04,
  height: 100,
  margin: 10,
  width: width * 0.9,
  padding: 10,
},
ButtonCreatInvoiceContainer: {
  height: 70,
  color: '#fff',
},
creatinvoicebutton: {
  backgroundColor: client.name ? '#3682B3' : '#f2f2f2',
  borderRadius: 50,
  color: '#fff',
  margin: 10,
},

cardContent: {
  flexDirection: 'row',
},
column1: {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#3682B3',
  flex: 0.4,
  height: 100,
},
column2: {
  flex: 1,
  paddingLeft: 3,
  backgroundColor: '#3682B3',
  justifyContent: 'center',
},
column3: {
  flex: 1,
  justifyContent: 'center',
  alignItems:'center',
  paddingTop:10,
},
column4: {
  flex: 1,
  justifyContent: 'center',
  alignItems:'center',
  marginVertical:10,
},
icon: {
  padding: 2,
},
date: {
  fontSize: width * 0.025,
  color: '#333',
  fontWeight: 'bold',
},
description: {
  fontSize: width * 0.025,
  color: '#666',
},
Selecttext8: {
  fontSize: width * 0.05,
  fontWeight: 'bold',
  color: '#fff',
  textTransform: 'uppercase',
},
Selecttext14: {
  fontSize: width * 0.04,
  color: '#333',
  fontWeight: 'bold',
},
Selecttext15: {
  fontSize: width * 0.07,
  color: '#333',
  fontWeight: 'bold',
  marginHorizontal:20,
},
Selecttext9: {
fontSize: width * 0.3,
color: '#666',
fontFamily: 'Codebar', // Use your custom font here
letterSpacing: 5, // Adjust the value as needed for desired spacing
},
flagContainer: {
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: 8,
},

suggestionsContainer: {
flexDirection: 'row',
margin: 10,
},
suggestionTag: {
backgroundColor: '#ddd',
paddingVertical: 5,
paddingHorizontal: 10,
borderRadius: 20,
marginHorizontal: 5,
},
suggestionText: {
fontSize: 16,
},
avatar: {
  width: width*0.25,
  height: width*0.25,
  margin: 10,

},
selectedAvatarContainer: {
   marginTop: 20,
   padding:20,
 },
 selectedAvatar: {
  width: width*0.18,
  height: width*0.18,
},
  });

  return (
    <Layout style={styles.container}>
      <View style={styles.formContainer}>


      <TouchableOpacity >
        <Text style={styles.Selecttext14}>Nouveau client </Text>
        <Text style={styles.Selecttext144}>Enregistrez de nouveaux clients pour leur attribuer des factures et des remboursements.</Text>
  <Text style={styles.Selecttext144}>Suivez leur balance commerciale via le tableau de bord.</Text>
  <Text style={styles.Selecttext144}>Contactez-les pour partager les factures impayées à tout moment.</Text>


      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.Selecttext14}>Avatar client</Text>
        <Text style={styles.Selecttext144}>Choisissez un avatar représentant votre client pour personnaliser l'expérience. Cliquez sur l'image ci-dessous pour commencer !</Text>
    </TouchableOpacity>


      <BottomSheetScrollView horizontal showsVerticalScrollIndicator={false}>
     {/* Other content */}
     <View style={styles.container}>
       <FlatList
         data={avatars}
         horizontal
         keyExtractor={(item) => item.id}
         showsHorizontalScrollIndicator={false}
         renderItem={renderAvatar}
         contentContainerStyle={styles.flatListContent}
         scrollEnabled={true} // Ensure FlatList can scroll
       />
     </View>
   </BottomSheetScrollView>

   <TouchableOpacity>
       <Text style={styles.Selecttext14}>Nom du client (Obligatoire)</Text>
       <Text style={styles.Selecttext144}>Entrez le nom du client. Ce nom apparaîtra sur toutes les factures attribuées.</Text>
   </TouchableOpacity>


        <BottomSheetTextInput
          placeholder="Nom du client.."
          value={client.name}
          onChangeText={(value) => setClient({ ...client, name: value })}
          style={styles.input}
        />
        {/* Moroccan Flag using SVG */}
        <TouchableOpacity>
      <Text style={styles.Selecttext14}>Numéro de téléphone</Text>
      <Text style={styles.Selecttext144}>Entrez le numéro du client pour le contacter via WhatsApp. Aucun SMS de vérification ne sera envoyé.</Text>
  </TouchableOpacity>

        <PhoneInput
              ref={phoneInput}
              value={client.number}
              defaultCode="MA" // Set Moroccan country code
              layout="first"
              onChangeText={(value) => setClient({ ...client, number: value })}
              containerStyle={styles.input2}
              style={styles.input}
              countryPickerProps={'MA'}
            />


            <TouchableOpacity >
              <Text style={styles.Selecttext14}>Description </Text>
              <Text style={styles.Selecttext144}>Ajoutez une description du client pour vous rappeler de lui. Par exemple : "Votre voisin", "Le film d'Amine", "L'épouse de Rachid", etc.</Text>
              </TouchableOpacity>

        <BottomSheetTextInput
          placeholder="Description..."
          value={client.description}
          onChangeText={(value) => setClient({ ...client, description: value })}
          style={styles.input3}
          multiline
          numberOfLines={14} // Adjust the number of lines as needed
          textAlignVertical="top" // Align text to the top
        />



        <View style={styles.ButtonCreatInvoiceContainer}>
          <Button
            style={[styles.creatinvoicebutton]} // Full width when focused is false
             onPress={() => handleAddClient()} // Use an arrow function to call handleAddToList
            disabled={!client.name}
          >
          AJOUTER NOUVEAU CLIENT
           </Button>
        </View>

      </View>
    </Layout>
  );
};



export default NewClient;
