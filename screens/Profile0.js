<View style={styles.ButtonBox}>
  <TouchableOpacity   style={[styless.filterButton, { backgroundColor: cameraOpen? '#3682B3' : '#F6F6F6' }, { color: cameraOpen? 'white' : 'black' }]} onPress= {() => setCameraOpen(!cameraOpen)}>
      <View style={styless.column4}>
      <Ionicons  name='camera'   size={width * 0.07}  color={cameraOpen? 'white' : '#d1cfcf'}  />
      </View>
      <View style={styless.column5}>
      <Text style={[styless.buttonText, { color: cameraOpen? 'white' : '#d1cfcf' }]}> Camera</Text>
      </View>
  </TouchableOpacity>
  <Divider style={styles.divider2} />
  <TouchableOpacity
   style={[styless.filterButton, { backgroundColor: isFocused? '#3682B3' : '#F6F6F6' }, { color: isFocused? 'white' : 'black' }]}
    onPress={() => {
      if (!isFocused ) {
        expandBottomSheet()
        setIsBottomOpened(true);
//        setShowCards(true); // Show cards when not focused
        setIsFocused(true);  // Set focus state to true
  //      setSelectedComponent('Product');
        setKeyPadOpen(false);
      } else {
        setIsBottomOpened(true);
        closeBottomSheet();
  //      setShowCards(false); // Reset menu (or hide cards) when focused
        setIsFocused(false);  // Set focus state to false
        ResetMenu();
        setKeyPadOpen(false);       // Call ResetMenu when focused and pressed
      }
    }}
  >
      <View style={styless.column4}>
      <Ionicons    name='add-circle'   size={width * 0.07}   color={isFocused? 'white' : '#d1cfcf'} />
      </View>
      <View style={styless.column5}>
      <Text style={[styless.buttonText, { color: isFocused? 'white' : '#d1cfcf' }]}> Product</Text>
      </View>
  </TouchableOpacity>
<Divider style={styles.divider2} />
<TouchableOpacity   style={[styless.filterButton, { backgroundColor: keypadOpen? '#3682B3' : '#F6F6F6' }, { color: keypadOpen? 'white' : 'black' }]}
onPress= {() => {
expandBottomSheet()
setIsBottomOpened(true);
setKeyPadOpen(true);
//setShowCards(!showCards);
//setIsFocused(!isFocused);
setSelectedComponent('');
ResetMenu();
}}>
   <View style={styless.column4}>
       <Ionicons  name='keypad'   size={width * 0.07}  color={keypadOpen? 'white' : '#d1cfcf'}  />
   </View>
   <View style={styless.column5}>
   <Text style={[styless.buttonText, { color: keypadOpen? 'white' : '#d1cfcf' }]}> Code</Text>
   </View>
</TouchableOpacity>
</View>
