import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Animated, Dimensions } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  const { height, width } = Dimensions.get('window');
  useEffect(() => {
    // Simulate fake progress
    Animated.timing(progress, {
      toValue: 1, // Progress until 100%
      duration: 3000, // Duration for the loading bar animation (3 seconds)
      useNativeDriver: false,
    }).start();
  }, []);



  return (
    <Layout style={styles.container}>
      <ImageBackground
        source={require('../assets/waiter.png')}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={[styles.loadingContainer, { marginTop: height * 0.5 }]}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width * 0.8], // Progress from 0 to 80% of screen width
                  }),
                },
              ]}
            />
          </View>
        </View>
      </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  loadingText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  progressBarBackground: {
    width: '80%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3682B3',
    borderRadius: 5,
  },
});

export default LoadingScreen;
