import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions,Animated , StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import SettingsScreen from "./screens/SettingsScreen";
import CourseListScreen from "./screens/CourseListold";
import { interpolateColor } from 'react-native-reanimated';
import ProfileScreen from "./screens/Profile";
import AboutStack from "./screens/AboutScreen";
import Calculator from "./screens/Calculator";
import Camera from "./screens/Camera";
import Mesinfos from "./screens/Mesinfos";
import Mescodes from "./screens/Mescodes";
import Mescodescategory from "./screens/Mescodescategory";
import Mescodesproducts from "./screens/Mescodesproducts";
import HomeScreen from "./screens/HomeScreen";
import HistoryInvoice from "./screens/HistoryInvoice";
import ListClientsInvoice from "./screens/ListClientsInvoice";
import ListClientsRembourssement from "./screens/ListClientsRembourssement";
import ListClients from "./screens/ListClients";
import Magasin from "./screens/Magasin";
import Dashboard from "./screens/Dashboard";
import LoginScreen from "./screens/login/LoginScreen";
import RegisterScreen from "./screens/login/RegisterScreen";
import InvoiceHistoryScreen from "./screens/InvoiceHistoryScreen";
import PerformanceScreen from "./screens/PerformanceScreen";
import InvoiceSummaryScreen from "./screens/InvoiceSummaryScreen";
import ReceiveSummaryScreen from "./screens/ReceiveSummaryScreen";
import ReceiveHistoryScreen from "./screens/ReceiveHistoryScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons'; // or the appropriate icon library you are using
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Add this import
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import CreateDatabase from './screens/CreateDatabase';
import { enableScreens } from 'react-native-screens';
import { SafeAreaView} from 'react-native-safe-area-context';
enableScreens(false); // Disables optimizations that may apply safe area.


LogBox.ignoreAllLogs();


// Fetch device dimensions for responsive design
const { width, height } = Dimensions.get('window');
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Header Component
const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
    <TouchableOpacity
      onPress={() => navigation.navigate('LoginScreen')} // Navigate to help screen or perform action
    >
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} // Replace with your avatar URL
        style={styles.avatar}
      ></Image>
      </TouchableOpacity>

      <View style={styles.headerRightContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('About')} // Navigate to help screen or perform action
          style={styles.iconButton}
        >
          <FontAwesome name="question-circle" size={width * 0.06} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Calculator')} // Navigate to camera screen or perform action
          style={styles.iconButton}
        >
          <Ionicons name="calculator" size={width * 0.07} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Custom Stack Header for the back button
const CustomStackHeader = (props) => {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (

    <View style={styles.container}>
    <View style={styles.headerContainer}>
      {canGoBack && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.circle}>
            <Entypo name="chevron-left" size={width * 0.06} color="white" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  </View>
  );
};

