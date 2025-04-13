import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, Image, StyleSheet,
  Alert, ActivityIndicator, FlatList, TouchableOpacity, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAdminStatus();
      await fetchUsers();
      setLoading(false);
    };
    init();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return navigation.navigate('Login');

      const res = await fetch(`${API_URL}/users/me/`, {
        headers: { Authorization: `Token ${token}` }
      });

      const userData = await res.json();
      if (!userData.is_admin) {
        Alert.alert('Access Denied', 'Only administrators can access this screen');
        navigation.goBack();
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Unable to verify admin status');
    }
  };

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const res = await fetch(`${API_URL}/users/`, {
      headers: { Authorization: `Token ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const getMimeType = (uri) => {
    const ext = uri.split('.').pop().toLowerCase();
    return ext === 'png' ? 'image/png' : 'image/jpeg';
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const resetForm = () => {
    setSelectedUserId(null);
    setUsername('');
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setPhoto(null);
    setIsAdmin(false);
  };

  const handleSubmit = async () => {
    const isUpdating = !!selectedUserId;
    const endpoint = isUpdating
      ? `${API_URL}/users/${selectedUserId}/`
      : `${API_URL}/users/`;
    const method = isUpdating ? 'PUT' : 'POST';

    if (!username || !fullName || !email || (!isUpdating && !password)) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('is_admin', isAdmin ? 'true' : 'false');
    if (password) formData.append('password', password);
    if (phone) formData.append('phone_number', phone);

    if (photo) {
      const uri = Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri;
      const fileName = photo.fileName || uri.split('/').pop();
      const mimeType = getMimeType(uri);

      formData.append('profile_photo', {
        uri: photo.uri,
        name: fileName,
        type: mimeType,
      });
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', `User ${isUpdating ? 'updated' : 'created'} successfully!`);
        resetForm();
        fetchUsers();
      } else {
        const errorMessages = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('\n');
        Alert.alert('Error', `Failed to ${isUpdating ? 'update' : 'create'} user:\n${errorMessages}`);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', `Something went wrong`);
    }
  };

  const selectUserForEdit = (user) => {
    setSelectedUserId(user.id);
    setUsername(user.username);
    setFullName(user.full_name);
    setEmail(user.email);
    setPhone(user.phone_number || '');
    setIsAdmin(user.is_admin);
    setPhoto(user.profile_photo ? { uri: user.profile_photo } : null);
    setPassword('');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedUserId ? 'Update User' : 'Create New User'}
      </Text>

      <TextInput placeholder="Username *" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Full Name *" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput placeholder="Email *" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder={selectedUserId ? "New Password (requied)" : "Password *"} value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <View style={styles.checkboxContainer}>
        <Button title={isAdmin ? "Admin: Yes" : "Admin: No"} onPress={() => setIsAdmin(!isAdmin)} color={isAdmin ? "#007bff" : "#6c757d"} />
      </View>

      <Button title="Pick Profile Photo" onPress={pickImage} />
      {photo && <Image source={{ uri: photo.uri }} style={styles.profilePhoto} />}

      <View style={styles.buttonContainer}>
        <Button title={selectedUserId ? "Update User" : "Create User"} onPress={handleSubmit} />
        {selectedUserId && <Button title="Cancel Edit" onPress={resetForm} color="red" />}
      </View>

      <Text style={[styles.title, { marginTop: 20 }]}>All Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectUserForEdit(item)} style={styles.userItem}>
            <Text>{item.full_name} ({item.username}) {item.is_admin ? '🛡️' : ''}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', padding: 10, marginBottom: 15, borderRadius: 5 },
  checkboxContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  profilePhoto: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 10, marginBottom: 15 },
  buttonContainer: { marginTop: 10, gap: 10 },
  userItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }
});
