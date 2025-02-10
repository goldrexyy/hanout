import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Layout, Button, ApplicationProvider } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import * as eva from '@eva-design/eva';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import UUID from 'react-native-uuid';


import PhoneInput from "react-native-phone-number-input";

import Success from './Success';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetScrollView  } from '@gorhom/bottom-sheet';

const { width } = Dimensions.get('window');




const Mesinfos = ({ navigation }) => {


  const [user, setUser] = useState({ name: '', id: '', phone: '1' });
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [originalName, setOriginalName] = useState('');
  const [originalPhone, setOriginalPhone] = useState(''); // State to hold the original phone number

  const phoneInput = useRef(null); // Reference for the Input inside NewClient

  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points
  const bottomSheetModalFirstRef = useRef(null);

  const [selectedComponent, setSelectedComponent] = useState(null); // Track modal content

  const BottomSheetContent = React.memo(() => {
    // Use a callback to render the content based on the ient
    const renderContent = useCallback(() => {
       return <Success />;
    }, []);

    return (
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
      </BottomSheetScrollView>
    );
  });

  const handlePresentModalFirstPress = useCallback((component) => {
    // If it's a string, handle it as a component type

      setSelectedComponent(component);
      console.log('what component', component);

      // Adjust snap point based on component type
     if (component === 'Success') {
        setSnapPoint(['40%']);  // Set snap point for 'Modify'
      } else {
        setSnapPoint(['50%']);  // Default snap point for other cases
      }

    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.present();
  }, []);
  // callbacks
  const handlePresentModalFirstClose = useCallback(() => {
    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.close();
  }, []);

  const renderBackdrop = (props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // Backdrop shows up when sheet is open
            disappearsOnIndex={-1} // Backdrop disappears when closed
            pressBehavior="close" // Close the modal when backdrop is pressed
            opacity={0.9} // Adjust opacity
          />
        );

  // Load user data from AsyncStorage when component mounts
useEffect(() => {
const loadUserData = async () => {
  try {
    const storedName = await AsyncStorage.getItem('user.name');
    const storedId = await AsyncStorage.getItem('user.id');
    const storedPhone = await AsyncStorage.getItem('user.phone');

    // Log the values to ensure they are loaded correctly
    console.log('Stored Name:', storedName);
    console.log('Stored ID:', storedId);
    console.log('Stored Phone:', storedPhone);

    setUser({
      name: storedName || '',
      id: storedId || '',
      phone: storedPhone || '',  // Set phone number or default to empty
    });

    // Update loading state
    setIsLoading(false);
    setOriginalName(storedName || '');
    setOriginalPhone(storedPhone || ''); // Set the original phone number
  } catch (error) {
    console.log('Error loading user data:', error);
    setIsLoading(false); // Ensure loading state is updated on error
  }
};

loadUserData();
}, []);

if (isLoading) {
  return <View><Text>Loading...</Text></View>; // Optionally show loading text
}

const handleSave = async () => {
  try {
    // If user.id is not found, generate a new one
    if (!user.id) {
      const newId = UUID.v4(); // Generate a new UUID
      setUser((prevUser) => ({ ...prevUser, id: newId }));
      await AsyncStorage.setItem('user.id', newId);
    }

    // Remove country code from phone number before saving
    const phoneWithoutCode = user.phone.replace('+212', ''); // Remove +212 from the phone number

    // Save user data to AsyncStorage
    await AsyncStorage.setItem('user.name', user.name);
    await AsyncStorage.setItem('user.phone', phoneWithoutCode); // Save the modified phone number
    await setOriginalName(user.name);
    await setOriginalPhone(phoneWithoutCode);

    // Open success bottom sheet
    handlePresentModalFirstPress('User data saved!');

    // Wait for 2 seconds before performing further actions, if needed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Optional: You can perform any additional actions here after the wait

  } catch (error) {
    console.log('Error saving user data:', error);
  }
};

const isDisabled =
  (user.name === '' || user.phone === '') || // Disable if either field is empty
  (user.name === originalName && user.phone === originalPhone); // Disable if both fields are unchanged



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
    Selecttext: {
      fontSize: width * 0.06,
      paddingTop: width * 0.1,
      fontWeight: 'bold',
      color: 'white',
      padding: 15,
    },
    Selecttext1: {
      fontSize: width * 0.04,
      paddingTop: width * 0.04,
      fontWeight: 'bold',
      color: '#333',
      paddingHorizontal: 15,
    },
    Selecttext2: {
      fontSize: width * 0.03,
      color: '#666',
      paddingHorizontal: 15,
    },
    formContainer: {
      padding:10,
      width:'100%',
      backgroundColor:'white',
      justifyContent:'center',
      flex:1,
    },
    input: {
      borderRadius: width * 0.02,
      borderWidth : width * 0.003,
      borderColor : '#666',
      padding: 10,
      backgroundColor: '#F6F6F6',
      fontSize: width * 0.04,
      height:50,
      width:width * 0.9,
      margin:10,
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
    ButtonCreatInvoiceContainer: {
      height:70,
      color:'#fff',
      alignItems:'center',

    },
    creatinvoicebutton :{
      backgroundColor:isDisabled ? '#f2f2f2' : '#3682B3',
      borderRadius: 50,
      color:'#fff',
      margin:10,
          width:width * 0.9,
   // Space between buttons when both are shown
    },

  });
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={{  backgroundColor: '#3682B3', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <Text style={styles.Selecttext}>Mon magasin</Text>
      </View>


        <View style={styles.formContainer}>

         <Text style={styles.Selecttext1}>Votre nom commercial</Text>
         <Text style={styles.Selecttext2}>Le nom commercial que vous choisissez sera visible par tous vos clients, car il apparaîtra dans l'en-tête de vos factures. Vous n'êtes pas obligé d'utiliser votre prénom et nom de famille ; nous vous conseillons d'opter pour un nom commercial en lien avec votre entreprise, marque ou activité. Ce nom pourra être modifié à tout moment, selon vos besoins.</Text>
          <TextInput
            placeholder="Name Client"
            value={user.name}
            onChangeText={(value) => setUser({ ...user, name: value })}
            style={styles.input}
          />

          <Text style={styles.Selecttext1}>Votre identifiant unique</Text>
          <Text style={styles.Selecttext2}>Votre identifiant unique est automatiquement généré dès l'installation de l'application Hanouty. Cet identifiant vous est propre et apparaît sur vos factures pour identifier clairement votre activité. Il reste strictement confidentiel et n'est pas partagé avec des tiers. Seuls vos clients et vos partenaires commerciaux auront connaissance de cet identifiant.</Text>
          <TextInput
            placeholder={user.id}
            value={user.id}
            style={styles.input}
            disabled
          />
          {/* Moroccan Flag using SVG */}
          <Text style={styles.Selecttext1}>Votre numéro de téléphone</Text>
          <Text style={styles.Selecttext2}>Votre numéro de téléphone n'est pas obligatoire. Toutefois, si vous choisissez de le partager, il sera visible sur vos factures et renforcera la sécurité de votre compte ainsi que la vérification de votre identité par l'équipe Hanouty.</Text>

          <PhoneInput
                ref={phoneInput}
                value={user.phone}
                defaultCode="MA" // Set Moroccan country code
                layout="first"
                onChangeFormattedText={(value) => {    setUser({ ...user, phone: value });    }}
                containerStyle={styles.input2}
                style={styles.input}
                countryPickerProps={'MA'}
              />

              <View >

      </View>

          <View style={styles.ButtonCreatInvoiceContainer}>
            <Button
              style={[styles.creatinvoicebutton]} // Full width when focused is false
               disabled={isDisabled} // Button is disabled until user.name is different from originalName and not empty
                 onPress={handleSave}
               >
                  Enregistrer
             </Button>
          </View>
        </View>

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalFirstRef}
            snapPoints={snapPoint}
            index={0} // Starts closed
            enableContentPanningGesture={true}
            enableHandlePanningGesture={true}
            backgroundStyle={styles.backgroundcontainer}
            style={styles.bottomsheetcontainer}
            handleStyle={styles.handlebottomsheet}
            enablePanDownToClose={true} // Allow closing by dragging down
            backdropComponent={renderBackdrop}
          >
          <BottomSheetContent
               />
          </BottomSheetModal>
      </BottomSheetModalProvider>

    </ApplicationProvider>
  );
};



export default Mesinfos;
