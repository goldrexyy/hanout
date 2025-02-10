import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Dimensions, TouchableOpacity , Image} from 'react-native';
import { Avatar, Layout, Button, ApplicationProvider } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import * as eva from '@eva-design/eva';





import Success from './Success';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetScrollView  } from '@gorhom/bottom-sheet';

const { width } = Dimensions.get('window');


const Mescodes = ({ navigation }) => {


  const [productsNoEAN, setProductsNoEAN] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsNoEAN);

  const [snapPoint, setSnapPoint] = useState(['25%']); // Default snap points
  const bottomSheetModalFirstRef = useRef(null);



  const [selectedComponent, setSelectedComponent] = useState(null); // Track modal content

  const categories = [{"idUnique":"001","nom":"Marché","type":"catégorie","icon":"marche-icon"},{"idUnique":"002","nom":"Boulangerie","type":"catégorie","icon":"boulangerie-icon"},{"idUnique":"003","nom":"Telecom","type":"catégorie","icon":"telecom-icon"},{"idUnique":"004","nom":"Gas","type":"catégorie","icon":"gas-icon"},{"idUnique":"005","nom":"Glaces & Surgelé","type":"catégorie","icon":"glaces-surgele-icon"},{"idUnique":"006","nom":"Lait & Fromage","type":"catégorie","icon":"produits-laitiers-icon"},{"idUnique":"007","nom":"Epicerie","type":"catégorie","icon":"epicerie-icon"},{"idUnique":"008","nom":"Conserve","type":"catégorie","icon":"conserve-icon"},{"idUnique":"009","nom":"Farine","type":"catégorie","icon":"farine-icon"},{"idUnique":"010","nom":"Preparation pattiserie","type":"catégorie","icon":"preparation-pattiserie-icon"},{"idUnique":"011","nom":"Huiles Vinaigres","type":"catégorie","icon":"huiles-vinaigres-icon"},{"idUnique":"012","nom":"Pates","type":"catégorie","icon":"pates-icon"},{"idUnique":"013","nom":"Sauces","type":"catégorie","icon":"sauces-icon"},{"idUnique":"014","nom":"Epices","type":"catégorie","icon":"epices-icon"},{"idUnique":"015","nom":"Sucre","type":"catégorie","icon":"sucre-icon"},{"idUnique":"016","nom":"Petit déjeuner","type":"catégorie","icon":"petit-dejeuner-icon"},{"idUnique":"017","nom":"Biscuiterie","type":"catégorie","icon":"biscuiterie-icon"},{"idUnique":"018","nom":"Boissons","type":"catégorie","icon":"boissons-icon"},{"idUnique":"019","nom":"Boucherie","type":"catégorie","icon":"boucherie-icon"},{"idUnique":"020","nom":"Bébé","type":"catégorie","icon":"bebe-icon"},{"idUnique":"021","nom":"Hygiène, beauté , soin","type":"catégorie","icon":"hygiene-beaute-soin-icon"},{"idUnique":"022","nom":"Entretien, nettoyage","type":"catégorie","icon":"entretien-nettoyage-icon"},{"idUnique":"023","nom":"Jardin et plein air","type":"catégorie","icon":"jardin-plein-air-icon"},{"idUnique":"024","nom":"Librairie","type":"catégorie","icon":"librairie-icon"},{"idUnique":"025","nom":"Animaux","type":"catégorie","icon":"animaux-icon"}];

  // Create an icon mapping
  const iconMapping = {
    'marche-icon': require('../assets/categories/marche-icon.png'),
    'boulangerie-icon': require('../assets/categories/boulangerie-icon.png'),
    'telecom-icon': require('../assets/categories/telecom-icon.png'),
    'gas-icon': require('../assets/categories/gas-icon.png'),
    'glaces-surgele-icon': require('../assets/categories/glaces-surgele-icon.png'),
    'produits-laitiers-icon': require('../assets/categories/produits-laitiers-icon.png'),
    'epicerie-icon': require('../assets/categories/epicerie-icon.png'),
    'conserve-icon': require('../assets/categories/conserve-icon.png'),
    'farine-icon': require('../assets/categories/farine-icon.png'),
    'preparation-pattiserie-icon': require('../assets/categories/preparation-pattiserie-icon.png'),
    'huiles-vinaigres-icon': require('../assets/categories/huiles-vinaigres-icon.png'),
    'pates-icon': require('../assets/categories/pates-icon.png'),
    'sauces-icon': require('../assets/categories/sauces-icon.png'),
    'epices-icon': require('../assets/categories/epices-icon.png'),
    'sucre-icon': require('../assets/categories/sucre-icon.png'),
    'petit-dejeuner-icon': require('../assets/categories/petit-dejeuner-icon.png'),
    'biscuiterie-icon': require('../assets/categories/biscuiterie-icon.png'),
    'boissons-icon': require('../assets/categories/boissons-icon.png'),
    'boucherie-icon': require('../assets/categories/boucherie-icon.png'),
    'bebe-icon': require('../assets/categories/bebe-icon.png'),
    'hygiene-beaute-soin-icon': require('../assets/categories/hygiene-beaute-soin-icon.png'),
    'entretien-nettoyage-icon': require('../assets/categories/entretien-nettoyage-icon.png'),
    'jardin-plein-air-icon': require('../assets/categories/jardin-plein-air-icon.png'),
    'librairie-icon': require('../assets/categories/librairie-icon.png'),
    'animaux-icon': require('../assets/categories/animaux-icon.png'),
    'empty': require('../assets/categories/empty.png'),
    'empty-tr': require('../assets/categories/empty-tr.png'),
  };

  const AddCategory = async (idunique, name, icon, userid, type, fix, price, quantity, deleted) => {
      try {
          await db.runAsync(
              `INSERT INTO customproducts (
                  idunique,
                  name,
                  icon,
                  userid,
                  type,
                  fix,
                  price,
                  quantity,
                  deleted
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(idunique) DO UPDATE SET
                  name = excluded.name,
                  icon = excluded.icon,
                  userid = excluded.userid,
                  type = excluded.type,
                  fix = excluded.fix,
                  price = excluded.price,
                  quantity = excluded.quantity,
                  deleted = excluded.deleted;`,
              [idunique, name, icon, userid, type, fix, price, quantity, deleted]
          );
      } catch (error) {
          console.error('Error inserting category:', error);
      }
  };


  const AddCategories = async () => {
    try {
      // Create the table if it does not exist
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS customproducts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idunique TEXT UNIQUE,
          name TEXT,
          icon TEXT,
          userid TEXT,
          type TEXT,
          fix TEXT,
          price TEXT,
          quantity TEXT,
          deleted INTEGER
        )
      `);

      // Add predefined categories
      const predefinedCategories = [
        ['000', 'Ittisalat', 'call', '1', 'category', true, 0, 1, 0],
        ['0001', 'maroc telecom 5dh', 'call', '1', 'subcategory', true, 5, 1, 0],
        ['0002', 'maroc telecom 10dh', 'call', '1', 'subcategory', true, 10, 1, 0],
        ['0003', 'maroc telecom 20dh', 'call', '1', 'subcategory', true, 20, 1, 0],
        ['0004', 'maroc telecom 50dh', 'call', '1', 'subcategory', true, 50, 1, 0],
        ['0005', 'maroc telecom 100dh', 'call', '1', 'subcategory', true, 100, 1, 0],
        ['0006', 'maroc telecom 200dh', 'call', '1', 'subcategory', true, 200, 1, 0],
        ['0007', 'orange 5dh', 'call', '1', 'subcategory', true, 5, 1, 0],
        ['0008', 'orange 10dh', 'call', '1', 'subcategory', true, 10, 1, 0],
        ['0009', 'orange 20dh', 'call', '1', 'subcategory', true, 20, 1, 0],
        ['00010', 'orange 50dh', 'call', '1', 'subcategory', true, 50, 1, 0],
        ['00011', 'orange 100dh', 'call', '1', 'subcategory', true, 100, 1, 0],
        ['00012', 'orange 200dh', 'call', '1', 'subcategory', true, 200, 1, 0],
        ['00013', 'inwi 5dh', 'call', '1', 'subcategory', true, 5, 1, 0],
        ['00014', 'inwi 10dh', 'call', '1', 'subcategory', true, 10, 1, 0],
        ['00015', 'inwi 20dh', 'call', '1', 'subcategory', true, 20, 1, 0],
        ['00016', 'inwi 50dh', 'call', '1', 'subcategory', true, 50, 1, 0],
        ['00017', 'inwi 100dh', 'call', '1', 'subcategory', true, 100, 1, 0],
        ['00018', 'inwi 200dh', 'call', '1', 'subcategory', true, 200, 1, 0],
      ];

      for (const category of predefinedCategories) {
        await AddCategory(...category);
      }

      // Define categories and subcategories
      const categories = [
        ['001', 'Viande & Poisson', 'fish'],
        ['002', 'Produits Laitiers', 'cart'],
        ['003', 'Céréales & Pâtes', 'beaker'],
        ['004', 'Fruits & Légumes', 'nutrition'],
        ['005', 'Alimentation Bébé', 'cube'],
        ['006', 'Snacks & Douceurs', 'cube'],
        ['007', 'Condiments & Sauces', 'cube'],
        ['008', 'Boissons', 'cube'],
        ['009', 'Produits de Beauté & Hygiène', 'cube'],
        ['010', 'Maison & Entretien', 'cube'],
        ['011', 'Loisirs & Éducation', 'cube'],
        ['012', 'Jouets & Saison', 'cube'],
        ['013', 'Produits Spécifiques', 'cube'],
        ['014', 'Autres', 'cube'],
      ];

const subcategories = [
  // Viande & Poisson
  ['0011', 'ABAT/VIANDE', 'cube'],
  ['0012', 'ABATS', 'cube'],
  ['0013', 'AGNEAU', 'cube'],
  ['0014', 'AGNEAU TRAD', 'cube'],
  ['0015', 'BOEUF', 'cube'],
  ['0016', 'CHEVREAU', 'cube'],
  ['0017', 'DROMADAIRE', 'cube'],
  ['0018', 'VIANDES & POISSONS', 'cube'],
  ['0019', 'CONSERVES DE POISSON', 'cube'],
  ['0020', 'CONSERVES DE VIANDE', 'cube'],

  // Produits Laitiers
  ['0021', 'BEURRE', 'cube'],
  ['0022', 'FROMAGE AFFINE', 'cube'],
  ['0023', 'FROMAGE FONDU', 'cube'],
  ['0024', 'FROMAGE FRAIS', 'cube'],
  ['0025', 'LAIT', 'cube'],
  ['0026', 'LAIT FRAIS', 'cube'],
  ['0027', 'LAIT UHT', 'cube'],
  ['0028', 'YAOURTS', 'cube'],
  ['0029', 'PETIT LAIT (LBEN)', 'cube'],

  // Céréales & Pâtes
  ['0031', 'CEREALES', 'cube'],
  ['0032', 'FARINES', 'cube'],
  ['0033', 'SEMOULE', 'cube'],
  ['0034', 'SEMOULE COUSCOU', 'cube'],
  ['0035', 'PATES ALIMENTAIRES', 'cube'],
  ['0036', 'PATE/RIZ/SEML', 'cube'],
  ['0037', 'PANIFICATION', 'cube'],
  ['0038', 'PAINS & VIENNOISERIES', 'cube'],
  ['0039', 'EXTRUDES', 'cube'],

  // Fruits & Légumes
  ['0041', 'COMPOTES', 'cube'],
  ['0042', 'CONSERVE LEGUMES', 'cube'],
  ['0043', 'CONSERVES DE LEGUMES', 'cube'],
  ['0044', 'LEGUM&ACCOMPAG', 'cube'],
  ['0045', 'LEGUMES SECS', 'cube'],
  ['0046', 'FRUITS SECS', 'cube'],
  ['0047', 'FRUITS SEC COND', 'cube'],

  // Alimentation Bébé
  ['0051', 'ALIMENTS BEBE', 'cube'],

  // Snacks & Douceurs
  ['0061', 'BISCUITERIE', 'cube'],
  ['0062', 'BISCUITS APERITIFS', 'cube'],
  ['0063', 'CHIPS&TORTILLAS', 'cube'],
  ['0064', 'CHOCOLAT FETE', 'cube'],
  ['0065', 'CHOCOLAT/TABLET', 'cube'],
  ['0066', 'CONFITURE', 'cube'],
  ['0067', 'DESSERTS', 'cube'],
  ['0068', 'DESSERTS-ENTREM', 'cube'],
  ['0069', 'GLACES&DESSERT', 'cube'],
  ['0070', 'PETIT DEJ CHOCOLATE', 'cube'],
  ['0071', 'SNACK ET GRAINE', 'cube'],
  ['0072', 'SUCRE', 'cube'],
  ['0073', 'MIEL', 'cube'],
  ['0074', 'MAROQ.SCOLAIRE', 'cube'],

  // Condiments & Sauces
  ['0081', 'AIDE CULINAIRE', 'cube'],
  ['0082', 'CONCENTRES DE TOMATE', 'cube'],
  ['0083', 'CONDIMENTS', 'cube'],
  ['0084', 'CONDIMENTS ET TAPAS', 'cube'],
  ['0085', 'SAUCES', 'cube'],
  ['0086', 'SAUCES CHAUDES', 'cube'],
  ['0087', 'SAUCES FROIDES', 'cube'],
  ['0088', 'EPICES', 'cube'],
  ['0089', 'HUILE D\'OLIVE EN VRAC', 'cube'],
  ['0090', 'HUILE VINAIGRE', 'cube'],
  ['0091', 'SEL EPICES', 'cube'],

  // Boissons
  ['0092', 'BOISSON PASTEURISEE AUX FRUITS', 'cube'],
  ['0093', 'BOISSONS ENERGISANTES', 'cube'],
  ['0094', 'BOISSONS GAZEUSES', 'cube'],
  ['0095', 'CAFES & CHICOREES', 'cube'],
  ['0096', 'CAFÉ VRAC', 'cube'],
  ['0097', 'JUS DE FRUIT & NECTAR', 'cube'],
  ['0098', 'JUS FRAIS', 'cube'],
  ['0099', 'EAUX AROMATISEES', 'cube'],
  ['0100', 'EAUX PLATES', 'cube'],
  ['0101', 'SIROPS', 'cube'],
  ['0102', 'THE GLACE', 'cube'],
  ['0103', 'THES & TISANES', 'cube'],

  // Produits de Beauté & Hygiène
  ['0104', 'ACCESS.COIFFURE', 'cube'],
  ['0105', 'ACCESSOIR BAIN', 'cube'],
  ['0106', 'ACCESSOIR/BEAUT', 'cube'],
  ['0107', 'DEODORANT', 'cube'],
  ['0108', 'DESODORISANT', 'cube'],
  ['0109', 'HYGIENE', 'cube'],
  ['0110', 'HYGIENE FEMININ', 'cube'],
  ['0111', 'HYG.BUCCO.DENT', 'cube'],
  ['0112', 'MAQUILLAGE', 'cube'],
  ['0113', 'RASAGE ET EPPILATION FEMME', 'cube'],
  ['0114', 'RASAGE HOMME', 'cube'],
  ['0115', 'SAVON', 'cube'],
  ['0116', 'SOINS DU CORPS', 'cube'],
  ['0117', 'SOIN CHEVEUX', 'cube'],
  ['0118', 'SOIN DU VISAGE', 'cube'],
  ['0119', 'LINGETTES BEBE', 'cube'],

  // Maison & Entretien
  ['0120', 'ASSOUPLISSANTS', 'cube'],
  ['0121', 'EMBALL/MENAGER', 'cube'],
  ['0122', 'NETTOYANTS MENAGERS', 'cube'],
  ['0123', 'NETTOYANTS VAISSELLE', 'cube'],
  ['0124', 'MULTI USAGES', 'cube'],
  ['0125', 'ESSUIE TOUT', 'cube'],
  ['0126', 'PANSEMENT & COMPRESSE', 'cube'],
  ['0127', 'PAPIER TOILETTE', 'cube'],
  ['0128', 'INSECTICIDES', 'cube'],

  // Loisirs & Éducation
  ['0129', 'BIBLIOTHEQUE', 'cube'],
  ['0130', 'LOISIRS', 'cube'],
  ['0131', 'JEUX', 'cube'],
  ['0132', 'SPORT', 'cube'],
  ['0133', 'EDUCATION', 'cube'],

  // Jouets & Saison
  ['0134', 'JOUETS', 'cube'],
  ['0135', 'JOUETS SAISON', 'cuben'],

  // Produits Spécifiques
  ['0136', 'PRODUITS SANS GLUTEN', 'cube'],

  // Autres
  ['0137', 'AUTRES', 'cube']
];

for (const [idunique, name, icon] of categories) {
  await AddCategory(idunique, name, icon, '1', 'category', true, 0, 1, 0);
}

// Ajout des sous-catégories
for (const [idunique, name, icon] of subcategories) {
  await AddCategory(idunique, name, icon, '1', 'subcategory', true, 0, 1, 0);
}

    } catch (error) {
      console.log('Error creating table or adding categories:', error);
    }
  };

  const DeleteTable = async () => {
        try {
        await db.runAsync(`DROP TABLE IF EXISTS customproducts`);
    //    await db.runAsync(`DROP TABLE IF EXISTS detailsfacture`);
          console.log('Data deleted successfully!');
        } catch (error) {
          console.log('Error sending data:', error);
        }
      };



      // Filtered list based on search input
  const filteredData = categories;

  const searchText = useCallback((value) => {
        setSearchTerm(value);
      }, []);

      // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
        category.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const BottomSheetContent = React.memo(() => {
    // Use a callback to render the content based on the ient
    const renderContent = useCallback(() => {
       return <Success />;
    }, []);

    return (
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
      </BottomSheetScrollView>
    );
  });

  const handlePresentModalFirstPress = useCallback((component) => {
    // If it's a string, handle it as a component type

      setSelectedComponent(component);
      console.log('what component', component);

      // Adjust snap point based on component type
     if (component === 'Success') {
        setSnapPoint(['40%']);  // Set snap point for 'Modify'
      } else {
        setSnapPoint(['50%']);  // Default snap point for other cases
      }

    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.present();
  }, []);
  // callbacks
  const handlePresentModalFirstClose = useCallback(() => {
    // Present the bottom sheet modal
    bottomSheetModalFirstRef.current?.close();
  }, []);

  const renderBackdrop = (props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // Backdrop shows up when sheet is open
            disappearsOnIndex={-1} // Backdrop disappears when closed
            pressBehavior="close" // Close the modal when backdrop is pressed
            opacity={0.9} // Adjust opacity
          />
        );

  const handlePress = (item) => {
         // Extract the first 3 characters of item.idunique
         const prefix = item.idUnique.substring(0, 3);

         // Navigate to the Mescodescategory screen and send data
         navigation.navigate('Mescodescategory', {
           details: {
             name: item.nom,
             prefix: prefix,
           },
         });
       };

   const renderCardItem = useCallback(({ item }) => (
         <TouchableOpacity
           style={styles.productCard1}
           onPress={() => handlePress(item)}
         >
           <View style={[styles.column0, { backgroundColor: 'transparent' }]}>
           <Image
                  source={iconMapping[item.icon]} // Use the mapped icon
                  style={styles.icon}
                />
           </View>
           <View style={styles.column1}>
             <Text style={styles.productName}>{item.idUnique}</Text>
             <Text style={styles.productName2}>{item.nom}</Text>
           </View>
         </TouchableOpacity>
       ), []);




  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3682B3',
    },

    layout: {
      backgroundColor:'#fff',
      paddingHorizontal: 16,
      flex: 1,
      justifyContent:'center',
    },

    Selecttext: {
      fontSize: width * 0.06,
      paddingTop: width * 0.1,
      fontWeight: 'bold',
      color: 'white',
      padding: 15,
    },

    formContainer: {
      padding:10,
      width:'100%',
      backgroundColor:'white',
      justifyContent:'center',

    },
    formContainerSearch: {
      padding:10,
      backgroundColor:'white',
      justifyContent:'center',
      height:80,
    },

    Selecttext1: {
      fontSize: width * 0.04,
      paddingTop: width * 0.02,
      fontWeight: 'bold',
      color: '#333',
      textTransform:'uppercase'
    },

    Selecttext2: {
      fontSize: width * 0.03,
      color: '#666',
    },

    productCard1: {
       justifyContent: 'center',
       alignItems: 'center',
       marginBottom: width * 0.02,
       marginRight:width * 0.025,
       backgroundColor: '#fff',
       borderRadius: width * 0.02,
       borderWidth: width * 0.003,
       borderColor: '#666',
       width: '31.5%',  // Fill the column
     },

     icon:{
       padding:10,
       width:width*0.18,
       height: width * 0.18,
     },

     column1: {
        alignItems: 'center',
       justifyContent: 'center',
     },

     productName: {
         fontSize: width * 0.025,
         fontWeight: 'bold',
         textTransform: 'uppercase', // Converts text to uppercase
         padding: 2,
         flexWrap: 'wrap', // Allows text to wrap
         textAlign: 'left', // Aligns text to the left
     },

     productName2: {
         fontSize: width * 0.035,
         textTransform: 'uppercase', // Converts text to uppercase
         flexWrap: 'wrap', // Allows text to wrap
         textAlign: 'center', // Aligns text to the left
          fontWeight: 'bold',
          padding:5,
     },

     searchInput: {
       flex: 1,
       borderRadius: width * 0.02,
       borderWidth : width * 0.003,
       borderColor : '#666',
       padding: 10,
       backgroundColor: '#F6F6F6',
       fontSize: width * 0.03,
     },

  });
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={{  backgroundColor: '#3682B3', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <Text style={styles.Selecttext}>Mes codes</Text>
      </View>

      <View style={styles.formContainer}>

       <Text style={styles.Selecttext1}>Etape 1 : Choisir une catégorie</Text>
       <Text style={styles.Selecttext2}>Regrouper vos codes en catégories vous aide à mieux les classer et les mémoriser. Choisir des préfixes définis pour chaque catégorie vous permettra de vous rappeler plus facilement du code produit que vous souhaitez ajouter à votre facture.</Text>

      </View>

      <View style={styles.formContainerSearch}>
            <TextInput
              style={styles.searchInput}
              placeholder="Trouver une catégorie.."
              value={searchTerm}
              onChangeText={searchText}
            />
      </View>


      <View style={styles.formContainer}>
      <FlatList
        data={filteredCategories} // Use filtered categories
        renderItem={renderCardItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        initialNumToRender={10} // Adjust as needed
      />
      </View>

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalFirstRef}
            snapPoints={snapPoint}
            index={0} // Starts closed
            enableContentPanningGesture={true}
            enableHandlePanningGesture={true}
            backgroundStyle={styles.backgroundcontainer}
            style={styles.bottomsheetcontainer}
            handleStyle={styles.handlebottomsheet}
            enablePanDownToClose={true} // Allow closing by dragging down
            backdropComponent={renderBackdrop}
          >
          <BottomSheetContent
               />
          </BottomSheetModal>
      </BottomSheetModalProvider>
    </ApplicationProvider>
  );
};



export default Mescodes;
