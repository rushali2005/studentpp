import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const [userData, setUserData] = useState({ displayName: '', email: '' });
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setName(data.displayName);
        }
      } catch (err) {
        Alert.alert("Error", "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { displayName: name });
      Alert.alert("Success", "Profile updated.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4F46E5" />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E54E9', '#4776E6']} style={StyleSheet.absoluteFill} />
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <FontAwesome5 name="user" size={40} color="#fff" />
        </View>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          placeholderTextColor="#666"
        />
        <Text style={styles.email}>{userData.email}</Text>
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} disabled={saving}>
          <Text style={styles.updateText}>{saving ? 'Saving...' : 'Update'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileCard: {
    marginTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
  },
  avatarCircle: {
    backgroundColor: '#4F46E5',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
  },
  updateBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
  },
});
