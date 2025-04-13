import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UPLOAD_URL } from '../utils/constants';

export default function UploadScreen({ navigation }) {
  const [media, setMedia] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickMedia = async () => {
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access media library is required!'
        );
        return;
      }

      // Launch image picker with proper options
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Fixed: MediaTypeOptions instead of MediaType
        allowsEditing: false,
        quality: 1,
      });

      console.log('Image picker result:', result); // Add logging to debug

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Selected media:', result.assets[0]);
        setMedia(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media: ' + error.message);
    }
  };

  const getMimeType = (uri) => {
    const ext = uri.split('.').pop().toLowerCase();
    const types = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
    };
    return types[ext] || 'application/octet-stream';
  };

  const uploadMedia = async () => {
    if (!media) {
      Alert.alert('Please select a file to upload.');
      return;
    }

    setUploading(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again');
        setUploading(false);
        return;
      }

      const uri = Platform.OS === 'ios' ? media.uri.replace('file://', '') : media.uri;
      const fileName = media.fileName || uri.split('/').pop();
      const mimeType = getMimeType(uri);

      const formData = new FormData();
      formData.append('file', {
        uri: media.uri,
        name: fileName,
        type: mimeType,
      });

      const res = await fetch(`${UPLOAD_URL}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseText = await res.text();
      // console.log('Raw response:', responseText);

      try {
        const data = JSON.parse(responseText);

        if (res.ok) {
          Alert.alert('Success', 'Upload successful!', [
            { text: 'OK', onPress: () => navigation.navigate('Gallery') },
          ]);
          setMedia(null);
        } else {
          const errorMsg = data?.detail || data?.non_field_errors?.[0] || 'Upload failed. Please try again.';
          Alert.alert('Upload failed', errorMsg);
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        Alert.alert('Error', 'Unexpected server response');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Image or Video</Text>

      <TouchableOpacity 
        style={styles.pickButton} 
        onPress={pickMedia}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Pick File</Text>
      </TouchableOpacity>

      {media && (
        <View style={styles.preview}>
          {media.type?.startsWith('video') ? (
            <Video
              source={{ uri: media.uri }}
              useNativeControls
              resizeMode="contain"
              style={styles.media}
            />
          ) : (
            <Image source={{ uri: media.uri }} style={styles.media} />
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.disabledButton]}
        onPress={uploadMedia}
        disabled={uploading}
        activeOpacity={uploading ? 1 : 0.7}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  preview: {
    marginVertical: 15,
    alignItems: 'center',
  },
  media: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  pickButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
