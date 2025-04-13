import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../utils/constants';

const BASE_URL = API_URL.replace('/api', '');

export default function GalleryScreen({ navigation }) {
  const [groupedMedia, setGroupedMedia] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMedia = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userRole = await AsyncStorage.getItem('userRole');
      const isAdminUser = userRole === 'admin';
      setIsAdmin(isAdminUser);

      const response = await fetch(`${API_URL}/media/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const data = await response.json();
      groupMedia(data);
    } catch (err) {
      console.error('❌ Error loading media:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace('/api/media/', '/media/');
    if (!cleanPath.startsWith('/media/')) {
      cleanPath = `/media/${cleanPath.split('/').pop()}`;
    }
    return `${BASE_URL}${cleanPath}`;
  };

  const groupMedia = (items) => {
    const grouped = {};

    items.forEach((item) => {
      const username = item.uploaded_by;
      const date = new Date(item.uploaded_at).toLocaleDateString();
      const time = new Date(item.uploaded_at).toLocaleTimeString();

      if (!grouped[username]) grouped[username] = {};
      if (!grouped[username][date]) grouped[username][date] = {};
      if (!grouped[username][date][time]) grouped[username][date][time] = [];

      grouped[username][date][time].push(item);
    });

    const sections = [];

    for (const username in grouped) {
      for (const date in grouped[username]) {
        for (const time in grouped[username][date]) {
          sections.push({
            title: `${username} - ${date} - ${time}`,
            data: grouped[username][date][time],
          });
        }
      }
    }

    // Sort newest first
    sections.sort((a, b) => new Date(b.data[0].uploaded_at) - new Date(a.data[0].uploaded_at));

    setGroupedMedia(sections);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMedia();
  };

  const renderItem = ({ item }) => {
    const mediaUrl = formatMediaUrl(item.file_url);
    const isVideo = mediaUrl?.endsWith('.mp4') || mediaUrl?.endsWith('.mov');

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FullScreenMediaScreen', { mediaUrl, isVideo })}
        style={styles.mediaContainer}
      >
        {isVideo ? (
          <Video source={{ uri: mediaUrl }} resizeMode="cover" style={styles.media} />
        ) : (
          <Image source={{ uri: mediaUrl }} style={styles.media} />
        )}
        <Text style={styles.caption}>{item.caption || 'Media'}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>📷 Gallery</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <SectionList
          sections={groupedMedia}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  media: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  caption: {
    marginTop: 5,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  topTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
