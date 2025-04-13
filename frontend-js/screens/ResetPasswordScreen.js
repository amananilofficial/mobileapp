// ResetPasswordScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';

export default function ResetPasswordScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleResetPassword = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${API_URL}/auth/password/change/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Password reset failed');
            }

            Alert.alert('Password changed successfully');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} secureTextEntry placeholder="Current Password" value={oldPassword} onChangeText={setOldPassword} />
            <TextInput style={styles.input} secureTextEntry placeholder="New Password" value={newPassword} onChangeText={setNewPassword} />
            <Button title="Change Password" onPress={handleResetPassword} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: {
        borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5,
    },
});
