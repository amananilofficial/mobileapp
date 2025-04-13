import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export default function FullScreenMediaScreen({ route, navigation }) {
  const { mediaUrl, isVideo } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close-circle" size={36} color="#fff" />
      </TouchableOpacity>

      {isVideo ? (
        <Video
          source={{ uri: mediaUrl }}
          useNativeControls
          resizeMode="contain"
          shouldPlay
          style={styles.media}
        />
      ) : (
        <Image
          source={{ uri: mediaUrl }}
          style={styles.media}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
