import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Avatar, Layout, Button, Divider, RangeCalendar  } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import * as Icons from '@expo/vector-icons';





const { width } = Dimensions.get('window');



const Action = ({ filter, startdate, enddate }) => {

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [range, setRange] = useState({ startDate: null, endDate: null });
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
  const onSelectRange = (range) => {
   setRange(range);
   if (range.startDate && range.endDate) {
     setCalendarVisible(false);
     filter('custom', range.startDate, range.endDate);
     startdate(range.startDate);
     enddate(range.endDate);
   }
 };


  return (
    <View style={styles.container2}>
      {calendarVisible ? (
        <TouchableOpacity>
          <View style={styles.column1}>
            <Text style={styles.productNameAction}>Choisir la date</Text>
          </View>

          <RangeCalendar
            range={range}
            onSelect={onSelectRange}
            style={styles.calendar}
          />
        </TouchableOpacity>

      ) : (
        <>
          <TouchableOpacity style={styles.ActionBottom}>
            <View style={styles.column0000}>
              <Ionicons name="calendar" size={width * 0.08} style={styles.icon} />
            </View>
            <View style={styles.column1}>
              <Text style={styles.productNameAction}>Filter par date</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => filter('recent')}>
            <View style={styles.column1}>
              <Text style={styles.productNameAction}>Récent</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => filter('today')}>
            <View style={styles.column1}>
              <Text style={styles.productNameAction}>Aujourd'hui</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => filter('yesterday')}>
            <View style={styles.column1}>
              <Text style={styles.productNameAction}>Hier</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => filter('thisweek')}>
            <View style={styles.column1}>
              <Text style={styles.productNameAction}>Cette semaine</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => filter('lastweek')}>
            <View style={styles.column1}>
              <Text style={styles.productNameAction}>Semaine dernière</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => setCalendarVisible(true)}>
            <View style={styles.column1}>
              <Text style={styles.productNameAction}>Choisir la date</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ActionBottom} onPress={() => filter('Tout')}>
            <View style={styles.column0000}>
              <Ionicons name="trash" size={width * 0.08} color="#D15D5D" style={styles.icon} />
            </View>
            <View style={styles.column1}>
              <Text style={[styles.productNameAction, { color: '#D15D5D' }]}>
                Annuler le filtre
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};



export default Action;
