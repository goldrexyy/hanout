import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import JsBarcode from 'jsbarcode';

const BarcodeGenerator = ({ value, format }) => {
  const [barcodeUri, setBarcodeUri] = useState(null);

  useEffect(() => {
    // Create a canvas element to generate barcode
    const canvas = document.createElement('canvas');

    JsBarcode(canvas, value, {
      format: format, // e.g., 'EAN13'
      width: 2,
      height: 100,
      displayValue: true,
    });

    // Convert the canvas to a base64 image and set it as the barcodeUri
    const uri = canvas.toDataURL('image/png');
    setBarcodeUri(uri);
  }, [value, format]);

  return (
    <View style={styles.container}>
      {barcodeUri && (
        <Image
          source={{ uri: barcodeUri }}
          style={styles.barcodeImage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  barcodeImage: {
    width: 200, // Adjust width as needed
    height: 100, // Adjust height as needed
  },
});

export default BarcodeGenerator;
