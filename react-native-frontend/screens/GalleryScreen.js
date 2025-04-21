import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  TextInput, ScrollView, Image, Modal, FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../utils/constants';
import * as FileSystem from 'expo-file-system'; // Add this import

export default function GalleryScreen({ navigation }) {
  // Remove statistics state
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [batchTitle, setBatchTitle] = useState('');
  const [error, setError] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const uploadBatch = async () => {
    if (!batchTitle.trim()) {
      setError('Please enter a batch title');
      return;
    }

    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/batches/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: batchTitle
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Batch created successfully!');
        setBatchTitle('');
        fetchBatches(); // Refresh the list after upload
      } else {
        throw new Error(result.detail || 'Failed to create batch');
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Failed to create batch: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Update fetchBatches function endpoint
  const fetchBatches = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/batches/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      console.log('Fetched batches:', data); // Debug log
      setBatches(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setLoading(false);
    }
  };

  // Add refresh function
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
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        alert('Permission to access camera and media library is required!');
        return;
      }

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

  // Add new function for camera capture
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages(prev => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Failed to take photo');
    }
  };

  const handleDeleteImage = async (imageId) => {

    try {
      const token = await AsyncStorage.getItem('authToken');
      // Updated endpoint to match Django's URL pattern
      const response = await fetch(`${API_URL}/media/${imageId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        // Refresh the selected batch data
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
        method: 'GET',
        headers: { 
          'Authorization': `Token ${token}`,
          'Accept': 'application/pdf',
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onload = async () => {
          try {
            const base64data = reader.result.split(',')[1];
            const fileUri = `${FileSystem.documentDirectory}batch_${batchId}.pdf`;
            
            await FileSystem.writeAsStringAsync(fileUri, base64data, {
              encoding: FileSystem.EncodingType.Base64
            });
            
            const { shareAsync } = await import('expo-sharing');
            await shareAsync(fileUri, {
              mimeType: 'application/pdf',
              UTI: 'com.adobe.pdf',
              dialogTitle: 'View PDF Report'
            });
          } catch (error) {
            console.error('Error saving PDF:', error);
            alert('Error saving PDF file');
          }
        };
  
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          alert('Error reading PDF file');
        };
  
        reader.readAsDataURL(blob);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to export PDF: ${errorText}`);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF: ' + error.message);
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
  // Add new function for uploading additional images
  const uploadAdditionalImages = async () => {
    if (!selectedBatch) return;

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      selectedImages.forEach(image => {
        const imageUri = image.uri;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('images', {
          uri: imageUri,
          name: filename,
          type
        });
      });

      const response = await fetch(`${API_URL}/batches/${selectedBatch.id}/images/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          // Remove Content-Type header to let fetch set it automatically
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
        console.error('Upload error:', errorData);
        throw new Error('Failed to upload additional images');
      }
    } catch (error) {
      console.error('Error uploading additional images:', error);
      alert('Failed to upload additional images: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Batch Upload</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Statistics Display removed */}

      <TextInput
        style={styles.input}
        placeholder="Enter batch title"
        value={batchTitle}
        onChangeText={setBatchTitle}
      />

      {/* Removed the Select Images button */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, styles.uploadButton]}
        onPress={uploadBatch}
        disabled={uploading || !batchTitle.trim()}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="cloud-upload" size={24} color="#fff" />
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
              <Ionicons name="images" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, styles.cameraButton]}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color="#fff" />
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
                  <Ionicons name="cloud-upload" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.footerButton, styles.exportButton]}
              onPress={() => handleExportPDF(selectedBatch?.id)}
            >
              <Ionicons name="document" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, styles.deleteButton]}
              onPress={() => handleDeleteBatch(selectedBatch?.id)}
            >
              <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Add these new styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#34C759',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  previewImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
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
  // Add these new styles in the StyleSheet
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
  // Remove these statistics-related styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cameraButton: {
    backgroundColor: '#5856D6',
    padding: 10,
    borderRadius: 5,
    minWidth: 50, // Added minimum width
    alignItems: 'center',
  },
});