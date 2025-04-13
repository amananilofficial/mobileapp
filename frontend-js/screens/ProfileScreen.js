import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import { API_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    navigation.navigate('EditProfile', {
      user,
      onProfileUpdated: fetchProfile,
    });
  };

  const handlePasswordReset = () => {
    navigation.navigate('ResetPassword');
  };

  const formatProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;

    // If already a full URL, return it
    if (photoPath.startsWith('http')) {
      return photoPath;
    }

    // Replace /api/media/ with /media/ in case API is returning wrong path
    const cleanedPath = photoPath.replace('/api/media/', '/media/');

    return `${API_URL.replace(/\/$/, '')}${cleanedPath}`;
  };

  const profileImageUri = formatProfilePhotoUrl(user?.profile_photo);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: profileImageUri || 'https://via.placeholder.com/100',
        }}
        style={styles.image}
      />

      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{user.username}</Text>

      <Text style={styles.label}>Full Name:</Text>
      <Text style={styles.value}>{user.full_name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{user.phone_number || 'Not provided'}</Text>

      <View style={styles.buttonRow}>
        <Button title="Edit Profile" onPress={handleEdit} />
        <Button title="Reset Password" onPress={handlePasswordReset} />
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  value: { fontSize: 16, marginBottom: 15 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 20 },
  buttonRow: { marginTop: 30, gap: 10 },
});
