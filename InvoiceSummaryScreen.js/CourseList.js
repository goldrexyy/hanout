import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, Dimensions } from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';

// Dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Sample Data
const initialData = [
  {
    "id": 1,
    "name": "John Doe",
    "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
    "birthDate": "12/04/1985",
    "description": "A software developer with a passion for open source projects.",
    "sex": "Male"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "avatar": "https://randomuser.me/api/portraits/women/2.jpg",
    "birthDate": "22/08/1990",
    "description": "A graphic designer who loves creating visually stunning art.",
    "sex": "Female"
  },
  {
    "id": 3,
    "name": "Alice Johnson",
    "avatar": "https://randomuser.me/api/portraits/women/3.jpg",
    "birthDate": "15/11/1982",
    "description": "A content writer with a knack for storytelling and marketing.",
    "sex": "Female"
  },
  {
    "id": 4,
    "name": "Bob Brown",
    "avatar": "https://randomuser.me/api/portraits/men/4.jpg",
    "birthDate": "03/02/1978",
    "description": "A data analyst who enjoys solving complex problems with data.",
    "sex": "Male"
  },
  {
    "id": 5,
    "name": "Cathy Green",
    "avatar": "https://randomuser.me/api/portraits/women/5.jpg",
    "birthDate": "27/06/1989",
    "description": "An entrepreneur and consultant specializing in business strategy.",
    "sex": "Female"
  },
  {
    "id": 6,
    "name": "David White",
    "avatar": "https://randomuser.me/api/portraits/men/6.jpg",
    "birthDate": "09/12/1980",
    "description": "A mechanical engineer with a passion for innovative design.",
    "sex": "Male"
  },
  {
    "id": 7,
    "name": "Ella Black",
    "avatar": "https://randomuser.me/api/portraits/women/7.jpg",
    "birthDate": "19/05/1991",
    "description": "A fashion stylist with a keen eye for trends and design.",
    "sex": "Female"
  },
  {
    "id": 8,
    "name": "Frank Gray",
    "avatar": "https://randomuser.me/api/portraits/men/8.jpg",
    "birthDate": "30/09/1975",
    "description": "A professional chef who loves experimenting with new recipes.",
    "sex": "Male"
  },
  {
    "id": 9,
    "name": "Gina Blue",
    "avatar": "https://randomuser.me/api/portraits/women/9.jpg",
    "birthDate": "14/07/1988",
    "description": "A fitness trainer dedicated to helping others achieve their health goals.",
    "sex": "Female"
  },
  {
    "id": 10,
    "name": "Harry Gold",
    "avatar": "https://randomuser.me/api/portraits/men/10.jpg",
    "birthDate": "24/10/1979",
    "description": "A financial advisor with extensive experience in investment strategies.",
    "sex": "Male"
  }
];

export default function App({ navigation, route }) {
  // State variables
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [maleChecked, setMaleChecked] = useState(false);
  const [femaleChecked, setFemaleChecked] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const scrollViewRef = useRef(null);
  const { itemId } = route.params;

  // Filtered list based on search input
  const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handle delete action
  const handleDelete = (id) => {
    const updatedItems = data.filter(item => item.id !== id);
    setData(updatedItems);
  };

  useFocusEffect(
   React.useCallback(() => {
     if(route.params?.dataBackToList){
        console.log('start 3:', route.params);
        handleDelete(route.params.dataBackToList);
     }
   }, [route.params.dataBackToList])
 );

  // Update badge count in tab bar
  useFocusEffect(
    React.useCallback(() => {
      const itemCount = data.length;
      navigation.setOptions({
        tabBarBadge: itemCount > 0 ? itemCount : null, // Show count if > 0, else hide badge
      });
    }, [data, navigation])
  );

  // Filter data based on selected criteria
  useEffect(() => {
    let updatedItems = initialData;

    if (maleChecked && !femaleChecked) {
      updatedItems = updatedItems.filter(item => item.sex === 'Male');
    } else if (femaleChecked && !maleChecked) {
      updatedItems = updatedItems.filter(item => item.sex === 'Female');
    }

    if (searchQuery) {
      updatedItems = updatedItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setData(updatedItems);
  }, [maleChecked, femaleChecked, searchQuery]);

  // Scroll to top function
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("Profile", {
        itemId: item.id,
        name: item.name,
        avatar: item.avatar,
        birthDate: item.birthDate,
        sex: item.sex,
        description: item.description
      })}
    >
      <View style={styles.cardContent}>
        <View style={styles.column1}>
          <Avatar source={{ uri: item.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.column2}>
          <Text style={styles.date}>{item.birthDate}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.column3}>
          <AntDesign name="right" size={24} color="black" />
        </View>
      </View>
    </Card>
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.layout}>
          {/* Search Input and Filter Button */}
          <View style={styles.row}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <MaterialIcons
                name={showFilters ? "filter-list-off" : "filter-list"}
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          {showFilters && (
            <View style={styles.filterOptions}>
              <Text style={styles.filterTitle}>Filter by Sex</Text>
              <View style={styles.checkboxRow}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[styles.checkbox, maleChecked && styles.checkboxChecked]}
                    onPress={() => setMaleChecked(!maleChecked)}
                  >
                    {maleChecked && <Text style={styles.checkboxText}>✔</Text>}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>Male</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[styles.checkbox, femaleChecked && styles.checkboxChecked]}
                    onPress={() => setFemaleChecked(!femaleChecked)}
                  >
                    {femaleChecked && <Text style={styles.checkboxText}>✔</Text>}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>Female</Text>
                </View>
              </View>
            </View>
          )}

          {/* List with ScrollView */}
          <ScrollView ref={scrollViewRef}>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              contentContainerStyle={styles.contentContainer}
            />
          </ScrollView>

          {/* Scroll to Top Button */}
          <TouchableOpacity style={styles.topButton} onPress={scrollToTop}>
            <AntDesign name="arrowup" size={24} color="#fff" />
          </TouchableOpacity>
        </Layout>
      </SafeAreaView>
    </ApplicationProvider>
  );
}

// Styles with responsive design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  layout: {
    padding: 16,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider:{
    width:50,
  },
  searchInput: {
    flex: 0.85,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  filterButton: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOptions: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  filterTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: 'black',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 18,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 0,
  },
  column1: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  column2: {
    flex: 4,
    paddingHorizontal: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  column3: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  list: {
    marginVertical: 10,
  },
  itemSeparator: {
    height: 10,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  topButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
