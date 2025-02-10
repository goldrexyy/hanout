import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Avatar, Layout, Button, Divider} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import * as Icons from '@expo/vector-icons';
import Svg, { Rect } from 'react-native-svg';
import { useFonts } from 'expo-font';




const { width } = Dimensions.get('window');



const Action = ({ selectedItem , deleteItem ,OpenModifyItem, ModifyProductNoclose}) => {
  const timerRef = useRef(null);
const [incrementFactor, setIncrementFactor] = useState(1);
const [seconds, setSeconds] = useState(0);
const [fontsLoaded] = useFonts({
   'Codebar': require('../../assets/fonts/barcode.ttf'),
});
  const [product, setProduct] = useState({
    id: '',
    name: '',
    brand: '',
    quantity: 1,
    price: 0,
    stock: 0,
    nearbySolde: 0,
    timesSold: 0,
    avatar: '',
    codes: '',
    icon: '',
    exists:'',
  });

  useEffect(() => {
    if (selectedItem) {
      setProduct({
        ...selectedItem,
        quantity: parseFloat(selectedItem.quantity), // Convert price to float
        // Set any default values here if necessary, e.g., quantity: 1,
      });
    }
  }, [selectedItem]);

  const [showDescription, setShowDescription] = useState(false);

  const handleAddProduct = () => {
    AddProduct(product);
    console.log('Product added or modified:', product);
  };

  const handlePress = (direction) => {
    let incrementValue = 0.5; // Default increment

    // Update product quantity
    setProduct((prevProduct) => {
      const newQuantity = prevProduct.quantity + (direction === 'increment' ? incrementValue : -incrementValue);

      // Call ModifyProductNoclose with the updated quantity
      ModifyProductNoclose({ ...prevProduct, quantity: prevProduct.quantity + (direction === 'increment' ? incrementValue : -incrementValue) });


      // Return the updated product state
      return {
        ...prevProduct,
        quantity: newQuantity,
      };
    });
  };

  const handleLongPress = (direction) => {
    // Reset seconds counter
    setSeconds(0);

    // Start the timer
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 0.2; // Increase by the interval duration (200ms)

        // Determine increment value based on elapsed time
        let incrementValue = 0.5; // Default increment

        if (newSeconds > 5) {
          incrementValue = 100; // Increment by 100 after 10 seconds
        } else if (newSeconds > 3) {
          incrementValue = 10; // Increment by 10 after 5 seconds
        } else if (newSeconds > 2) {
          incrementValue = 2; // Increment by 2 after 2 seconds
        }  else if (newSeconds > 1) {
          incrementValue = 1; // Increment by 2 after 2 seconds
        }

        // Update product price
        setProduct((prevProduct) => ({
          ...prevProduct,
          quantity: prevProduct.quantity + (direction === 'increment' ? incrementValue : -incrementValue),
        }));

        return newSeconds; // Return updated seconds
      });
    }, 200); // Adjust the interval duration as needed
   ModifyProductNoclose(product);
  };

  const handlePressOut = () => {
    clearInterval(timerRef.current);

    setSeconds(0); // Reset seconds when button is released


  };

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  const styles = StyleSheet.create({

    container2: {
      padding: 10,
    },
    ActionBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: width * 0.02,
      backgroundColor: '#fff',
      borderRadius: width * 0.02,
      borderWidth : width * 0.003,
      borderColor:'transparent',
    },
    column0000: {
      backgroundColor:'transparent',
      alignItems:'center',
      justifyContent:'center',
    },
    icon:{
      padding:10,
    },
    column1: {
        flex: 1,
      padding: width * 0.02,
      alignItems:'left',
      justifyContent:'center',
    },
    productNameAction: {
      fontSize: width * 0.04,
      color:'#333',
    },
    productNameAction2: {
      fontSize: width * 0.03,
      color:'#666',
    },

    Selecttext14: {
      fontSize: width * 0.04,
      color: '#333',
      fontWeight: 'bold',
    },
    column4: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center',

    },
    Selecttext15: {
      fontSize: width * 0.07,
      color: '#333',
      fontWeight: 'bold',
      marginHorizontal:20,
    },
    column3: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center',
      paddingTop:10,
    },
    Selecttext9: {
    fontSize: width * 0.3,
    color: '#666',
    fontFamily: 'Codebar', // Use your custom font here
    letterSpacing: 5, // Adjust the value as needed for desired spacing
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth : width * 0.002,
    borderColor : 'transparent',
    elevation: 1,
  },
  column00: {
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
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
  divider2: {
    marginVertical: 5,
    backgroundColor: '#333',
  },

  });

    const iconMapping = {
      'cartinvoice': require('../../assets/invoice/cartinvoice.png'),
      'calculatorinvoice': require('../../assets/invoice/calculatorinvoice.png'),
      'barcodeinvoice': require('../../assets/invoice/barcodeinvoice.png'),
      'unknowninvoice': require('../../assets/invoice/unknowninvoice.png'),
      'barcodeinvoicegrey': require('../../assets/invoice/barcodeinvoicegrey.png'),
      'cartinvoicegrey': require('../../assets/invoice/cartinvoicegrey.png'),

    };
    const totalPrice = parseFloat((product.quantity * product.price).toFixed(2));
  return (
    <View style={styles.container2}>


    <TouchableOpacity style={styles.productCard}>
    <View style={styles.column00}>
      <Image
      source={
product.source === 'calculator'
? iconMapping['calculatorinvoice']
: product.source === 'cart'
? iconMapping['cartinvoice']
: product.source === 'scan'
  ? iconMapping['barcodeinvoice']
  : product.source === 'Unknown'
    ? iconMapping['unknowninvoice']
    : iconMapping['unknowninvoice'] // Fallback icon if none match
}
        style={styles.icon2}
      />
    </View>
      <View style={styles.column1}>
        <Text style={styles.productName}>{product.name}  </Text>
          <Text style={styles.productDetails}>{product.ean}</Text>
        <Text style={styles.productDetails}>
          Qty: <Text style={{ fontWeight: 'bold', color:'#000', fontSize:width*0.04 }}>{product.quantity}</Text> | Prix: <Text style={{ fontWeight: 'bold' }}>{product.price} Dh</Text>
        </Text>
      </View>

      <View style={styles.column2}>
        <Text style={styles.totalLabel}>Total in Dh</Text>
        <Text style={styles.totalPrice} numberOfLines={1} adjustsFontSizeToFit={true}>{totalPrice} Dh</Text>
      </View>
    </TouchableOpacity>


  <Divider style={styles.divider2}/>
    <TouchableOpacity style={styles.ActionBottom}>
      <View style={styles.column0000}>
        <Ionicons name="add" size={width * 0.08} style={styles.icon} />
      </View>
      <View style={styles.column1}>
        <Text style={styles.productNameAction}>
          Ajuster la quantité
        </Text>
        <Text style={styles.productNameAction2}>
          Maintenez les touches + ou - pour modifier la quantité du produit. Cette valeur sera mise à jour automatiquement sur votre facture.
        </Text>
      </View>
    </TouchableOpacity>

    <View style={styles.column4}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity
     onPressIn={() => handleLongPress('decrement')}
     onPress={() => handlePress('decrement')}
     onPressOut={handlePressOut}
             >
      <Icons.Ionicons name="remove-circle-sharp" size={width * 0.2} color="#333" />
    </TouchableOpacity>

  <Text style={styles.Selecttext15}>{product.quantity.toFixed(2)}</Text>

  <TouchableOpacity
  onPressIn={() => handleLongPress('increment')}
    onPress={() => handlePress('increment')}
onPressOut={handlePressOut}
            >
      <Icons.Ionicons name="add-circle-sharp" size={width * 0.2} color="#333" />
  </TouchableOpacity>
</View>

    </View>

    <TouchableOpacity style={styles.ActionBottom} onPress={() => OpenModifyItem()}>
      <View style={styles.column0000}>
        {product ? (
          product.exists ? (
            <Ionicons name="options" size={width * 0.08} style={styles.icon} />
          ) : (
            <Ionicons name="save-sharp" size={width * 0.08} style={styles.icon} />
          )
        ) : null}
      </View>
      <View style={styles.column1}>
        <Text style={styles.productNameAction}>
          {product ? (product.exists ? 'Modifier le nom et le prix' : 'Ajouter ce produit') : ''}
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.ActionBottom} onPress={() => deleteItem(product.id)}>
      <View style={styles.column0000}>
        <Ionicons name="trash" size={width * 0.08} color='#D15D5D' style={styles.icon} />
      </View>
      <View style={styles.column1}>
        <Text style={[styles.productNameAction, { color: '#D15D5D' }]}> Supprimer ce produit </Text>
      </View>
    </TouchableOpacity>

    </View>
  );
};



export default Action;
