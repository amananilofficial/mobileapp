// EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen({ route, navigation }) {
  const { user, onProfileUpdated } = route.params;

  const [username, setUsername] = useState(user.username || '');
  const [fullName, setFullName] = useState(user.full_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
  const [imageError, setImageError] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // FIX: Strip `/api` if it's in the API_URL to point to correct media path
  const BASE_URL = API_URL.replace(/\/api\/?$/, '');

  // Format profile photo URL correctly
  const formatProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;

    // If already a full URL, return it
    if (photoPath.startsWith('http')) {
      return photoPath;
    }

    // Replace /api/media/ with /media/ in case API is returning wrong path
    const cleanedPath = photoPath.replace('/api/media/', '/media/');

    return `${BASE_URL}${cleanedPath}`;
  };

  const profileImageUri = profileImage || (user.profile_photo
    ? formatProfilePhotoUrl(user.profile_photo)
    : 'https://via.placeholder.com/100');

  useEffect(() => {
    console.log("Profile image URI:", profileImageUri);
  }, [profileImageUri]);

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        setImageError(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      // Create form data if we have a new profile image
      if (profileImage) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('full_name', fullName);
        formData.append('email', email);
        formData.append('phone_number', phoneNumber);

        // Get filename from URI
        const filename = profileImage.split('/').pop();
        // Infer the type of the image
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('profile_photo', {
          uri: profileImage,
          name: filename,
          type,
        });

        const response = await fetch(`${API_URL}/users/me/update/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Update error:', errorData);
          throw new Error('Update failed. Please check your input.');
        }
      } else {
        // If no new image, just update the text fields
        const response = await fetch(`${API_URL}/users/${user.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            full_name: fullName,
            email,
            phone_number: phoneNumber,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Update error:', errorData);
          throw new Error('Update failed. Please check your input.');
        }
      }

      Alert.alert('Success', 'Profile updated!');
      if (onProfileUpdated) onProfileUpdated();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: profileImageUri }}
          style={styles.image}
          onError={() => setImageError(true)}
        />
        <Text style={styles.changePhotoText}>Tap to change photo</Text>
      </TouchableOpacity>

      {imageError && (
        <Text style={styles.errorText}>
          Image could not be loaded. The media endpoint may be incorrect or the image doesn't exist.
        </Text>
      )}

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone"
        keyboardType="phone-pad"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    alignSelf: 'center',
  },
  changePhotoText: {
    textAlign: 'center',
    color: '#3498db',
    marginBottom: 15,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 12,
  },
});
