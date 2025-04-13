import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';

export default function UserMediaScreen({ route, navigation }) {
  const { username } = route.params;
  const [mediaSections, setMediaSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserMedia = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/media/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const data = await response.json();
      const userMedia = data.filter((item) => item.uploaded_by === username);

      const grouped = userMedia.reduce((acc, item) => {
        const dateTime = new Date(item.uploaded_at).toLocaleString();
        if (!acc[dateTime]) acc[dateTime] = [];
        acc[dateTime].push(item);
        return acc;
      }, {});

      const sections = Object.entries(grouped).map(([title, data]) => ({
        title,
        data,
      }));

      setMediaSections(sections);
    } catch (error) {
      console.error('❌ Error loading user media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMedia();
  }, []);

  const renderItem = ({ item }) => {
    const isVideo = item.file_url?.endsWith('.mp4') || item.file_url?.endsWith('.mov');
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('FullScreenMediaScreen', {
            mediaUrl: item.file_url,
            isVideo,
          })
        }
        style={styles.mediaContainer}
      >
        {isVideo ? (
          <Video source={{ uri: item.file_url }} resizeMode="cover" style={styles.media} />
        ) : (
          <Image source={{ uri: item.file_url }} style={styles.media} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={styles.title}>{username}'s Media</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <SectionList
          sections={mediaSections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mediaContainer: { marginBottom: 15, alignItems: 'center' },
  media: { width: 200, height: 200, borderRadius: 10 },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#eee',
    padding: 5,
    marginTop: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
