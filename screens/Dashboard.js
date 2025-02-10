import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions, ActivityIndicator, SectionList, RefreshControl, Image} from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar, Divider } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import moment from 'moment';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import NewClient from './clients/NewClient';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import LoadingScreen from './LoadingScreen'; // Import your LoadingScreen
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


// Dimensions for responsive design
const { width, height } = Dimensions.get('window');



const Client = React.memo(({  selectedClient, isPressed }) => {



  return (

        <Layout style={styles.container}>

        </Layout>
      );
     });
     export default Client;

// Styles with responsive design
const styles = StyleSheet.create({


});
