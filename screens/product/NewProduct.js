import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Avatar, Layout, Button, Divider } from '@ui-kitten/components';
import Autocomplete from 'react-native-autocomplete-input';
import * as Icons from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';



const { width } = Dimensions.get('window');




const NewProduct = ({ ModifyProduct, selectedItem }) => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    brand: '',
    quantity: 1,
    price: 0,
    stock: 0,
    nearbySolde: 0,
    timesSold: 0,
    avatar: '',
    codes: '',
    icon: '',
  });
  const timerRef = useRef(null);
  const [incrementFactor, setIncrementFactor] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [suggestions, setSuggestions] = useState([]);  // Stores filtered suggestions
  const [inputValue, setInputValue] = useState('');  // Stores the full input (multi-word)

  // Ref to control the TextInput focus
  const inputRef = useRef(null);

  // Large block of text from which to generate word suggestions
   const largeText =
   'montbeliarde alimentation dabeille tazouite confiture maghribiat coprima arganatal parfumee tuya moringa poivree nouble pistachier lentisque dorigan marjolaine darmoise datlas cypres dail dhibiscus habat yansou zippee dorange cleu stvia sche zippe kraf epce boutielle boutiell minifin browniz azaafaran talioune safran darazaafarantalioune boite plas nad calendula hammam mabio vitar plastiqu vitarg hadga mfassis seffa mfass hamra berkoukch toulati roubaii eucaplytus tapeande hui taktouka boc concombre nouara lahjar lahja lahj boutei boute lah bigaradier tawa manahil ait baam hafs manto mantouj egyptiennes florentine tobigo dwist pyramido kidzo blekis bleo chee fherb chocolat liqu citron reguler filaments morjane duopack friands linge delicat calamrs agglomere day d ange cosmtique squiseur marjanecrales crakers sals yamita bibi wrap cesar nems quiches vietnamienne crudits taboul l oriental fta barkokch dachich bandak lamm lammi plastsv ace silsilat kisas kabla nawm wojouh hayawanat alwoujouh almotaharika selsilat alhawas alkhams ataaraf kalimati eloula kol harf hikaya asatir wakhorafat kitabi kabir palmeraie mythes legendes route aventure fables guide anglais selselat kounouz maarifa riad atfal albitakat alajiba branchs atmar standards arajin vanoise chocoltat vanois cchantilly vanoi pepittes fraise acheter vanille ppromo shake picsou amigo toonz magtop mag chokolta selja kool tabletto goldate deglet nour chamrokh amandor pipetes ecrin delget rimyto beure retz croustillante hydrophile sir intercalaires maternite periodex slips serv keratin pimer purify biotech conditionnees honney conditinnee condionnee crostatini sofia mloukhiya toasties spices mustard garlic loops embrace velvet dent close rred icy blost attraction slipton fingers multipacks sahet shistr cehveux fall defence ment newps defens cassants endommags exprs showr frsh mintra twirl document universitaires sujet odamaa oumat alislam rayarou smax rincag mch house premium molfix living jeans advanced herbal newborn cif ammoniaque fairlovely shchev shp tresemme huile lavendre conditioner shinestrenth softsmooth nourissante glow gri epic energizing refreshing inspiring vitalising pasion rollon whitenning invisibl wat shnorm fiji yiang smoothe bergamot crepon alpha coin madis think within minnie believe let s dance butterflies furios tiffany custard tiffan gingernut gauffrette fris egg fourr strawbery marhaba tifany kookitos rise chunkos rentree five take supa fiori rizzo london pot dair pralinescream break delights rush yummy gotcha nutro chocodattes tamrah emirate dabasse khalass emiratte freshly frosen foods ailcitron fudge crispy dark jewels caramel hazelnut mani canneberges sensitives pnormal solide breded shrimps calamari belinda animation queens moto cartoon elect mus fonctavlum voit roulant vetem recharchable speedy educatif magnetique bessie instrument voitsport tirs chiffre magnet violan acce fonct frict villa transformer flashing snooker casque maxwhite tota whiten health radiant fre artificial extract aloev fric construction perle mbk basket transp turtle childhood depanage moderne aeroport briks crown oble rayon roka nouiilles gl chakour njoum lille cuvx cuv hoi sin chain sambal oelek sriracha polydoc horiz cylindrique sp mash compass echelle kisses kha machines excel malow flexibl button echec lire boxe musicale wheat wholegrain tena pants largex mediumx mchde balsam houten lettre corde support hexagonal villars villar sofigliatine bonomi florentini gigate fiorentini piu carlo exclusive prenium arome pluto arda organiseur mydesk ajour ajouree opaque witor cuore cereali nocciole flat praliner celection flou caffe almand ballons gonfler chapeaux aide merito fraiches hochet fanfan mordillous caserecce arrighi pravioli fromge arr maccheroni lisci conchiglioni lumaconi illy espres decapant moutain nettmoq nexis liq halta nicky colorsmaxi com zaini patrouille caco tortiglioni regate farcikao ciaocio ciao londres. surpackdanone jamila central jibi danao man surpacks armatis yopro protines gervais ausucre lactose oykos danup modonna madonna diss crdefrispm styliss defrisante assouplissante antisep biostrat dissolpm professionnel argane hyderma dissolvant rebelle band origi dissolgm hydroalcoolique oulme ain oulmes pch startine ledda familia challenge tito damas tanga chococolat tongo arno dessrt gaumar gousti dolce desir caramelli dejeuner bubblicious shampoings laits angle colblock concealer eye brightner ssr esl rout blen blender kaj wsh reco demq tis routine falsie essuit hygienique hyg ouat abrasifs abrasif fan poubelle colainord majd que biboo paloma blanca leben frias confabricot josiane frankfurt hassane hassanepiquat mortadelleel sauc madak strasbourg kout piquan lunchon tripack poivn saucissonhot bolognese hrbes predateur fmg galantina campeon boyou lucheon cadum cadu plax optic generat genration perdrix oncl osam sesames marcona cacahouetes jabonnais japonaise gaya emandees amgalita boston arche epis atik annafis grw gpw chumny taliouine silouette tiznit jas tbourida fantasia boulang tit bato casagrey amgal nejma sojalentille essaouirade rayane kri pikarome mayonnaises dessoux pikaro moutard varenne hrissa capucine desseaux desseau pika pikarom cornicho mandarin grillade tunisienne denoyaute condiments condiment coupees pne taoenade wassapique denoyautes denoyautess claires coquiellette coucous linguini njimates axe xylitol redberries mastic croqu hayat zohor lousra huilede sinia oued lio delcy hor fluoryl sourire fluostar bali taiba soraya babour elbabour loubane tonique thevert sorya solube egusto lavaz diaman matino addahabi vival gaufplaisir gaufret classico fluodent reglise savhargane marsavon derma printemp aroma unico carrionclassico latino longue cons jnane raib chargui fawakih khliaa nsucr nss diet finesse bioyaourt daya plaisirs frai vani conserv bouteill vanile yrt anans passi bouteaille bifidus cherg mang anan harazem saiss pageot merou abadeiche glacematic tari diva curcumin eucal eucali suiser eucaly achifaa seauachifaa multifleurver verr joly maquerau confabr conctomate provenca pimente pimentjoly concent jol huilevegetale teptip jess glutamate nouille nuoc mam worcestersh wakame menara oudaia dahby powder keops titan pingoin felicia annee nectar boustane boustan masterchef framboisier pulpe actifruits pina colada bous javana quick delicio porti alimentair mayfine bouil japan assila bolets nuncheon benat tiab libanaise pacha frosty assaisonnement rass elhanout damti her assilla assill assi moite ghouriiba harcha farcimi falafel ghriba pescada tartinable javan bufpouletharr bennat saf harrissa tunis national conffraise elbaraka conffigue conffique mayon confcitron italienne elbarraka model squeze lotconfit albaraka abri figu jerry natio lotconf tasty teb ancien cheezy eazy energ ket regliso gome boomy bip moello moelo rizoo geante pces bonbo mres relisse reglisso alladin chwingum flash freegum freegu baloon buble captain roulou luck gums lucky booster licorice splash spermint wondermint blackurant chlororphyll theatro bubbles primuim prairie douxla essentielle nesma mamati mrg vital jebli groupee ambassadeur capric garome dubois boncafe supremo capresso decefeine metallique compatibles costarica guatemala lyophilise intenso chipsy argana fiore srgras argade argaderm alumgeant alimstandard alimstd alumunium laize drawstring dynamic bellissimo pronto dynamique laarada mondial prima verres sou gratuites armonico legero foce tass offer gesier ronchos rockers fakiat lisseleader senior roc ondul lead ondulee leade cerpoks boul conikos rondas trigonos fronion barabecue jaouda cremy linea decreme besty perly ghani homogeneise muscly ghilal banderole panche drink press jaoud mixes conserve monjus dlicimo surgel cornes tartin lgumes up herb bnina bordeau deinde toro piqua socrech pizzacheese natue mentho ppt lyptus clorets bubbaloo evrl lem pasteque cebon rins antarik feuilletee plantami plantamin imbrator abadache rouget oros gfr sim mery mori vegecao marita marit maro simsim morina boyo rownie ronda citrona jap madelnormale mary trini madelfraise madel marytrin marry madleine marbree origina sandwichy ori tortas rosana grileesrosana rozana bononi pisaches dar roudani roudan assalla amuz mediteraneene panko provenciale egyptienne nra grecques mslalla thy cannell corichon olivesmesllalaaucitronetal vrioul jablati semi omk goute crcodream saffran unique nature saffranmuhammad pistachefriser aborigine syra granules soimi avec gisement a menthe cache coule e pinpin haycho chip kchips astucit zinal moubacha gache noisette caracou kcal yaourt amirati orienta oncitron orientale vae case fresh orient orientai vnlalou maouani myttain ml grapefruit ananas cm xsuchard noir chocolaterie suc cad coeur fondant grand moins clés angles obliques tailles finition flamant poupée bambin popon nourriture magique flottant poupon feeding baignoire poussette deluxe tenue fonctions fourrure tendances robe paillettes balance interactive licorne lumière tirer empiler bateau eau pirate éducatif circuit arbre fléchettes tire coiffure tresse fuse figure biberon jolie molle fonction memory bear squeaker bunny playmate toys teether birth plush rabbit anneau mobile phone cascadeur usb véhicules équipe urgence pull sloth tasses empilage sensory pyramide mannequin pretty lingots motta limes larges professional elite brossage oval beauty cils maquillage brosser céramique râteau liens ornement barrette picot démêlant ventil poils feeling wood calcium brekkies adult keta pacifique tlj mejhoul bouzkri catextr alvéole persavon savaman glycérine batoasis karelea ssel ssglut devine juliett eab clic clac époxy cab kmj kob applicateur bro monobloc brushing youki pab pédicure kpj bicolore ponce kpb gant kpr cosmétique koj ergonomique pièces rechanges pneumatique houpette kmb finish styles absolut isla purple rebel délicieux suprasonik suprason dépilatoire éclaircissant remov éternel bandes dépilatoires ais minéral allonges pop fruit batpop mangue bio soccer unitaire lenotre maiso usag bicarbonate turques garland cal baglama lerida senses figures coquillages wit slava tornado tomato salsa motto bruschette fettuccine sour diib ghabati allotf colorie biblio almoshaf almohamadi charif noble macmillan readers starter beginner intermediate upper science politique psychologie psychanalyse almobassat tafssir aljalalayn moshaf sitar kaaba modahab allissa intensive colour blond chati chata int hev marsala brouge mahogany ramette fornax crglyse glysolid glyso hmme corporels trilogia schoget schig chocforkids schogett mauxion grandezza feelings happiness fontessa salut mauxio schogetten chocoblanc choccorn pralinritter chocbiscuit slics chio stickletti stickleti potato brezli crackings wolf heart offre chick easter teddy linodr présentation renne noisettes choget chocsemi ammer nussenia ristorante mozza fromag funghi baguette quatro fromaggi tonno rucola cannelloni épinards four makkaroni orno tortelloni gorgonzola cebo tartiner croustillant revolver kalfany ice boîte bonbons cat cocopops chocos vossko caste fluos pansement hansaplast strips pans aqua prot pansements argile anti-ride matifiant apres sens masque dry impact diamond carotène fps cr corps atom satinée deeper désincrustant teinte nuit pelliculaire coconut fairness hold séchés protectrice swim play nourrissant pts douche hydratant démaquillante wash defense nive blackwhite écran protection bronze spf scheerschuim transpi dep minute revive fruity femme démaquillage visyeux démêleur clay hibiscus protect sensitive après range beu acid espresso lisse normales pps powerfruit look patch purifnez kao biore octueuse apaisante aérosol refresh dchaqua shdch cheveux shower mascfresh deofmefrnat kick atomfme lily lemonoil sunshine organic dickie formula racing traile btb scoop lofty dodge challenger srt eat dust rally forces internationales sky patrol stabilo boss écrit point othello bleus stabi easyoriginal bleues bargar confraspberry stute morello daib confstrawberry confblackcurrant diab dia biscuits spritz borggreve simba sweets sitter steffi hairstudio incl present pression dinoland dentiste cul magnetic capital chiffon cute cuddly bonuspack noris praying mantis marabu pannes mozzarella pefc réservoir aquarella graphite staedtler abs aquarelle wopex staedler pastels fluorescents prom abk stae pauly schoko bons diable détacheur détachant rouille flak hahne chocolinis lar feui applicat mousse titania romain tribun agricultrice brouette rainett écologiquement lesliq ecol vinaigre fbr herbs teekanne skittles chewies miniature snickers allume pétrole flammat flamax cheminée yogi calme cavendish clear dresdner stollen carton riegelein pnoel chocs confiserie riesen euka paradise toffees sof glatt caribean paradis dchvanilla coloration chev taft looks zone silk magnolia silv carrab sport clr ultimate shgliss boys syoss conditionneur therapy dazzl rincer ultime elixir attractif force whitening sollicites ulti always protège serviettes pampers pam panty thick crest vitalizing alw rox plumes couches midi machine ariel pantene daily dodot tide shampooing renouvellement hydratation leibniz butter bees wholemeal abc balhsen waffle friends waf piccadilly biscchoco bahls butt chipsletten pomsticks texan onion nic nac texamba loomies cacahuètes onions crustics hot spicy crchips light sal crchip fraîche saltletts lor stackers paprika loren cheese grillées fascinations chili bee wildflower acacia alpine pailleté patafix correcteurs fluides swist pâtisserie meggle megg liegois haver havery harvey candies caven brezel dévidoir past scotch propre head shoulders oral b prof healthy whit régulier downy soyeux hs menthol chute smooth silky kuchenmeister beechies team ultr pile calculatrice casio plus ass sucet colors buitoni piccolini crisper cadres religion nice marge chema chemise palaseja tendy daksy colgate twister janie camion wlight asst col ref châteaux store cible archery motor only gun wmasq archer fire engine track boxing chiff wic rot guitare blocks billard foot cheval sweetie sound hunter game fléchette projection camera baril dominos pentel collège veet algérienne maltesers snikers celebrations single inclusion nip botte limit balottin octogonal corolle pedigree chiens volaille table scalp after eight quality londre cirbteneutre prest disc btier disq flor blst tige jjbaby dépil flo aloe shortcake digest diges hobnobs mcv wholesense spongebob gatea creams complet weetabix bran alpen english liquorice fuzz biscrok dentastix hall crisps jordans fruits noix orge courge fram cass cramb roues libres smartphone vehicule diecast card music player bus ville playset curs baton friction petillante pdq tremblant robots rigolos couleu electronique langa jeux volant first activities shopping themes cle tracteur remorque roue spiderweb halloween masques parking station adultes tambourine accordeon chise ostrich disp funky swan displa display necklace bijoux creatives memo jetons karaoke jungle dinosaurs walking try converters pompiers portable tool tenues dressing accessoires decapotable glame licorn desserte chariot theiere chateau poneys licornes sparkle braid styling wooden theethercomforter doudou conforter projecteur animal stacking activity rollglow race along truck pal piano tunes vehicle carpet police channels flip over function quad retro drive controle vocal montre venom dash fonctio licence snowy princess dress helmet tools peluches assis girlz malette fur lazy yon attitude shape multipoches essential planes trans cosmonaut mermaid essentiel compartiments cartable mesh symetrical auch kaki leaves rubbers auc vitacuire assortment bistro emi canapes emile pies fromagmpg monoprix meringues mpg nordique moelleuse marie grm poir chocnoug florance tilleul reva goutakchocolat goutak ptit kidhero eloi bouton labell ailletes labellia anat confprotultnorm filtres plant degustation ivoria ptt recharg bretons turbulo chocolait toutchoc gcrok chabriorasst fours toasts brioches suedois qual filt glacier pec elodie milkichoc kanoe cappu forme cleger plexq crep ult ailet comfort cotzentao crokawak formefrts sortilege cerealch lyparex perform optiques decaf maestro cappucino samarcande nui etoil ceyl maxhav coterley tarteletcarrcitron agrum netto briefing degustatcorse napchoco servmaxi coterthe vrt biscnapchocolt bisctabchoconr croustfrt inffrt chock pommette cappuchoco confmyrtill cotterthe infude infudu soir flexi voile disques demaquiller demaq gpv pochettes adh fabricat nouris mains subl pompe antibacter shampoing lpt marseill antipelliculaire gouters complets germe pilpa buchette batonnetoasis multifruits tatin meringuee aviko sanglier cristaline pbeurre gambade coaties rok fourree ven couvpolyp smiles cain rissolee just vapeur gpcar varies escal aperit vegeta esca aperitifs fromager escarg feuill escar mille recette ahf msc vierge aretes conne conn sauces ol genereuse basili escabeche catalane sardines lesieur squeeze lotte conte resine evolut aquacouleur mediu vis gibert eras lines oeillet agipa etiquettes scolaires moret chavroux sojasun vegetal steaks flippi daim buchettes fru chalet signature vanmoelleux frambcitron mangpassion pirulo balsamic vinaigrette vinaigretfherbe grated ecoiffier abrick learning tow biolane shampdouceur liniment lingvisage apaisant linglait biolalingette coiffant lingpocket dermo surgras amanddce gourde boursin ufs lompe blini cabillaud gousse figgy fruizz fusee cornets thir pouss exalto croustillantes liegeois melba sunday givres givrees profiteroles griotte rhone hypo ecocert scassis scitron sfraise volup fac tar brul amar cascade briochettes parisienne parisiennes choukettes brulees financier acras bouchees allumette chevres aperitive houmous persille epinar tielles cuire paniers tartes croustades flamm etal brisee rochetta quenelles brochet bretonnes blinis fleurettes fleurette mogettes potirons asperges blanchies plats fonds salsifis grelots quartiers cotes blettes brunoise campagnarde wok terre cuisinee ecrase pomm vitelot ciboulette coupee galets echalote morilles girolles vap wedges prefrites dauphine duchesses biologiques tortelli tortellini cremeuse concassee grenailles caponata flans fondants celeri asperge champi broc troncons saumonette raies limande carrelet paves omble chevalier fletan arete eglefin choisi flt kbio albacore alask meuniere merlu panees encornets farcir decoquillees demer espelette pecten maximus moul nsj crevetnord decopetite gambas ecrevisse bouchee brandade pistou provcle ravioli gnocchi poeler butternut pdouce calmars gyoza chaussons rhubarbe griottes prunes frambois brisees parmentier tits baguettes croissant croissants opera parts donuts beignet muffins liege normande pasteis indien eppe isothermes litres roipanga panga provenc vsl artison givr canderel briqu cander comprime individuel cand yeti geants savmarseille fransa ancor chatel swet dolly monster munch margharita oreillon marica agur carolin nettoysol parqvitrif solitaire canalisation energy degraissant degr calc honduras conchiglie tricolori minpalmier vertmpg mpx strozapretti nuddle miot blend pfaff citronel tvert sencha eclat superfruit mbp mirabelle camargue mbs gruau cart cigare chokito madelaine spofy flipper gitan flipo petithenry henry phenry gourmets cannelonie skim panacha gour charmoula clu milanaise hachis parmentir moussaka chilicon carne patygel basquaise torsadee cordon panure margherita tiger louis blsaint fitness fitnesse crisp nesquick grahams perenono noctaflor bergolin budget robusta ppgs comp bidget cook patis cflakes bare disqa guerande breto paysan hagendaaz cheescake fraisecheesecake haagen dazs minicups barista macad nut fav cokies batonet bridor chevalargassortlait chevalargassortnoir xchev arg mendiants xchevalargcafegourbio chevalie xchevalargboiteassbio chevalargbalassbio chevalargbalasnr chargassort mend bal plais fant chevtruf metalise boum edp love generation sexy colonial amore rock victim ammour cassandra gavottes magda cuits decap cuir court classiques jeunesse titres soricho senteur arb lav vais hydrosolub arbre adouc soufl peaux sensib yaggo aliment marquis lacte yago bombe litchi majorette die cast flashers limited panneaux signalisation helicoptere farme shtres corine corporelle corinne hydr lavant demelant pirates disseny version des sans virgule ni autre ponctuation valides bord matic hex marker ast velleda combos briquet cristal retractable perm grip pouch plast blister evolution triangle feutres visa fun fluo liner text fashion shimmers stripes rasoirs jetables correctpen assorties velocity soleil slim marq wipe tarimiel citronnier agave cranberry aquafresh dentfraise antibact adhesive bouche chamallows floppy bonbsacht rotella dragibus dynamix soft tropifuitti mont nougat verquin acidu chocofetes citronnettes barres crocchoc cassonade ambre galette tranchettes moelleux panna anglaise fructose raviveur doses nappe tartines emment croutons aperitif cachet italian cah spirale dessin perfor incolore volucelo enveloppes comptoir bec verseur allumettes gratin crème camembert noise grille rissole alaska dauphinois blocs flageolet javel végétale étirable ratatouille torsades beurre tuiles gressin cidre cereal amandes brioche gousses sucre madeleines tartel tarte madeleine tortillas fajitas oxy colza concassé sablé camomille julienne compote banane pêche pruneau abricot tartiflette moutarde soupe mascarpone millimètre pistache spaghetti penne anticalcaire vitrocéramique pureée pommes macaron framboises mangues caviar cocktail cappuccino coulis naturellement genovese mayonnaise lotion bouillon exotique le texte réécrit uniquement les existants, collés uns à côté autres pages baroud burger keba kharoub pecan cappriccio sac isotherme marytrini gazelle gommes rasoplast tablette barba crepe nutelle chantilly gaufre morceau glacons surgele kids artichaut cuisine rouges blanches abricots mortad energie sucrees ballotin nugget aneth madre gie wahat aromatise terroir caroubier jawhar cooperative fondu macedoine charcuterie moka carrion surligners couleur short ardoise genova novita fish funny hospitalite desrt capriccion bombo cremo sesa castillo biscuit journalier couture emulsion tarama mouchoirs cubic pots estetic edulcorant sweet mor sauci din rafiaa vanibio coquelet jasmin coupelle vire peches timor chocao arluy tablettes buches fiesta popcorn spec epinard goldy bte abric purisima dora from bande plaquettes norvege find colin guirlande margaritta pint boyau betterave donner fromage baby mouton pizza pique ceylamix kefta cosmetique paella langnese forest chwin watermelon cremain deo power active men masculin care invisible effect visage eclaircissante demaquillant expert waterproof feminin flower soin protecteur solaire deodorant ocean ketchup savon dettol bonbon street smarties fisherman friend sprite coca morue stimorol knorr margarine solty loacker mutti tic tac rocher nutella raffaello kinder gaufrettes contry pastilles edition stik transpirant dove cachou dietorelle bottle winter juiceblastred pock mentos juice blast pocket bubble joy mango lemon pineapple creamy summer festival filipinos vitaminec peppermint dragee chupa chups boisson gazeuse fanta mayo flacon penotti dentifrice signal enfants glac rauch energtique bull pom sauce tabasco chipotle dakota reese hershey cookies topping packs pringles shortbread gluten ginger animals scottie granola burrito maille spaghett tutti brownies rainbow marshmallow fluff vanill cinnamon classical early grey breakfast ahmad blackcurrant cassis grenade hydratante micellar maxfresh hobnob rasage flamingo twinings ceylon darjeeling honey atlantis correcteur rasoir lames flex cookie benjerrys nouilles indomie sautees noodeles chiken filtre minral saucisson pastor mejhouls raviolis fromages tagliatelles linguine lasagnes fusilli rice marqueurs marqueur advent scrabble buggy course meccano aluminium nettoyant polish margarita peperoni gelli princesse coffre tresor violet bananas sacs congelation film interactif puppy couleurs lumieres cadre photo maisonnette comptines monde mexican nacho colacao boutons relaxante senteurs coupelles confitures mortadelles hotdog grisbi mug filet carottes industries chataigne mures calamars abadeche croust pan nuggets book milkshake artichaud oreiller origa dinde mask lumineux bar vicenzovo assiettes boulettes classics kellog junior mortadelle biskrem dietetiques vol shamp pret gingembre henna nana permanent tableau ultra protein carefree alwadi cortas grano poires williams airelles myrtilles hello crunchy relax phantasia starmix vintage fluffy toupie lumiere tapis chai livres gelatine musli barak abimes fragilise sensea coton assala mielpops sandwich ours plage docteur deformation poupee boucles outils pocker jouets bricolage ailes conservateur balls vita arom ring space marshmallows citro aromat cayenne pause silhouette plantil pommade notebook arabesque nutela dino gaufres boulle gerble chocol cremes glacees sorbets gateau granita bouteilles liquide vaisselle maxis rafi sultans rouleaux toilettes ketch caddy sanytol gel argile morando boites chien himalaya creme sorbet zoo voitures luxe elephant diy xylophone trieur peluche lumineuse kissane shells aicha gift metalique mallow silicone cup instan lave vitres recharge parfu infusions cac couverture elastique metalli brazil coupes burrata poubelles folia levures sucres vaiss regular boudoirs emarates savoiardi bien etre transformers danceur dinosaure cameleon bain moussant levure rais turque amende coloris trolley textliner pastel scolaire congel zip listerine blancheur seau jacquet tagliat monte bimo coloriage collection sports vetements micellaire dijon amora chassis flan toffifee storck oinions vinegar achetes marzipan choc name olive denoyautees vert confit choco extra fin frutti cerelac nestle chocolatalait alpin milka almendra praline nougats soja palmyra coco boule fourres rikrok lettres moulin corn flakes nicoli batonnet son fibr nico miel eucalyptus pvc oranger verre chips sale leader pack moretta classic baraka gaufrette vanil bauducco gaufr mix ssucre vir bisc biosan veg virgi activa bonb eclairs pick cracker peche sirop harmony okey fleur lune cvc biscuiterie assortis dore poudre chocolatee delicia planteur cafe chicoree orig sachet werthers benco cartier morceaux suave arabica capsula nescafe gold decafeine non branded assorted jellies box galaxy flute sultan hosp atlas mogador marrakech merendina classique lait boisausoja nat regain cotterley the earl scientifique golden materna pomme poire broccoli jardiniere legumes snack haribo droppy croco grt format carrotte lay barbe papa good grs digestive krit canape tosfrit kasky anillos maiz sabor itkane gunpowder tranches snacking souffle pdt eco sales prdt vitameal babay bebe feu melange normal nor degestive tutku mozaik cake paykek cacao nido fortifie guld barre orange knas trident strawberry multipack lot diamant prix chocochips biscolata souiri caravane christmas hearts poulet roti cafes soluble capriccio cuil sel ajoute patc crunchips edit limite lorenz chewing gum colfresh icemint farine bergen free sugar elvan today roll donut romarin halls pieces youpi tubes chab goutfourre petits chabptpain chabrior chococreme clipper lindt creation selectethiopie lipton bonus sachets gratuits hero black cherry capsules coffeemotion cream ristretto confitur vitrac preparation express emco naturelle sandook cadeaux twix white mms mini bag noire mediterranean duo asta epice mcvities bars chocolate carte twist inou divers parfums soho sante avoine tab excellence solu regal tbudget riz gullon cuor cola lamy lutti seasame squeez blackberry bottles paquet noi jarres samar gusto gingerbread maison assortiment vendome cakes figurine crousty oignon paysane pipas grilees mais potage cajou grillee import infusion bonne achete infus ofrt gianduja lays kebab raspberry pure frappe ritter jacobs monarch stick moulu tango tonik chok torrie decafei fromageoignons pictolin sache fizz worms ideal sucrevanille cone michoc festif sticks casino sesame sable napchoc bat vrille cigarette gourmande tabchoc dessert desserchoco barchoclt legerete gragibus pik doree promo livret gratuit vitahalib economiq grat miyaz grains meta chaara croquant magnum celebration bipan oeuf surprises barbie zain mint gouter metal cars chocodate flatbox nesquik pillows etuis capsubles compt java oats caps ports cereale offert lavazza mattino fourberies scapin krispi crackers selman alpella gauffre bis fourre dattes ulker petit ble nan isotherm betty crocker chantil hit bahlsen amada max milky genoise delisana jelly chocola cerise milkinis oreo whole hazelnuts bubbly milk ahoy cocoa tuc schokodrops toblerone thins vanilla wafer belvita mokate tigo instantane silver capp belge macchiato gauffrettes capri ozmo cornet beurres comte poivre sables cereales nappes choclait cheesecake double stuff tender cow maretti tea conf marrons glaces bmnlcasino selection detox snowman marjane sensation chococrispy codobiocasino prince edam moro mandolin finger sec kat jacquot poul couv paques poule cemoi vichy garnie couveuse garni bxoeuf flam lapin alu fil grcon cem lap gar cloche poisson compo mega ptoeuf pral nois oef cara assor sch mouet drag tub coussin conft friture confetti poeuf tend oeufs moulage nestsmrt coque playmobil aid colection flocons entieres lion fitnes fayz forza profondo poker bouteille coffret ambar cremfleurs plat fete ferrero ferero snacks potaje jarret boeuf bavette aloyeau tranche terrine chapon epices rillettes canard oranges test kilo pese merguez benyassine rouge produit economique anchois marine bonderilles poulpe sardine cote trad carcasse entiere harira gruyere land pizzarella majhoul vache roqueforti cendre congele fume herbes cur pamplemousse seche maasdam gouda cumin emmental bleu libre service bouquet quart arriere avant pochon viande hacher agneau marocaine saucisse fine blanc glace longe epaule geant cantorel entrecote escalope provencal kasher piquant olives provence brie assiane bousthami tadmamt jaune ail semoule portion macaroni dur roule bon gout koutoubia choix grias amande pes colisage napolitaine collier pois casse fes foie pruneaux boeud carcase papaye cacahouette coquillage etoile chawarma globe decortique kafta graines couscous piment coriandre racines cannelle curcuma cacahouete muscade thym origan feuille unite veau premiere osso bucco queue rognon femmelle poitrine brochette coquille tagine clou girofle sechee framboise cotelette gigot faux select rouelle palette paleron jumeau beefsteak merlan brochettes tournedos quinoa feveroles cheddar feve confites onglet maturee confite chia beldi pates oingions rosebeef flocon grosau charolais guil cassee lentille amandons lin provencale chermoula mesllala hamburger tendron tomate frit cheesarella boudin melon trempee variantes pouchon grill citrons mediterraneen mechoui blanquette langue tete barbecue denoyautee rondelle saumure cornichon puree mixtes tunisie oignons kabab rotis farci tourteaux farcie enrobe bas salami plastique poivron croise cresonette bacon tello parmigiano rigiano farciees croustillants char rigatoni pepin tournesol decortiquees baie goji haricot pistaches pavot greque trois poivres tartare aloayau minis carambar claire reglisse michoko crocodile scj rings doggy happy cherries cacahuette enrobee colore grillades slices cuisse cornishons jabri kraft truff cervelle rate peach salee cacahuetes wazabi poichiche healty gomme oie coq faisan sauvage chevreuil lievre marron figue tropimix chorizo manchego cello bonbtofita coquillette monada'
  ;

   // Function to split large text into unique words
   const getUniqueWordsFromText = (text) => {
     const words = text.toLowerCase().match(/\b\w+\b/g);  // Split text into words using regex
     return Array.from(new Set(words));  // Return unique words
   };

   const words = getUniqueWordsFromText(largeText);  // Extract unique words from large text


  // Load your custom font

  const [fontsLoaded] = useFonts({
     'Codebar': require('../../assets/fonts/barcode.ttf'),
  });

  useEffect(() => {
    if (selectedItem) {
      setProduct({
        ...selectedItem,
        price: parseFloat(selectedItem.price), // Convert price to float
        // Set any default values here if necessary, e.g., quantity: 1,
      });
    }
  }, [selectedItem]);

  const [showDescription, setShowDescription] = useState(false);

  const handlePress = (direction) => {

     let incrementValue = 0.5; // Default increment
    // Update product price
    setProduct((prevProduct) => ({
      ...prevProduct,
      price: prevProduct.price + (direction === 'increment' ? incrementValue : -incrementValue),
    }));
  };

  const handleLongPress = (direction) => {
    // Reset seconds counter
    setSeconds(0);

    // Start the timer
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 0.2; // Increase by the interval duration (200ms)

        // Determine increment value based on elapsed time
        let incrementValue = 0.5; // Default increment

        if (newSeconds > 5) {
          incrementValue = 100; // Increment by 100 after 10 seconds
        } else if (newSeconds > 3) {
          incrementValue = 10; // Increment by 10 after 5 seconds
        } else if (newSeconds > 2) {
          incrementValue = 2; // Increment by 2 after 2 seconds
        }  else if (newSeconds > 1) {
          incrementValue = 1; // Increment by 2 after 2 seconds
        }

        // Update product price
        setProduct((prevProduct) => ({
          ...prevProduct,
          price: prevProduct.price + (direction === 'increment' ? incrementValue : -incrementValue),
        }));

        return newSeconds; // Return updated seconds
      });
    }, 200); // Adjust the interval duration as needed
  };

  const handlePressOut = () => {
    clearInterval(timerRef.current);
    setSeconds(0); // Reset seconds when button is released
  };

  // Show a loading indicator while the font is loading
  if (!fontsLoaded) {
   return <View><Text>Loading...</Text></View>;
 }

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container2: {
      padding: 10,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: 8,
      color: '#FF4C4C', // Red color for emphasis
    },
    infoText: {
      fontSize: 16,
      marginBottom: 16,
      textAlign: 'center',
      color: '#555555', // Dark gray for better readability
    },
    avatar: {
      marginBottom: 16,
    },
    formContainer: {
      padding: 10,
      width: '100%',
    },
    input: {
      borderRadius: width * 0.02,
      borderWidth: width * 0.003,
      borderColor: '#666',
      padding: 10,
      backgroundColor: '#F6F6F6',
      fontSize: width * 0.04,
      height: 50,
      margin: 10,
    },
    input2: {
      borderRadius: width * 0.02,
      borderWidth: width * 0.003,
      borderColor: '#666',
      backgroundColor: '#F6F6F6',
      fontSize: width * 0.04,
      height: 60,
      margin: 10,
      width: width * 0.9,
    },
    input3: {
      borderRadius: width * 0.02,
      borderWidth: width * 0.003,
      borderColor: '#666',
      backgroundColor: '#F6F6F6',
      fontSize: width * 0.04,
      height: 100,
      margin: 10,
      width: width * 0.9,
      padding: 10,
    },
    ButtonCreatInvoiceContainer: {
      height: 70,
      color: '#fff',
    },
    creatinvoicebutton: {
      backgroundColor: product.name ? '#3682B3' : '#f2f2f2',
      borderRadius: 50,
      color: '#fff',
      margin: 10,
    },
    cardContent: {
      flexDirection: 'row',
    },
    column1: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3682B3',
      flex: 0.4,
      height: 100,
    },
    column2: {
      flex: 1,
      paddingLeft: 3,
      backgroundColor: '#3682B3',
      justifyContent: 'center',
    },
    column3: {
      flex: 1,
      justifyContent: 'left',
      alignItems:'left',
      paddingTop:10,
    },
    column4: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center',
      marginVertical:30,
    },
    icon: {
      padding: 2,
    },
    date: {
      fontSize: width * 0.025,
      color: '#333',
      fontWeight: 'bold',
    },
    description: {
      fontSize: width * 0.025,
      color: '#666',
    },
    Selecttext8: {
      fontSize: width * 0.05,
      fontWeight: 'bold',
      color: '#fff',
      textTransform: 'uppercase',
    },
    Selecttext14: {
      fontSize: width * 0.04,
      color: '#333',
      fontWeight: 'bold',
    },
    Selecttext144: {
      fontSize: width * 0.03,
      color: '#666',
    },
    Selecttext15: {
      fontSize: width * 0.07,
      color: '#333',
      fontWeight: 'bold',
      marginHorizontal:20,
    },
    Selecttext9: {
    fontSize: width * 0.3,
    color: '#666',
    fontFamily: 'Codebar', // Use your custom font here
    letterSpacing: 5, // Adjust the value as needed for desired spacing
  },
    flagContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginRight: 8,
    },

    suggestionsContainer: {
   flexDirection: 'row',
   margin: 10,
 },
 suggestionTag: {
   backgroundColor: '#ddd',
   paddingVertical: 5,
   paddingHorizontal: 10,
   borderRadius: 20,
   marginHorizontal: 5,
 },
 suggestionText: {
   fontSize: 16,
 },

 productCard: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   borderRadius: width * 0.02,
   borderWidth : width * 0.002,
   borderColor : 'transparent',
   elevation: 1,
 },
 column00: {
   backgroundColor:'transparent',
   alignItems:'center',
   justifyContent:'center',
 },
 icon2:{
   padding:10,
   width:width*0.18,
   height: width * 0.18,
 },
 column1: {
     flex: 1,
   padding: width * 0.02,
   alignItems:'left',
   justifyContent:'center',
 },
 productName: {
 fontSize: width * 0.03,
   fontWeight: 'bold',
   textTransform:'uppercase',
 },
 productDetails: {
 fontSize: width * 0.025,
   color: '#999',
 },
 column2: {
   flex: 0.5,
   padding: width * 0.02,
   justifyContent:'center',
   alignItems:'center',
   width:'100%',
 },
 totalLabel: {
 fontSize: width * 0.02,
   color: '#666',
 },
 totalPrice: {
   fontSize: width * 0.04,
   fontWeight: 'bold',
   backgroundColor: '#3682B3',
   borderRadius: 50,
   paddingHorizontal: 10,
   color: 'white',
   textAlign: 'center',
   overflow: 'hidden',  // Ensures text is clipped within rounded borders
 },
  });

  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleInputChange = (text) => {
    setProduct((prev) => ({ ...prev, name: text })); // Update product name
    const lastWord = text.split(' ').pop().toLowerCase();
    if (lastWord) {
      const filteredWords = words.filter((word) => word.startsWith(lastWord));
      setSuggestions(filteredWords.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleWordSelection = (word) => {
    const wordsArray = product.name.split(' ');
    wordsArray.pop(); // Remove the last word
    wordsArray.push(word); // Add the selected suggestion
    setProduct((prev) => ({ ...prev, name: wordsArray.join(' ') + ' ' })); // Update product name with a space
    setSuggestions([]);

    // Refocus the TextInput after selecting a word
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const iconMapping = {
    'cartinvoice': require('../../assets/invoice/cartinvoice.png'),
    'calculatorinvoice': require('../../assets/invoice/calculatorinvoice.png'),
    'barcodeinvoice': require('../../assets/invoice/barcodeinvoice.png'),
    'unknowninvoice': require('../../assets/invoice/unknowninvoice.png'),
    'barcodeinvoicegrey': require('../../assets/invoice/barcodeinvoicegrey.png'),
    'cartinvoicegrey': require('../../assets/invoice/cartinvoicegrey.png'),

  };
  const totalPrice = parseFloat((product.quantity * product.price).toFixed(2));

  return (
    <Layout style={styles.container}>
    <View style={styles.formContainer}>

    <TouchableOpacity style={styles.productCard}>
    <View style={styles.column00}>
      <Image
      source={
product.source === 'calculator'
? iconMapping['calculatorinvoice']
: product.source === 'cart'
? iconMapping['cartinvoice']
: product.source === 'scan'
  ? iconMapping['barcodeinvoice']
  : product.source === 'Unknown'
    ? iconMapping['unknowninvoice']
    : iconMapping['unknowninvoice'] // Fallback icon if none match
}
        style={styles.icon2}
      />
    </View>
      <View style={styles.column1}>
        <Text style={styles.productName}>{product.name}  </Text>
          <Text style={styles.productDetails}>{product.ean}</Text>
        <Text style={styles.productDetails}>
          Qty: <Text style={{ fontWeight: 'bold'}}>{product.quantity}</Text> | Prix: <Text style={{ fontWeight: 'bold', color:'#000', fontSize:width*0.04  }}>{product.price} Dh</Text>
        </Text>
      </View>

      <View style={styles.column2}>
        <Text style={styles.totalLabel}>Total in Dh</Text>
        <Text style={styles.totalPrice} numberOfLines={1} adjustsFontSizeToFit={true}>{totalPrice} Dh</Text>
      </View>
    </TouchableOpacity>


  <Divider style={styles.divider2}/>
  </View>
      <View style={styles.formContainer}>
      <TouchableOpacity >
        <Text style={styles.Selecttext14}>Nom complet du produit  </Text>
        <Text style={styles.Selecttext144}>Écrivez le nom du produit que vous souhaitez ajouter. Vous pourrez modifier ce nom plus tard dans les paramètres. Le nom choisi sera visible sur la facture. </Text>
      </TouchableOpacity>

      {/* BottomSheetTextInput with initial value from product.name */}
           <BottomSheetTextInput
             placeholder="Type something..."
             value={product.name} // Use product.name as value
             ref={inputRef} // Attach the ref here
             onChangeText={handleInputChange}
             style={styles.input}
           />

             {suggestions.length > 0 && (
 <View style={styles.suggestionsContainer}>
   {suggestions.map((suggestion, index) => (
     <TouchableOpacity
       key={index}
       style={styles.suggestionTag}
       onPress={() => handleWordSelection(suggestion)}
     >
       <Text style={styles.suggestionText}>{suggestion}</Text>
     </TouchableOpacity>
   ))}
 </View>
)}


        <TouchableOpacity >
          <Text style={styles.Selecttext14}>Prix unité en Dh </Text>
          <Text style={styles.Selecttext144}>Le prix de base proposé est une estimation du prix du marché. Indiquez votre prix de vente en maintenant les touches + ou -. Le prix que vous saisissez sera enregistré pour les futures transactions. Vous pourrez le modifier à tout moment, mais cela n’affectera pas vos anciennes factures.</Text>

        </TouchableOpacity>

        <View style={styles.column4}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
         onPressIn={() => handleLongPress('decrement')}
         onPress={() => handlePress('decrement')}
         onPressOut={handlePressOut}
                 >
          <Icons.Ionicons name="remove-circle-sharp" size={width * 0.2} color="#333" />
        </TouchableOpacity>

      <Text style={styles.Selecttext15}>{product.price.toFixed(2)} Dh</Text>

      <TouchableOpacity
      onPressIn={() => handleLongPress('increment')}
        onPress={() => handlePress('increment')}
onPressOut={handlePressOut}
                >
          <Icons.Ionicons name="add-circle-sharp" size={width * 0.2} color="#333" />
      </TouchableOpacity>
  </View>

        </View>

        <View style={styles.ButtonCreatInvoiceContainer} >
          <Button
            style={styles.creatinvoicebutton}
             onPress={() => ModifyProduct(product)}
            disabled={!product.name}
          >
            {selectedItem ? 'MODIFIER PRODUIT' : 'AJOUTER PRODUIT'}
          </Button>
        </View>
      </View>
    </Layout>
  );
};



export default NewProduct;
