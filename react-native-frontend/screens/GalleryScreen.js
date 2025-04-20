import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  TextInput, ScrollView, Image, Modal, FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../utils/constants';
import { Platform } from 'react-native';

export default function GalleryScreen({ navigation }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [batchTitle, setBatchTitle] = useState('');
  const [error, setError] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take photos!');
      }
    })();
  }, []);

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 20,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        if (result.assets.length > 20) {
          setError('Please select up to 20 images');
          return;
        }
        setSelectedImages(result.assets);
        setError('');
      }
    } catch (error) {
      console.error('Error picking images:', error);
      alert('Error selecting images');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take photos!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => ({
          ...asset,
          uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', '')
        }));
        setSelectedImages(prev => [...prev, ...newImages]);
        setError('');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Error taking photo');
    }
  };

  const uploadBatch = async () => {
    if (!batchTitle.trim()) {
      setError('Please enter a batch title');
      return;
    }

    if (selectedImages.length === 0) {
      setError('Please select at least one image');
      return;
    }

    if (selectedImages.length > 20) {
      setError('Please select up to 20 images');
      return;
    }

    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('title', batchTitle);

      // Properly append each image to FormData
      selectedImages.forEach((image, index) => {
        const uri = Platform.OS === 'android' ? image.uri : image.uri.replace('file://', '');
        const filename = image.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('files', {
          uri: uri,
          name: `image_${index}.${match ? match[1] : 'jpg'}`,
          type: type
        });
      });

      const response = await fetch(`${API_URL}/batches/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      alert('Batch uploaded successfully!\nReferral ID: ' + result.referral_id);
      setSelectedImages([]);
      setBatchTitle('');
      fetchBatches();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/batches/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      setBatches(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchBatches();
  };

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setModalVisible(true);
  };

  const handleAddMoreImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages(result.assets);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      alert('Failed to select images');
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/media/${imageId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        if (selectedBatch) {
          const updatedBatch = {
            ...selectedBatch,
            images: selectedBatch.images.filter(img => img.id !== imageId)
          };
          setSelectedBatch(updatedBatch);
        }
        fetchBatches();
        alert('Image deleted successfully!');
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image: ' + error.message);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/batches/${batchId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        fetchBatches();
        setModalVisible(false);
        alert('Batch deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Failed to delete batch');
    }
  };

  const handleExportPDF = async (batchId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/batches/${batchId}/export-pdf/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        alert('PDF exported successfully!');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const renderBatchItem = ({ item, index }) => (
    <View style={styles.batchRow}>
      <Text style={styles.serialNumber}>{index + 1}</Text>
      <View style={styles.batchInfo}>
        <Text style={styles.referralId}>ID: {item.referral_id}</Text>
        <Text style={styles.batchTitle}>Title: {item.title}</Text>
        <Text style={styles.imageCount}>Images: {item.images?.length || 0}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleViewBatch(item)}>
          <Ionicons name="eye" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const uploadAdditionalImages = async () => {
    if (!selectedBatch) return;

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      selectedImages.forEach((image, index) => {
        const uri = Platform.OS === 'android' ? image.uri : image.uri.replace('file://', '');
        const filename = image.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('images', {
          uri: uri,
          name: `image_${index}.${match ? match[1] : 'jpg'}`,
          type: type
        });
      });

      const response = await fetch(`${API_URL}/batches/${selectedBatch.id}/images/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        alert('Additional images uploaded successfully!');
        setSelectedImages([]);
        fetchBatches();
        setModalVisible(false);
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to upload additional images');
      }
    } catch (error) {
      console.error('Error uploading additional images:', error);
      alert('Failed to upload additional images: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const takeMultiplePhotos = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take photos!');
        return;
      }

      let continueCapturing = true;
      let photoCount = selectedImages.length;

      while (continueCapturing && photoCount < 20) {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.canceled && result.assets) {
          const newImages = result.assets.map(asset => ({
            ...asset,
            uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', '')
          }));

          setSelectedImages(prev => [...prev, ...newImages]);
          photoCount += newImages.length;

          if (photoCount < 20) {
            continueCapturing = window.confirm(`Photo ${photoCount}/20 added. Take another photo?`);
          } else {
            alert('Maximum 20 photos reached.');
            continueCapturing = false;
          }
        } else {
          continueCapturing = false;
        }
      }

      setError('');
    } catch (error) {
      console.error('Error taking photos:', error);
      alert('Error taking photos');
    }
  };

  const showSelectedImagesPreview = () => {
    if (selectedImages.length === 0) return null;

    return (
      <View style={styles.previewScrollContainer}>
        <Text style={styles.previewText}>Selected images ({selectedImages.length}/20):</Text>
        <ScrollView horizontal style={styles.previewContainer}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.previewImageContainer}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  const newImages = [...selectedImages];
                  newImages.splice(index, 1);
                  setSelectedImages(newImages);
                }}
              >
                <Ionicons name="close-circle" size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Batch Upload (20 Images)</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter batch title"
        value={batchTitle}
        onChangeText={setBatchTitle}
      />

      {showSelectedImagesPreview()}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton, { flex: 1, marginRight: 5 }]}
          onPress={takePhoto}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cameraButton, { flex: 1, marginLeft: 5 }]}
          onPress={takeMultiplePhotos}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>Take Multiple</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={pickImages}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>Select Images (Up to 20)</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, styles.uploadButton]}
        onPress={uploadBatch}
        disabled={uploading || selectedImages.length === 0 || !batchTitle.trim()}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Batch</Text>
        )}
      </TouchableOpacity>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Uploaded Batches</Text>
        <FlatList
          data={batches}
          renderItem={renderBatchItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Batch: {selectedBatch?.referral_id}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.imageGrid}>
              {selectedBatch?.images?.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image.url }} style={styles.batchImage} />
                  <TouchableOpacity
                    style={styles.deleteImageButton}
                    onPress={() => handleDeleteImage(image.id)}
                  >
                    <Ionicons name="trash" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.addButton]}
              onPress={handleAddMoreImages}
            >
              <Text style={styles.buttonText}>Add Images</Text>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
              <TouchableOpacity
                style={[styles.footerButton, styles.uploadButton]}
                onPress={uploadAdditionalImages}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Upload New Images</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.footerButton, styles.exportButton]}
              onPress={() => handleExportPDF(selectedBatch?.id)}
            >
              <Text style={styles.buttonText}>Export PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, styles.deleteButton]}
              onPress={() => handleDeleteBatch(selectedBatch?.id)}
            >
              <Text style={styles.buttonText}>Delete Batch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cameraButton: {
    backgroundColor: '#5856D6',
  },
  uploadButton: {
    backgroundColor: '#34C759',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewScrollContainer: {
    marginBottom: 15,
  },
  previewText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  previewContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  previewImageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  serialNumber: {
    width: 40,
    fontWeight: 'bold',
  },
  batchInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  batchTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  imageCount: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  referralId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    width: 40,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    position: 'relative',
  },
  batchImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#34C759',
  },
  exportButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});