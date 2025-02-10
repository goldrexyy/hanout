import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import { Card, Text } from '@ui-kitten/components';

const { height } = Dimensions.get('window'); // Get screen height

const Alert = ({ message, visible, onDismiss  }) => {
  const [translateY] = useState(new Animated.Value(-height)); // Start position above the screen

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: -height * 0.78, // Move to visible position
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Hide the alert after 2 seconds
      const timer = setTimeout(() => {
         Animated.timing(translateY, {
           toValue: -height, // Move back above the screen
           duration: 300,
           useNativeDriver: true,
         }).start(() => {
           if (onDismiss) {
             onDismiss(); // Call the onDismiss callback after animation
           }
         });
       }, 900);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [visible, translateY]);

  return (
    <Animated.View style={[styles.alertContainera, { transform: [{ translateY }] }]}>
        <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
};


// Styles with responsive design
const styles = StyleSheet.create({
  alertContainera: {
   position: 'absolute',
   top: 0,
   left: 20,
   right: 20,
   backgroundColor: 'green',
   borderRadius: 8,
   padding: 15,
   alignItems: 'center',
 },
 alertText: {
   color: 'white',
   fontWeight: 'bold',
 },
});

export default Alert;
