import Constants from 'expo-constants';
import * as Device from 'expo-device';

let API_URL = 'http://192.168.126.6:8000/api';
let UPLOAD_URL = 'http://192.168.126.6:8000/api/media/';

try {
  const isPhysicalDevice = Device.isDevice;

  if (isPhysicalDevice) {
    const expoExtra = Constants?.expoConfig?.extra;
    if (expoExtra?.API_URL) {
      API_URL = expoExtra.API_URL;
    }
    if (expoExtra?.UPLOAD_URL) {
      UPLOAD_URL = expoExtra.UPLOAD_URL;
    }
  }
} catch (error) {
  console.error('Error setting API constants:', error);
}

console.log('Using API URL:', API_URL);
console.log('Using UPLOAD URL:', UPLOAD_URL);

export { API_URL, UPLOAD_URL };