// Bottom Tab Navigator
function TabNavigator() {
  const [isPressed, setIsPressed] = useState(true); // Initial state for isPressed

  // Memoize the handlePressStateChange function to avoid re-rendering unless isPressed changes
  const handlePressStateChange = useCallback((newState) => {
    setIsPressed(newState);
  }, []);

  // Memoize the tab bar button style for the "Scan" tab to optimize rendering
  const scanTabButtonStyle = useMemo(() => ({
    height: 70,
    width: 70,
    backgroundColor: isPressed ? '#333' : '#333', // Blue if pressed, red if not
    color: isPressed ? '#fff' : '#fff', // Blue if pressed, red if not
    borderRadius: 35,
    marginTop: -15,
    padding: 10,
  }), [isPressed]);

  return (
    <Tab.Navigator
    initialRouteName="Scan" // Set Scan (Home) tab as default
    screenOptions={({ route }) => {
      const isScanFocused = route.name === 'Scan';

      return {
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      let iconSize = size * 1; // Default icon size

      // Adjust icon size for Scan tab when not focused
      if (route.name === 'Scan') {
        iconSize = focused ? size * 1.6 : size * 1.76; // Make it larger when not focused
      }

      switch (route.name) {
        case 'Scan':
          iconName = focused ? 'barcode' : 'barcode-outline';
          color = focused ? 'white' : 'white'; // Keep icon color white regardless of focus for Scan
          break;
        case 'PerformanceScreen':
          iconName = focused ? 'speedometer' : 'speedometer-outline';
          color = focused ? 'white' : '#a5a5a5'; // Set inactive color to #a5a5a5
          break;
        case 'Magasin':
          iconName = focused ? 'storefront' : 'storefront-outline';
          color = focused ? 'white' : '#a5a5a5'; // Set inactive color to #a5a5a5
          break;
        case 'History':
          iconName = focused ? 'receipt' : 'receipt-outline';
          color = focused ? 'white' : '#a5a5a5'; // Set inactive color to #a5a5a5
          break;
        case 'ListClients':
          iconName = focused ? 'people' : 'people-outline';
          color = focused ? 'white' : '#a5a5a5'; // Set inactive color to #a5a5a5
          break;
        default:
          iconName = 'question';
          color = '#a5a5a5'; // Default color for any unknown icons
      }

      return <Icon name={iconName} size={iconSize} color={color} />;
    },
        tabBarActiveTintColor: 'white', // Active label color
        tabBarInactiveTintColor: '#a5a5a5', // Default inactive label color for other tabs
        tabBarStyle: {
          backgroundColor: '#191919',
          borderTopLeftRadius: width * 0.04,
          borderTopRightRadius: width * 0.04,
          position: 'absolute',
          bottom: 0,
          height: 50, // Default height for all tabs
          elevation: 0,
        },
        // Show label for Scan tab to 'Scan' with white color when focused
        tabBarLabel: isScanFocused ? '' : 'Scan', // Show 'Scan' when focused
      };
    }}
  >
    <Tab.Screen
      name="PerformanceScreen"
      component={Dashboard}
      options={{ tabBarLabel: 'Performance',  headerShown: false }}
    />
    <Tab.Screen
      name="ListClients"
      component={ListClients}
      options={{
        tabBarLabel: 'Clients',
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Scan"
      options={{
        headerShown: false,
        tabBarShowLabel: false, // Ensure no label for the Scan tab
        tabBarButton: (props) => (
          <View style={scanTabButtonStyle}>
            <TouchableOpacity {...props} />
          </View>
        ),
      }}
    >
      {(props) => (
        <HomeScreen {...props} onPressStateChange={handlePressStateChange} />
      )}
    </Tab.Screen>
    <Tab.Screen
      name="History"
      component={HistoryInvoice}
      options={{ tabBarLabel: 'Historique', headerShown: false }}
    />
    <Tab.Screen
      name="Magasin"
      component={Magasin}
      options={{ tabBarLabel: 'Magasin' ,  headerShown: false}}
    />
  </Tab.Navigator>


  );
}
// Main App Component
export default function App() {
  const initializeDatabase = () => {
    // This function should create tables or initialize any necessary data.

  };
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
    <SQLiteProvider databaseName="test.db" onInit={initializeDatabase}>
      <ApplicationProvider {...eva} theme={eva.light}>
        {/* Wrap everything with SafeAreaView to avoid overlaps */}
        <StatusBar
            barStyle="dark-content" // Customize the status bar style
            translucent={true} // Make the status bar translucent
            backgroundColor="transparent" // Remove background color if needed
          />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                header: () => <CustomStackHeader />,
              }}
            >
              <Stack.Screen name="Navigator" component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen
                name="Invoice"
                component={InvoiceSummaryScreen}
                options={{
                  headerTransparent: true, // Make header transparent
                  headerStyle: {
                    backgroundColor: 'transparent', // Ensure background is transparent
                  },
                  headerTitle: '', // Hide the header title if necessary
                }}
              />
              <Stack.Screen name="Receive" component={ReceiveSummaryScreen} />
              <Stack.Screen name="Clients" component={ListClientsInvoice} />
              <Stack.Screen name="Clientsrembourssement" component={ListClientsRembourssement} />
              <Stack.Screen name="InvoiceHistoryScreen" component={InvoiceHistoryScreen} />
              <Stack.Screen name="ReceiveHistoryScreen" component={ReceiveHistoryScreen} />
              <Stack.Screen name="About" component={AboutStack} initialParams={{ name: "Your data here" }} options={{ tabBarLabel: "" }} />
              <Stack.Screen name="Calculator" component={Calculator} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Mesinfos" component={Mesinfos} />
              <Stack.Screen name="Mescodes" component={Mescodes} />
              <Stack.Screen name="Mescodescategory" component={Mescodescategory} />
              <Stack.Screen name="Mescodesproducts" component={Mescodesproducts} />
            </Stack.Navigator>
          </NavigationContainer>

      </ApplicationProvider>
    </SQLiteProvider>
  </GestureHandlerRootView>

  );
}

// Stylesheet with responsive adjustments
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 20, // Adjust for spacing from the top
    left: 20, // Adjust for spacing from the left
  },
  circle: {
    width: width*0.07, // Set the diameter of the circle
    height: width*0.07, // Set the diameter of the circle
    borderRadius: 25, // Make it a circle (radius is half of the diameter)
    backgroundColor: '#333', // Set circle color to black
    alignItems: 'center', // Center the icon horizontally
    justifyContent: 'center', // Center the icon vertically
  },

  avatar: {
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.045,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: width * 0.03,
  },
  backButton: {
    paddingLeft: width * 0.03,
  },
  totalText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color:'white',
    alignItems: 'center',
  },
  tabBar: {
   backgroundColor: '#191919',
   borderTopLeftRadius: width * 0.015,
   borderTopRightRadius: width * 0.015,
 },
 tabIcon: {
   transform: [{ scale: 1 }],
 },
});
