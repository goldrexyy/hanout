import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import Lottie from 'lottie-react-native'; // Import Lottie

const { width } = Dimensions.get('window');

const Success = ({ navigation }) => {
  const [animationVisible, setAnimationVisible] = useState(false);

  // This effect runs when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      setAnimationVisible(true); // Show animation
      const timer = setTimeout(() => {
        setAnimationVisible(false); // Hide animation after 4 seconds
      }, 4000); // 4 seconds

      return () => clearTimeout(timer); // Clean up timer on unmount
    }, [])
  );

  return (
    <Layout style={styles.container}>
      {animationVisible && (
        <Lottie
          source={require('../assets//animation/validscan.json')} // Change to your animation path
          autoPlay
          loop={false} // Play once
          duration={4000} // Animation duration (if supported)
          style={styles.animation} // Adjust size and positioning
        />
      )}

      <View style={styles.attribu}>
        <Text style={styles.Selecttext8}>Opération réussie !</Text>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animation: {
    width: width * 0.5, // Adjust width as needed
    height: width * 0.5, // Adjust height as needed
  },
  attribu:{
    flexDirection: 'row',
    justifyContent: 'space-between',  // This will place items at the extremes
   alignItems: 'center',  // Align items vertically centered
  },
  Selecttext8:{
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color:'#333'
  },
});

export default Success;
