// helpers/permissionHelper.js

import { PermissionsAndroid, Platform } from 'react-native';

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera to scan barcodes.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED ? 'authorized' : 'denied';
  } else {
    // iOS permission logic can be added here
    return 'authorized'; // Assuming it's authorized for the example
  }
};
