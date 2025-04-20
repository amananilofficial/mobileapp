import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { API_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  // Update the passwords state to remove currentPassword
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/users/${userId}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await fetch(`${API_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await AsyncStorage.clear();
      Alert.alert('Logged out');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch {
      await AsyncStorage.clear();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  const handleEdit = () => {
    setEditedUser({
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number || '',
    });
    setEditModalVisible(true);
  };

  const handlePasswordReset = () => {
    setResetPasswordModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/users/${user.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      await fetchProfile();
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleResetPassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/users/password/change/`, {  // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          new_password: passwords.newPassword,
          re_new_password: passwords.confirmPassword,  // Added confirmation password
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to change password');
      }
  
      setResetPasswordModalVisible(false);
      setPasswords({ newPassword: '', confirmPassword: '' });
      Alert.alert('Success', 'Password updated successfully');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Update the Reset Password Modal JSX
  <Modal visible={resetPasswordModalVisible} animationType="slide" transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Reset Password</Text>

        <TextInput
          style={styles.input}
          value={passwords.newPassword}
          onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
          placeholder="New Password"
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          value={passwords.confirmPassword}
          onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
          placeholder="Confirm New Password"
          secureTextEntry
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => {
              setResetPasswordModalVisible(false);
              setPasswords({ newPassword: '', confirmPassword: '' });
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleResetPassword}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>

  // Update the formatProfilePhotoUrl function
  const formatProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;

    // If already a full URL, return it
    if (photoPath.startsWith('http')) {
      return photoPath;
    }

    // Ensure we have a clean path without double slashes
    const baseUrl = API_URL.replace(/\/+$/, ''); // Remove trailing slashes
    const cleanPath = photoPath.replace(/^\/+/, ''); // Remove leading slashes

    // Construct the full URL
    return `${baseUrl}/${cleanPath}`;
  };

  // Add image picker functionality for profile photo
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const formData = new FormData();
        formData.append('profile_photo', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile_photo.jpg',
        });

        const token = await AsyncStorage.getItem('authToken');
        const res = await fetch(`${API_URL}/users/${user.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to update profile photo');
        await fetchProfile(); // Refresh profile data
        Alert.alert('Success', 'Profile photo updated successfully');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile photo');
      console.error(err);
    }
  };

  // Update the profile image section in the return statement
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handlePickImage}>
            <Image
              source={{
                uri: formatProfilePhotoUrl(user?.profile_photo) || 'https://via.placeholder.com/100',
              }}
              style={styles.profileImage}
            />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.full_name || 'Loading...'}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{user?.username || 'Loading...'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email || 'Loading...'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{user?.phone_number || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleEdit}
            disabled={!user}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handlePasswordReset}
            disabled={!user}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal visible={editModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <TextInput
                style={styles.input}
                value={editedUser.full_name}
                onChangeText={(text) => setEditedUser({ ...editedUser, full_name: text })}
                placeholder="Full Name"
              />

              <TextInput
                style={styles.input}
                value={editedUser.username}
                onChangeText={(text) => setEditedUser({ ...editedUser, username: text })}
                placeholder="Username"
              />

              <TextInput
                style={styles.input}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                placeholder="Email"
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                value={editedUser.phone_number}
                onChangeText={(text) => setEditedUser({ ...editedUser, phone_number: text })}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateProfile}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Reset Password Modal */}
        <Modal visible={resetPasswordModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reset Password</Text>

              <TextInput
                style={styles.input}
                value={passwords.newPassword}
                onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
                placeholder="New Password"
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                value={passwords.confirmPassword}
                onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
                placeholder="Confirm New Password"
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setResetPasswordModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleResetPassword}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 5,
  },
  changePhotoText: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  infoItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  buttonSection: {
    padding: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  logoutText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
});
