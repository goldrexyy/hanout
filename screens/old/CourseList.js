import React, { useState, useRef } from 'react';
import { SafeAreaView, FlatList, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { ApplicationProvider, Layout, Card, Text, Button, Avatar  } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';



// Sample Data
const initialData = [
  { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Alice Johnson', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 4, name: 'Bob Brown', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 5, name: 'Cathy Green', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { id: 6, name: 'David White', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { id: 7, name: 'Ella Black', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { id: 8, name: 'Frank Gray', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
  { id: 9, name: 'Gina Blue', avatar: 'https://randomuser.me/api/portraits/women/9.jpg' },
  { id: 10, name: 'Harry Gold', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
];


export default function App({ navigation, route }) {





  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const scrollViewRef = useRef(null);
   const { itemId } = route.params;


  // Filtered list based on search input
  const filteredData = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  console.log('start 1:', {itemId});
  React.useEffect(() => {
    console.log('start 2:', {itemId});
    if (route.params?.dataBackToList) {
      console.log('start 3:', route.params.dataBackToList);
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
  }, [route.params?.dataBackToList]);

  // Scroll to top function
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const renderItem = ({ item }) => (
    <Card
     style={styles.card}
     onPress={() =>  navigation.navigate("Profile", { itemId : item.id,name: item.name,avatar:item.avatar  })}>
      <View style={styles.cardContent}>
        <Avatar source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.text}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.layout}>
          {/* Search Input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            value={search}
            onChangeText={setSearch}
          />

          {/* List with Scroll and Slider */}
          <ScrollView ref={scrollViewRef}>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              vertical
              showsVerticalScrollIndicator={false}
              style={styles.list}

              // Space between cards
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // 10px space
              // Optional padding around the list
              contentContainerStyle={{ paddingVertical: 10 }} // Padding at the top and bottom
            />
          </ScrollView>

          {/* Scroll to Top Button */}
          <TouchableOpacity style={styles.topButton} onPress={scrollToTop}>
               <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </Layout>
      </SafeAreaView>
    </ApplicationProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  layout: {
    padding: 16,
    flex: 1,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e4e9f2',
    borderRadius: 8,
    marginBottom: 10,

  },
  list: {
    marginVertical: 10,
  },
  card: {
    marginRight: 10,


  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  text: {
    flex: 1,
  },
  topButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    borderRadius: 30,
    padding: 10,
  },
  topIcon: {
    width: 32,
    height: 32,
  },
});
