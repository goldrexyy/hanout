import React from 'react';
import { Layout, Button, Input } from '@ui-kitten/components';
import { StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import { useNavigation } from '@react-navigation/native'; // For navigation
import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

// Fetch device dimensions for responsive design
const { width, height } = Dimensions.get('window');




export default function LoginScreen() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '1030748395951-6mmthfjrt9cbbmihor1umcod1tgb13nk.apps.googleusercontent.com', // Replace with your web client ID
    androidClientId:'1030748395951-7qgthgq9bs7rsf5tqptql62s8mgt8pu5.apps.googleusercontent.com',
  },
);

  const navigation = useNavigation(); // For navigation

  React.useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem('@user');
    if (!user) {
      if (response?.type === 'success') {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
      navigation.navigate('Navigator'); // Navigate to the main app page if user is already logged in
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      const userId = uuidv4(); // Generate a unique user ID
      const userWithId = { ...user, id: userId };

      await AsyncStorage.setItem('@user', JSON.stringify(userWithId));
      setUserInfo(userWithId);

      navigation.navigate('Navigator'); // Navigate after successful login
    } catch (error) {
      console.error('Error fetching user info', error);
    }
  };

  return (
    <Layout style={styles.container}>

      {/* Logo or welcome text */}
      <Image
       style={styles.logo}
        source={require('../../assets/logo.png')}
       />
      <Text style={styles.welcomeText}>Welcome to MyApp</Text>

      {/* User Info Display */}
      {userInfo ? (
        <Text style={styles.userInfoText}>Logged in as: {userInfo.name}</Text>
      ) : (
        <Text style={styles.infoText}>Please sign in to continue</Text>
      )}

      {/* Google Sign-In Button */}
      <Button
        style={styles.button}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        Sign in with Google
      </Button>


      {/* Sign Out Button */}
      {userInfo && (
        <Button
          style={styles.signOutButton}
          appearance='outline'
          onPress={() => {
            AsyncStorage.removeItem('@user');
            setUserInfo(null);
          }}
        >
          Sign Out
        </Button>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  logo: {
    width: width * 0.34,
    height: width * 0.26,
    marginBottom:50,
  },
  welcomeText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#220f76',
    borderColor: 'transparent',
    marginTop: 20,
  },
  signOutButton: {
    width: '80%',
    marginTop: 10,
  },
});
