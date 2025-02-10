import { useLayoutEffect, useState  } from "react";
import { View, Text, Image, Button, Alert, Modal, TouchableOpacity, StyleSheet } from "react-native";
import {  } from "@react-native-material/core";


export default function Profile({ navigation, route }) {

const { itemId, name, avatar } = route.params;
const [isModalVisible, setModalVisible] = useState(false);
const handleDelete = () => {
   // Show confirmation modal
   setModalVisible(true);
 };



  const confirmDelete = () => {
   // Perform deletion logic (mocked here)
   setModalVisible(false);
   // Return to List.js with the updated list (mocked without backend)

   navigation.navigate('CourseList', {
    dataBackToList: route.params.itemId, // Pass parameters to 'List'
  });
     console.log('Debugg if params works', route.params);
 };
  return (
    <View style={styles.container}>
       {/* Big Avatar */}
       <Image source={{ uri: avatar }} style={styles.avatar} />

       {/* Name in big title */}
       <Text style={styles.name}>{name}</Text>

       {/* Short description */}
       <Text style={styles.description}>This is a short description of the profile.</Text>

       {/* Separator */}
       <View style={styles.separator} />

       {/* Long Text */}
       <Text style={styles.longText}>
         This is a longer text about the profile. It could be several paragraphs explaining the details about the user,
         their preferences, or additional information. You can customize it as needed.
       </Text>

       {/* Separator */}
       <View style={styles.separator} />

       {/* Delete Profile Button */}
       <Button title="Delete Profile" color="red" onPress={handleDelete} />

       {/* Modal for confirming deletion */}
       <Modal
         transparent={true}
         animationType="slide"
         presentationStyle ="formSheet"
         visible={isModalVisible}
         onRequestClose={() => setModalVisible(false)}
       >
         <View style={styles.modalBackground}>
           <View style={styles.modalContainer}>
             <Text style={styles.modalText}>Are you sure you want to delete this profile?</Text>
             <View style={styles.modalButtons}>
               <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                 <Text style={styles.modalButtonText}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
                 <Text style={styles.modalButtonText}>Yes, Delete</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
     </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  longText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
