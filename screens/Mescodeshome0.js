import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar, Layout, Button, ApplicationProvider } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import * as eva from '@eva-design/eva';




const { width } = Dimensions.get('window');

const Mescodescategoryhome = ({ isPressed, prefix}) => {
  console.log('start categorie bottom');
  const [searchTerm, setSearchTerm] = useState('');


  const categories = [
    {"idUnique":"0011","nom":"Fruits","type":"sous-catégorie","icon":"fruits-icon","parent":"001"},{"idUnique":"0012","nom":"Fruits secs","type":"sous-catégorie","icon":"fruits-secs-icon","parent":"001"},{"idUnique":"0013","nom":"Légumes","type":"sous-catégorie","icon":"legumes-icon","parent":"001"},{"idUnique":"0014","nom":"Salades","type":"sous-catégorie","icon":"salades-icon","parent":"001"},{"idUnique":"0015","nom":"Herbes","type":"sous-catégorie","icon":"herbes-icon","parent":"001"},{"idUnique":"0016","nom":"Condiments","type":"sous-catégorie","icon":"condiments-icon","parent":"001"},{"idUnique":"0017","nom":"Viande","type":"sous-catégorie","icon":"viande-icon","parent":"001"},{"idUnique":"0018","nom":"Volailles","type":"sous-catégorie","icon":"volailles-icon","parent":"001"},{"idUnique":"0019","nom":"Khlii","type":"sous-catégorie","icon":"khlii-icon","parent":"001"},
    {"idUnique":"0021","nom":"Pain","type":"sous-catégorie","icon":"pain-icon","parent":"002"},{"idUnique":"0022","nom":"Pain de mie","type":"sous-catégorie","icon":"pain-de-mie-icon","parent":"002"},{"idUnique":"0023","nom":"Veinoiserie","type":"sous-catégorie","icon":"veinoiserie-icon","parent":"002"},{"idUnique":"0024","nom":"Pain sandwich","type":"sous-catégorie","icon":"pain-sandwich-icon","parent":"002"},{"idUnique":"0025","nom":"Fond Pizza","type":"sous-catégorie","icon":"fond-pizza-icon","parent":"002"},{"idUnique":"0026","nom":"Levure pain","type":"sous-catégorie","icon":"levure-pain-icon","parent":"002"},{"idUnique":"0027","nom":"Feuille Pastilla","type":"sous-catégorie","icon":"feuille-pastilla-icon","parent":"002"},{"idUnique":"0028","nom":"Madeleine","type":"sous-catégorie","icon":"madeleine-icon","parent":"002"},{"idUnique":"0029","nom":"Cake","type":"sous-catégorie","icon":"cake-icon","parent":"002"},{"idUnique":"00210","nom":"Pattiserie","type":"sous-catégorie","icon":"pattiserie-icon","parent":"002"},{"idUnique":"00211","nom":"Gateau traditionnels","type":"sous-catégorie","icon":"gateau-traditionnels-icon","parent":"002"},
    {"idUnique":"0031","nom":"Recharge IAM","type":"sous-catégorie","icon":"recharge-iam-icon","parent":"003"},{"idUnique":"0032","nom":"Recharge Orange","type":"sous-catégorie","icon":"recharge-orange-icon","parent":"003"},{"idUnique":"0033","nom":"Recharge INWI","type":"sous-catégorie","icon":"recharge-inwi-icon","parent":"003"},
    {"idUnique":"0041","nom":"Bobine gas","type":"sous-catégorie","icon":"bobine-gas-icon","parent":"004"},{"idUnique":"0051","nom":"Batonnets","type":"sous-catégorie","icon":"batonnets-icon","parent":"005"},{"idUnique":"0052","nom":"Cornets","type":"sous-catégorie","icon":"cornets-icon","parent":"005"},{"idUnique":"0053","nom":"Pots","type":"sous-catégorie","icon":"pots-icon","parent":"005"},{"idUnique":"0054","nom":"Plat surgelé","type":"sous-catégorie","icon":"plat-surgele-icon","parent":"005"},{"idUnique":"0061","nom":"Fromage à la découpe","type":"sous-catégorie","icon":"fromage-decoupe-icon","parent":"006"},{"idUnique":"0062","nom":"Fromage étrangers","type":"sous-catégorie","icon":"fromage-etrangers-icon","parent":"006"},{"idUnique":"0063","nom":"Fromage à tartiner","type":"sous-catégorie","icon":"fromage-tartiner-icon","parent":"006"},{"idUnique":"0064","nom":"Fromage portions","type":"sous-catégorie","icon":"fromage-portions-icon","parent":"006"},{"idUnique":"0065","nom":"Fromages edam","type":"sous-catégorie","icon":"fromages-edam-icon","parent":"006"},{"idUnique":"0066","nom":"Fromage tranches","type":"sous-catégorie","icon":"fromage-tranches-icon","parent":"006"},{"idUnique":"0067","nom":"Fromage rapés","type":"sous-catégorie","icon":"fromage-rapes-icon","parent":"006"},{"idUnique":"0068","nom":"Camembert","type":"sous-catégorie","icon":"camembert-icon","parent":"006"},{"idUnique":"0069","nom":"Fromage frais","type":"sous-catégorie","icon":"fromage-frais-icon","parent":"006"},{"idUnique":"00610","nom":"Mozzarela","type":"sous-catégorie","icon":"mozzarela-icon","parent":"006"},{"idUnique":"00611","nom":"Feta","type":"sous-catégorie","icon":"feta-icon","parent":"006"},{"idUnique":"00612","nom":"Ricotta","type":"sous-catégorie","icon":"ricotta-icon","parent":"006"},{"idUnique":"00613","nom":"Lait","type":"sous-catégorie","icon":"lait-icon","parent":"006"},{"idUnique":"00614","nom":"Lben","type":"sous-catégorie","icon":"lben-icon","parent":"006"},{"idUnique":"00615","nom":"Lait aromatisé","type":"sous-catégorie","icon":"lait-aromatise-icon","parent":"006"},{"idUnique":"00616","nom":"Lait végétal","type":"sous-catégorie","icon":"lait-vegetal-icon","parent":"006"},{"idUnique":"00617","nom":"Oeufs","type":"sous-catégorie","icon":"oeufs-icon","parent":"006"},{"idUnique":"00618","nom":"Yaourts aromatisés","type":"sous-catégorie","icon":"yaourts-aromatises-icon","parent":"006"},{"idUnique":"00619","nom":"Yaourt allégés","type":"sous-catégorie","icon":"yaourt-alleges-icon","parent":"006"},{"idUnique":"00620","nom":"Yaourts natures","type":"sous-catégorie","icon":"yaourts-natures-icon","parent":"006"},{"idUnique":"00621","nom":"Yaourts à boire","type":"sous-catégorie","icon":"yaourts-a-boire-icon","parent":"006"},{"idUnique":"00622","nom":"Raib","type":"sous-catégorie","icon":"raib-icon","parent":"006"},{"idUnique":"00623","nom":"Crème desserts","type":"sous-catégorie","icon":"creme-desserts-icon","parent":"006"},{"idUnique":"00624","nom":"Yaourt enfants","type":"sous-catégorie","icon":"yaourt-enfants-icon","parent":"006"},{"idUnique":"00625","nom":"Jus de fruits au lait","type":"sous-catégorie","icon":"jus-fruits-lait-icon","parent":"006"},{"idUnique":"00626","nom":"Creme fraiche","type":"sous-catégorie","icon":"creme-fraiche-icon","parent":"006"},{"idUnique":"00627","nom":"Creme longue conservation","type":"sous-catégorie","icon":"creme-longue-conservation-icon","parent":"006"},{"idUnique":"00628","nom":"Creme pattissières","type":"sous-catégorie","icon":"creme-pattissieres-icon","parent":"006"},{"idUnique":"00629","nom":"Beurre","type":"sous-catégorie","icon":"beurre-icon","parent":"006"},{"idUnique":"00630","nom":"Margarine","type":"sous-catégorie","icon":"margarine-icon","parent":"006"},
    {"idUnique":"0071","nom":"Cuisine asiatique","type":"sous-catégorie","icon":"cuisine-asiatique-icon","parent":"007"},{"idUnique":"0072","nom":"Cuisine orientales","type":"sous-catégorie","icon":"cuisine-orientales-icon","parent":"007"},{"idUnique":"0073","nom":"Cuisine latine","type":"sous-catégorie","icon":"cuisine-latine-icon","parent":"007"},{"idUnique":"0074","nom":"Soupe à rechauffer","type":"sous-catégorie","icon":"soupe-rechauffer-icon","parent":"007"},{"idUnique":"0075","nom":"Soupe déshydratées","type":"sous-catégorie","icon":"soupe-deshydratees-icon","parent":"007"},{"idUnique":"0076","nom":"Chocolat patissiers","type":"sous-catégorie","icon":"chocolat-patissiers-icon","parent":"007"},{"idUnique":"0077","nom":"Semoule","type":"sous-catégorie","icon":"semoule-icon","parent":"007"},{"idUnique":"0078","nom":"Argan","type":"sous-catégorie","icon":"argan-icon","parent":"007"},{"idUnique":"0079","nom":"Assaisonnement","type":"sous-catégorie","icon":"assaisonnement-icon","parent":"007"},{"idUnique":"00710","nom":"Riz","type":"sous-catégorie","icon":"riz-icon","parent":"007"},{"idUnique":"00711","nom":"Risotto","type":"sous-catégorie","icon":"risotto-icon","parent":"007"},{"idUnique":"00712","nom":"Blé cuit","type":"sous-catégorie","icon":"ble-cuit-icon","parent":"007"},{"idUnique":"00713","nom":"Quinoa","type":"sous-catégorie","icon":"quinoa-icon","parent":"007"},{"idUnique":"00714","nom":"Purée","type":"sous-catégorie","icon":"puree-icon","parent":"007"},{"idUnique":"00715","nom":"Couscous","type":"sous-catégorie","icon":"couscous-icon","parent":"007"},{"idUnique":"00716","nom":"Légumes secs","type":"sous-catégorie","icon":"legumes-secs-icon","parent":"007"},{"idUnique":"00717","nom":"Olives","type":"sous-catégorie","icon":"olives-icon","parent":"007"},{"idUnique":"00718","nom":"Citrons confits","type":"sous-catégorie","icon":"citrons-confits-icon","parent":"007"},{"idUnique":"00719","nom":"Tapenades","type":"sous-catégorie","icon":"tapenades-icon","parent":"007"},{"idUnique":"00720","nom":"Cornichons","type":"sous-catégorie","icon":"cornichons-icon","parent":"007"},{"idUnique":"00721","nom":"Captres","type":"sous-catégorie","icon":"captres-icon","parent":"007"},{"idUnique":"00722","nom":"Condiments","type":"sous-catégorie","icon":"condiments-icon","parent":"007"},{"idUnique":"00723","nom":"Sels","type":"sous-catégorie","icon":"sels-icon","parent":"007"},{"idUnique":"00724","nom":"Bouillons","type":"sous-catégorie","icon":"bouillons-icon","parent":"007"},{"idUnique":"00725","nom":"Edulcorants","type":"sous-catégorie","icon":"edulcorants-icon","parent":"007"},{"idUnique":"0081","nom":"Thons nature","type":"sous-catégorie","icon":"thons-nature-icon","parent":"008"},{"idUnique":"0082","nom":"Thons en sauce","type":"sous-catégorie","icon":"thons-sauce-icon","parent":"008"},{"idUnique":"0083","nom":"Sardines","type":"sous-catégorie","icon":"sardines-icon","parent":"008"},{"idUnique":"0084","nom":"Maquereaux","type":"sous-catégorie","icon":"maquereaux-icon","parent":"008"},{"idUnique":"0085","nom":"Champignons","type":"sous-catégorie","icon":"champignons-icon","parent":"008"},{"idUnique":"0086","nom":"Macedoine","type":"sous-catégorie","icon":"macedoine-icon","parent":"008"},{"idUnique":"0087","nom":"Petits pois","type":"sous-catégorie","icon":"petits-pois-icon","parent":"008"},{"idUnique":"0088","nom":"Mais","type":"sous-catégorie","icon":"mais-icon","parent":"008"},{"idUnique":"0089","nom":"Coeur de palmier","type":"sous-catégorie","icon":"coeur-de-palmier-icon","parent":"008"},{"idUnique":"0091","nom":"Farine complète","type":"sous-catégorie","icon":"farine-complete-icon","parent":"009"},{"idUnique":"0092","nom":"Farine farinot","type":"sous-catégorie","icon":"farine-farinot-icon","parent":"009"},{"idUnique":"0093","nom":"Farine fleur patissière","type":"sous-catégorie","icon":"farine-fleur-patissiere-icon","parent":"009"},{"idUnique":"0101","nom":"Flan","type":"sous-catégorie","icon":"flan-icon","parent":"010"},{"idUnique":"0102","nom":"Mousses","type":"sous-catégorie","icon":"mousses-icon","parent":"010"},{"idUnique":"0103","nom":"Levure","type":"sous-catégorie","icon":"levure-icon","parent":"010"},{"idUnique":"0104","nom":"Preparation de geateaux","type":"sous-catégorie","icon":"preparation-geateaux-icon","parent":"010"},{"idUnique":"0105","nom":"Crème pattisière","type":"sous-catégorie","icon":"creme-pattisiere-icon","parent":"010"},{"idUnique":"0111","nom":"Huile olive","type":"sous-catégorie","icon":"huile-olive-icon","parent":"011"},{"idUnique":"0112","nom":"Huile cuisson","type":"sous-catégorie","icon":"huile-cuisson-icon","parent":"011"},{"idUnique":"0113","nom":"Vinaigres","type":"sous-catégorie","icon":"vinaigres-icon","parent":"011"},{"idUnique":"0114","nom":"Vinaigrettes","type":"sous-catégorie","icon":"vinaigrettes-icon","parent":"011"},
    {"idUnique":"0121","nom":"Spaghetti","type":"sous-catégorie","icon":"spaghetti-icon","parent":"012"},{"idUnique":"0122","nom":"Tagliatelles","type":"sous-catégorie","icon":"tagliatelles-icon","parent":"012"},{"idUnique":"0123","nom":"Fusilli","type":"sous-catégorie","icon":"fusilli-icon","parent":"012"},{"idUnique":"0124","nom":"Penne","type":"sous-catégorie","icon":"penne-icon","parent":"012"},{"idUnique":"0125","nom":"Farfalle","type":"sous-catégorie","icon":"farfalle-icon","parent":"012"},{"idUnique":"0126","nom":"Lasagne","type":"sous-catégorie","icon":"lasagne-icon","parent":"012"},{"idUnique":"0127","nom":"Raviolis","type":"sous-catégorie","icon":"raviolis-icon","parent":"012"},{"idUnique":"0128","nom":"Cannelloni","type":"sous-catégorie","icon":"cannelloni-icon","parent":"012"},{"idUnique":"0129","nom":"Cheveux d'anges","type":"sous-catégorie","icon":"cheveux-anges-icon","parent":"012"},{"idUnique":"01210","nom":"Macaroni","type":"sous-catégorie","icon":"macaroni-icon","parent":"012"},{"idUnique":"01211","nom":"Pâtes spéciales","type":"sous-catégorie","icon":"pates-speciales-icon","parent":"012"},{"idUnique":"0131","nom":"Concentré tomate","type":"sous-catégorie","icon":"concentre-tomate-icon","parent":"013"},{"idUnique":"0132","nom":"Sauce pâtes","type":"sous-catégorie","icon":"sauce-pates-icon","parent":"013"},{"idUnique":"0133","nom":"Sauces pizza","type":"sous-catégorie","icon":"sauces-pizza-icon","parent":"013"},{"idUnique":"0134","nom":"Moutarde","type":"sous-catégorie","icon":"moutarde-icon","parent":"013"},{"idUnique":"0135","nom":"Mayonnaise","type":"sous-catégorie","icon":"mayonnaise-icon","parent":"013"},{"idUnique":"0136","nom":"Ketchup","type":"sous-catégorie","icon":"ketchup-icon","parent":"013"},{"idUnique":"0137","nom":"Sauce piquante","type":"sous-catégorie","icon":"sauce-piquante-icon","parent":"013"},{"idUnique":"0141","nom":"Épices en flacon","type":"sous-catégorie","icon":"epices-flacon-icon","parent":"014"},{"idUnique":"0142","nom":"Épices en sachet","type":"sous-catégorie","icon":"epices-sachet-icon","parent":"014"},{"idUnique":"0143","nom":"Herbes","type":"sous-catégorie","icon":"herbes-icon","parent":"014"},{"idUnique":"0144","nom":"Aide culinaire","type":"sous-catégorie","icon":"aide-culinaire-icon","parent":"014"},{"idUnique":"0145","nom":"Mélanges épices","type":"sous-catégorie","icon":"melanges-epices-icon","parent":"014"},{"idUnique":"0151","nom":"Sucre granulé","type":"sous-catégorie","icon":"sucre-granule-icon","parent":"015"},{"idUnique":"0152","nom":"Sucre morceau","type":"sous-catégorie","icon":"sucre-morceau-icon","parent":"015"},{"idUnique":"0153","nom":"Pain de sucre","type":"sous-catégorie","icon":"pain-sucre-icon","parent":"015"},{"idUnique":"0154","nom":"Sucre glace","type":"sous-catégorie","icon":"sucre-glace-icon","parent":"015"},
    {"idUnique":"0161","nom":"Miels","type":"sous-catégorie","icon":"miels-icon","parent":"016"},{"idUnique":"0162","nom":"Sirops","type":"sous-catégorie","icon":"sirops-icon","parent":"016"},{"idUnique":"0163","nom":"Pâtes à tartiner","type":"sous-catégorie","icon":"pates-a-tartiner-icon","parent":"016"},{"idUnique":"0164","nom":"Beurre de cacahuète","type":"sous-catégorie","icon":"beurre-cacahuete-icon","parent":"016"},{"idUnique":"0165","nom":"Amlou","type":"sous-catégorie","icon":"amou-icon","parent":"016"},{"idUnique":"0166","nom":"Café moulu","type":"sous-catégorie","icon":"cafe-moulu-icon","parent":"016"},{"idUnique":"0167","nom":"Capsules","type":"sous-catégorie","icon":"capsules-icon","parent":"016"},{"idUnique":"0168","nom":"Grains","type":"sous-catégorie","icon":"grains-icon","parent":"016"},{"idUnique":"0169","nom":"Soluble","type":"sous-catégorie","icon":"soluble-icon","parent":"016"},{"idUnique":"01610","nom":"Céréales","type":"sous-catégorie","icon":"cereales-icon","parent":"016"},{"idUnique":"01611","nom":"Corn Flakes","type":"sous-catégorie","icon":"corn-flakes-icon","parent":"016"},{"idUnique":"01612","nom":"Biscottes","type":"sous-catégorie","icon":"biscottes-icon","parent":"016"},{"idUnique":"01613","nom":"Céréales enfants","type":"sous-catégorie","icon":"cereales-enfants-icon","parent":"016"},{"idUnique":"01614","nom":"Galettes","type":"sous-catégorie","icon":"galettes-icon","parent":"016"},{"idUnique":"01615","nom":"Pains épices","type":"sous-catégorie","icon":"pains-epices-icon","parent":"016"},{"idUnique":"01616","nom":"Muesli","type":"sous-catégorie","icon":"muesli-icon","parent":"016"},{"idUnique":"01617","nom":"Avoine","type":"sous-catégorie","icon":"avoine-icon","parent":"016"},{"idUnique":"01618","nom":"Chocolat en poudre","type":"sous-catégorie","icon":"chocolat-en-poudre-icon","parent":"016"},{"idUnique":"01619","nom":"Lait en poudre","type":"sous-catégorie","icon":"lait-en-poudre-icon","parent":"016"},{"idUnique":"01620","nom":"Confiture","type":"sous-catégorie","icon":"confiture-icon","parent":"016"},{"idUnique":"01621","nom":"Infusion","type":"sous-catégorie","icon":"infusion-icon","parent":"016"},{"idUnique":"01622","nom":"Tisanes","type":"sous-catégorie","icon":"tisanes-icon","parent":"016"},{"idUnique":"01623","nom":"Thé noir","type":"sous-catégorie","icon":"the-noir-icon","parent":"016"},{"idUnique":"01624","nom":"Thé parfumé","type":"sous-catégorie","icon":"the-parfume-icon","parent":"016"},{"idUnique":"01625","nom":"Thé vert filament","type":"sous-catégorie","icon":"the-vert-filament-icon","parent":"016"},{"idUnique":"01626","nom":"Thé vert grains","type":"sous-catégorie","icon":"the-vert-grains-icon","parent":"016"},
    {"idUnique":"0171","nom":"Chips","type":"sous-catégorie","icon":"chips-icon","parent":"017"},{"idUnique":"0172","nom":"Tortillas","type":"sous-catégorie","icon":"tortillas-icon","parent":"017"},{"idUnique":"0173","nom":"Chips soufflées","type":"sous-catégorie","icon":"chips-soufflees-icon","parent":"017"},{"idUnique":"0174","nom":"Biscuits","type":"sous-catégorie","icon":"biscuits-icon","parent":"017"},{"idUnique":"0175","nom":"Cacahuètes","type":"sous-catégorie","icon":"cacahuetes-icon","parent":"017"},{"idUnique":"0176","nom":"Pistaches","type":"sous-catégorie","icon":"pistaches-icon","parent":"017"},{"idUnique":"0177","nom":"Noix","type":"sous-catégorie","icon":"noix-icon","parent":"017"},{"idUnique":"0178","nom":"Biscuits diététiques","type":"sous-catégorie","icon":"biscuits-dietetiques-icon","parent":"017"},{"idUnique":"0179","nom":"Biscuits secs","type":"sous-catégorie","icon":"biscuits-secs-icon","parent":"017"},{"idUnique":"01710","nom":"Biscuits aux fruits","type":"sous-catégorie","icon":"biscuits-aux-fruits-icon","parent":"017"},{"idUnique":"01711","nom":"Biscuits chocolat","type":"sous-catégorie","icon":"biscuits-chocolat-icon","parent":"017"},{"idUnique":"01712","nom":"Biscuits pâtissiers","type":"sous-catégorie","icon":"biscuits-patissiers-icon","parent":"017"},{"idUnique":"01713","nom":"Cookies","type":"sous-catégorie","icon":"cookies-icon","parent":"017"},{"idUnique":"01714","nom":"Madeleines","type":"sous-catégorie","icon":"madeleines-icon","parent":"017"},{"idUnique":"01715","nom":"Génoises","type":"sous-catégorie","icon":"genoises-icon","parent":"017"},{"idUnique":"01716","nom":"Cakes","type":"sous-catégorie","icon":"cakes-icon","parent":"017"},{"idUnique":"01717","nom":"Gaufrettes","type":"sous-catégorie","icon":"gaufrettes-icon","parent":"017"},{"idUnique":"01718","nom":"Bonbons","type":"sous-catégorie","icon":"bonbons-icon","parent":"017"},{"idUnique":"01719","nom":"Caramels","type":"sous-catégorie","icon":"caramels-icon","parent":"017"},{"idUnique":"01720","nom":"Confiserie","type":"sous-catégorie","icon":"confiserie-icon","parent":"017"},{"idUnique":"01721","nom":"Gommes","type":"sous-catégorie","icon":"gommes-icon","parent":"017"},{"idUnique":"01722","nom":"Chewing gum","type":"sous-catégorie","icon":"chewing-gum-icon","parent":"017"},{"idUnique":"01723","nom":"Sucettes","type":"sous-catégorie","icon":"sucettes-icon","parent":"017"},{"idUnique":"01724","nom":"Barres chocolatées","type":"sous-catégorie","icon":"barres-chocolatees-icon","parent":"017"},{"idUnique":"01725","nom":"Confiserie chocolat","type":"sous-catégorie","icon":"confiserie-chocolat-icon","parent":"017"},{"idUnique":"01726","nom":"Nougat","type":"sous-catégorie","icon":"nougat-icon","parent":"017"},{"idUnique":"01727","nom":"Tablettes de chocolat","type":"sous-catégorie","icon":"tablettes-chocolat-icon","parent":"017"},{"idUnique":"0181","nom":"Eaux plates","type":"sous-catégorie","icon":"eaux-plates-icon","parent":"018"},{"idUnique":"0182","nom":"Eaux gazeuses","type":"sous-catégorie","icon":"eaux-gazeuses-icon","parent":"018"},{"idUnique":"0183","nom":"Eaux aromatisées","type":"sous-catégorie","icon":"eaux-aromatisees-icon","parent":"018"},{"idUnique":"0184","nom":"Sirops","type":"sous-catégorie","icon":"sirops-icon","parent":"018"},{"idUnique":"0185","nom":"Jus frais naturel","type":"sous-catégorie","icon":"jus-frais-naturel-icon","parent":"018"},{"idUnique":"0186","nom":"Pur jus","type":"sous-catégorie","icon":"pur-jus-icon","parent":"018"},{"idUnique":"0187","nom":"Jus orange","type":"sous-catégorie","icon":"jus-orange-icon","parent":"018"},{"idUnique":"0188","nom":"Jus exotique","type":"sous-catégorie","icon":"jus-exotique-icon","parent":"018"},{"idUnique":"0189","nom":"Format pocket","type":"sous-catégorie","icon":"format-pocket-icon","parent":"018"},{"idUnique":"01810","nom":"Autre jus","type":"sous-catégorie","icon":"autre-jus-icon","parent":"018"},{"idUnique":"01811","nom":"Colas","type":"sous-catégorie","icon":"colas-icon","parent":"018"},{"idUnique":"01812","nom":"Boisson gazeuse","type":"sous-catégorie","icon":"boisson-gazeuse-icon","parent":"018"},{"idUnique":"01813","nom":"Ice Tea","type":"sous-catégorie","icon":"ice-tea-icon","parent":"018"},{"idUnique":"01814","nom":"Ice Coffee","type":"sous-catégorie","icon":"ice-coffee-icon","parent":"018"},
    {"idUnique":"0191","nom":"Charcuterie","type":"sous-catégorie","icon":"charcuterie-icon","parent":"019"},{"idUnique":"0192","nom":"Mortadelles","type":"sous-catégorie","icon":"mortadelles-icon","parent":"019"},{"idUnique":"0193","nom":"Saucissons","type":"sous-catégorie","icon":"saucissons-icon","parent":"019"},{"idUnique":"0194","nom":"Jambons","type":"sous-catégorie","icon":"jambons-icon","parent":"019"},{"idUnique":"0195","nom":"Hot dog","type":"sous-catégorie","icon":"hot-dog-icon","parent":"019"},{"idUnique":"0201","nom":"Lait de croissance","type":"sous-catégorie","icon":"lait-croissance-icon","parent":"020"},{"idUnique":"0202","nom":"Céréales","type":"sous-catégorie","icon":"cereales-icon","parent":"020"},{"idUnique":"0203","nom":"Biscuits","type":"sous-catégorie","icon":"biscuits-bebe-icon","parent":"020"},{"idUnique":"0204","nom":"Desserts","type":"sous-catégorie","icon":"desserts-bebe-icon","parent":"020"},{"idUnique":"0205","nom":"Compotes","type":"sous-catégorie","icon":"compotes-icon","parent":"020"},{"idUnique":"0206","nom":"Couches","type":"sous-catégorie","icon":"couches-icon","parent":"020"},{"idUnique":"0207","nom":"Shampoings","type":"sous-catégorie","icon":"shampoings-icon","parent":"020"},{"idUnique":"0208","nom":"Savons bébé","type":"sous-catégorie","icon":"savons-bebe-icon","parent":"020"},{"idUnique":"0209","nom":"Crèmes","type":"sous-catégorie","icon":"cremes-icon","parent":"020"},{"idUnique":"02010","nom":"Huiles","type":"sous-catégorie","icon":"huiles-icon","parent":"020"},{"idUnique":"02011","nom":"Laits hydratants","type":"sous-catégorie","icon":"laits-hydratants-icon","parent":"020"},{"idUnique":"02012","nom":"Lingettes","type":"sous-catégorie","icon":"lingettes-icon","parent":"020"},
    {"idUnique":"0211","nom":"Shampoings","type":"sous-catégorie","icon":"shampoings-icon","parent":"021"},{"idUnique":"0212","nom":"Masques cheveux","type":"sous-catégorie","icon":"masques-cheveux-icon","parent":"021"},{"idUnique":"0213","nom":"Gels","type":"sous-catégorie","icon":"gels-icon","parent":"021"},{"idUnique":"0214","nom":"Produits coiffants","type":"sous-catégorie","icon":"produits-coiffants-icon","parent":"021"},{"idUnique":"0215","nom":"Coloration","type":"sous-catégorie","icon":"coloration-icon","parent":"021"},{"idUnique":"0216","nom":"Accessoires cheveux","type":"sous-catégorie","icon":"accessoires-cheveux-icon","parent":"021"},{"idUnique":"0217","nom":"Gel douche","type":"sous-catégorie","icon":"gel-douche-icon","parent":"021"},{"idUnique":"0218","nom":"Savons en barres","type":"sous-catégorie","icon":"savons-barres-icon","parent":"021"},{"idUnique":"0219","nom":"Savons en liquide","type":"sous-catégorie","icon":"savons-liquide-icon","parent":"021"},{"idUnique":"02110","nom":"Accessoires douche","type":"sous-catégorie","icon":"accessoires-douche-icon","parent":"021"},{"idUnique":"02111","nom":"Déodorants","type":"sous-catégorie","icon":"deodorants-icon","parent":"021"},{"idUnique":"02112","nom":"Eau de toilette","type":"sous-catégorie","icon":"eau-toilette-icon","parent":"021"},{"idUnique":"02113","nom":"Rasage homme","type":"sous-catégorie","icon":"rasage-homme-icon","parent":"021"},{"idUnique":"02114","nom":"Soins visage homme","type":"sous-catégorie","icon":"soins-visage-homme-icon","parent":"021"},{"idUnique":"02115","nom":"Hygiène féminine","type":"sous-catégorie","icon":"hygiène-feminine-icon","parent":"021"},{"idUnique":"02116","nom":"Epilation Dépilation","type":"sous-catégorie","icon":"epilation-icon","parent":"021"},{"idUnique":"02117","nom":"Maquillage yeux","type":"sous-catégorie","icon":"maquillage-yeux-icon","parent":"021"},{"idUnique":"02118","nom":"Maquillage visage","type":"sous-catégorie","icon":"maquillage-visage-icon","parent":"021"},{"idUnique":"02119","nom":"Maquillage lèvres","type":"sous-catégorie","icon":"maquillage-levres-icon","parent":"021"},{"idUnique":"02120","nom":"Démaquillants Dissolvants","type":"sous-catégorie","icon":"demaquillants-icon","parent":"021"},{"idUnique":"02121","nom":"Accessoires maquillage","type":"sous-catégorie","icon":"accessoires-maquillage-icon","parent":"021"},{"idUnique":"02122","nom":"Dentifrice","type":"sous-catégorie","icon":"dentifrice-icon","parent":"021"},{"idUnique":"02123","nom":"Brosse à dents","type":"sous-catégorie","icon":"brosse-dents-icon","parent":"021"},{"idUnique":"02124","nom":"Bain bouche","type":"sous-catégorie","icon":"bain-bouche-icon","parent":"021"},{"idUnique":"02125","nom":"Fil dentaire","type":"sous-catégorie","icon":"fil-dentaire-icon","parent":"021"},{"idUnique":"02126","nom":"Lait hydratant","type":"sous-catégorie","icon":"lait-hydratant-icon","parent":"021"},{"idUnique":"02127","nom":"Crème main","type":"sous-catégorie","icon":"creme-main-icon","parent":"021"},{"idUnique":"02128","nom":"Masque nettoyant","type":"sous-catégorie","icon":"masque-nettoyant-icon","parent":"021"},{"idUnique":"02129","nom":"Crème visage","type":"sous-catégorie","icon":"creme-visage-icon","parent":"021"},{"idUnique":"02130","nom":"Protection solaire","type":"sous-catégorie","icon":"protection-solaire-icon","parent":"021"},{"idUnique":"02131","nom":"Pansements","type":"sous-catégorie","icon":"pansements-icon","parent":"021"},{"idUnique":"02132","nom":"Parapharmacie","type":"sous-catégorie","icon":"parapharmacie-icon","parent":"021"},{"idUnique":"02133","nom":"Accessoires manucure","type":"sous-catégorie","icon":"accessoires-manucure-icon","parent":"021"},{"idUnique":"02134","nom":"Trousse","type":"sous-catégorie","icon":"trousse-icon","parent":"021"},{"idUnique":"02135","nom":"Papier toilette","type":"sous-catégorie","icon":"papier-toilette-icon","parent":"021"},{"idUnique":"02136","nom":"Mouchoirs","type":"sous-catégorie","icon":"mouchoirs-icon","parent":"021"},{"idUnique":"02137","nom":"Cotons","type":"sous-catégorie","icon":"cotons-icon","parent":"021"},{"idUnique":"02138","nom":"Coton tiges","type":"sous-catégorie","icon":"coton-tiges-icon","parent":"021"},{"idUnique":"0221","nom":"Lessive à la main","type":"sous-catégorie","icon":"lessive-main-icon","parent":"022"},{"idUnique":"0222","nom":"Lessive machine","type":"sous-catégorie","icon":"lessive-machine-icon","parent":"022"},{"idUnique":"0223","nom":"Lessive liquide","type":"sous-catégorie","icon":"lessive-liquide-icon","parent":"022"},{"idUnique":"0224","nom":"Assouplissants","type":"sous-catégorie","icon":"assouplissants-icon","parent":"022"},{"idUnique":"0225","nom":"Tide","type":"sous-catégorie","icon":"tide-icon","parent":"022"},{"idUnique":"0226","nom":"Ariel","type":"sous-catégorie","icon":"ariel-icon","parent":"022"},{"idUnique":"0227","nom":"Liquide vaisselle","type":"sous-catégorie","icon":"liquide-vaisselle-icon","parent":"022"},{"idUnique":"0228","nom":"Pastilles","type":"sous-catégorie","icon":"pastilles-icon","parent":"022"},{"idUnique":"0229","nom":"Gel de lavage","type":"sous-catégorie","icon":"gel-lavage-icon","parent":"022"},{"idUnique":"02210","nom":"Pâte lavante","type":"sous-catégorie","icon":"pate-lavante-icon","parent":"022"},{"idUnique":"02211","nom":"Désodorisante","type":"sous-catégorie","icon":"desodorisante-icon","parent":"022"},{"idUnique":"02212","nom":"Bougies Parfumées","type":"sous-catégorie","icon":"bougies-parfumees-icon","parent":"022"},{"idUnique":"02213","nom":"Eau de javel","type":"sous-catégorie","icon":"eau-javel-icon","parent":"022"},{"idUnique":"02214","nom":"Gel wc","type":"sous-catégorie","icon":"gel-wc-icon","parent":"022"},{"idUnique":"02215","nom":"Déboucheurs","type":"sous-catégorie","icon":"deboucheurs-icon","parent":"022"},{"idUnique":"02216","nom":"Dégraissant","type":"sous-catégorie","icon":"degraissant-icon","parent":"022"},{"idUnique":"02217","nom":"Vitre","type":"sous-catégorie","icon":"vitre-icon","parent":"022"},{"idUnique":"02218","nom":"Meuble","type":"sous-catégorie","icon":"meuble-icon","parent":"022"},{"idUnique":"02219","nom":"Nettoyant sol","type":"sous-catégorie","icon":"nettoyant-sol-icon","parent":"022"},{"idUnique":"02220","nom":"Essuie tout","type":"sous-catégorie","icon":"essuie-tout-icon","parent":"022"},{"idUnique":"02221","nom":"Papier alu","type":"sous-catégorie","icon":"papier-alu-icon","parent":"022"},{"idUnique":"02222","nom":"Sacs poubelle","type":"sous-catégorie","icon":"sacs-poubelle-icon","parent":"022"},{"idUnique":"02223","nom":"Eponges","type":"sous-catégorie","icon":"eponges-icon","parent":"022"},{"idUnique":"02224","nom":"Insecticides","type":"sous-catégorie","icon":"insecticides-icon","parent":"022"},
    {"idUnique":"0231","nom":"Produit entretien","type":"sous-catégorie","icon":"produit-entretien-icon","parent":"023"},{"idUnique":"0232","nom":"Piles","type":"sous-catégorie","icon":"piles-icon","parent":"023"},{"idUnique":"0233","nom":"Lampes électriques","type":"sous-catégorie","icon":"lampes-electriques-icon","parent":"023"},{"idUnique":"0234","nom":"Interrupteurs","type":"sous-catégorie","icon":"interrupteurs-icon","parent":"023"},{"idUnique":"0235","nom":"Prises","type":"sous-catégorie","icon":"prises-icon","parent":"023"},{"idUnique":"0236","nom":"Jardinage","type":"sous-catégorie","icon":"jardinage-icon","parent":"023"},{"idUnique":"0237","nom":"Barbecue","type":"sous-catégorie","icon":"barbecue-icon","parent":"023"},{"idUnique":"0241","nom":"Cahiers","type":"sous-catégorie","icon":"cahiers-icon","parent":"024"},{"idUnique":"0242","nom":"Registre","type":"sous-catégorie","icon":"registre-icon","parent":"024"},{"idUnique":"0243","nom":"Couvres livres","type":"sous-catégorie","icon":"couvres-livres-icon","parent":"024"},{"idUnique":"0244","nom":"Stylos","type":"sous-catégorie","icon":"stylos-icon","parent":"024"},{"idUnique":"0245","nom":"Crayons de couleurs","type":"sous-catégorie","icon":"crayons-couleurs-icon","parent":"024"},{"idUnique":"0246","nom":"Marqueurs","type":"sous-catégorie","icon":"marqueurs-icon","parent":"024"},{"idUnique":"0247","nom":"Traçage","type":"sous-catégorie","icon":"tracage-icon","parent":"024"},{"idUnique":"0248","nom":"Colles","type":"sous-catégorie","icon":"colles-icon","parent":"024"},{"idUnique":"0249","nom":"Correcteurs","type":"sous-catégorie","icon":"correcteurs-icon","parent":"024"},{"idUnique":"02410","nom":"Taille crayons","type":"sous-catégorie","icon":"taille-crayons-icon","parent":"024"},{"idUnique":"02411","nom":"Ardoise","type":"sous-catégorie","icon":"ardoise-icon","parent":"024"},{"idUnique":"02412","nom":"Dessin","type":"sous-catégorie","icon":"dessin-icon","parent":"024"},{"idUnique":"02413","nom":"Loisir créatif","type":"sous-catégorie","icon":"loisir-creatif-icon","parent":"024"},{"idUnique":"02414","nom":"Livre scolaire","type":"sous-catégorie","icon":"livre-scolaire-icon","parent":"024"},{"idUnique":"02415","nom":"Langue","type":"sous-catégorie","icon":"langue-icon","parent":"024"},{"idUnique":"02416","nom":"Dictionnaire","type":"sous-catégorie","icon":"dictionnaire-icon","parent":"024"},{"idUnique":"02417","nom":"Coran","type":"sous-catégorie","icon":"coran-icon","parent":"024"},{"idUnique":"02418","nom":"Livre enfants","type":"sous-catégorie","icon":"livre-enfants-icon","parent":"024"},{"idUnique":"0251","nom":"Croquettes chat","type":"sous-catégorie","icon":"croquettes-chat-icon","parent":"025"},{"idUnique":"0252","nom":"Terrine barquette","type":"sous-catégorie","icon":"terrine-barquette-icon","parent":"025"},{"idUnique":"0253","nom":"Pochons chat","type":"sous-catégorie","icon":"pochons-chat-icon","parent":"025"},{"idUnique":"0254","nom":"Litière chat","type":"sous-catégorie","icon":"litiere-chat-icon","parent":"025"},{"idUnique":"0255","nom":"Croquettes chiens","type":"sous-catégorie","icon":"croquettes-chiens-icon","parent":"025"},{"idUnique":"0256","nom":"Boîtes chien","type":"sous-catégorie","icon":"boites-chien-icon","parent":"025"},{"idUnique":"0257","nom":"Friandises","type":"sous-catégorie","icon":"friandises-icon","parent":"025"},{"idUnique":"0258","nom":"Accessoires chiens","type":"sous-catégorie","icon":"accessoires-chiens-icon","parent":"025"}
  ];


  const searchText = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Filter categories based on search term and prefix for idUniq
  const filteredCategories = categories.filter((category) =>
    category.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
    category.idUnique.slice(0, 3) === prefix
  );


  const handlePress = (item) => {
    const prefix = item.idUnique.substring(0, 3);

  };

  const renderCardItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.productCard1}
      onPress={() => handlePress(item)}
    >
      <View style={[styles.column0, { backgroundColor: '#f9f9f9' }]}>
        <Ionicons name={item.icon} size={40} color={isPressed ? '#3682B3' : '#D15D5D'} style={styles.icon} />
      </View>
      <View style={styles.column1}>
        <Text style={styles.productName}>{item.idUnique}</Text>
        <Text style={styles.productName2}>{item.nom}</Text>
      </View>
    </TouchableOpacity>
  ), [isPressed]);



  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={styles.formContainer}>
        <Text style={styles.Selecttext1}>Etape 1 : Choisir une catégorie</Text>
        <Text style={styles.Selecttext1}>Etape 2 : Choisir une sous catégorie</Text>
        <Text style={styles.Selecttext2}>
          Regrouper vos codes en catégories vous aide à mieux les classer et les mémoriser. Choisir des préfixes définis pour chaque catégorie vous permettra de vous rappeler plus facilement du code produit que vous souhaitez ajouter à votre facture.
        </Text>
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
          numColumns={4}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
          initialNumToRender={10} // Adjust as needed
        />
      </View>
    </ApplicationProvider>
  );
};


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
     width: '23%',  // Fill the column
   },

   icon:{
     padding:10,
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
       fontSize: width * 0.025,
       textTransform: 'uppercase', // Converts text to uppercase
       flexWrap: 'wrap', // Allows text to wrap
       textAlign: 'center', // Aligns text to the left
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
export default memo(Mescodescategoryhome);
