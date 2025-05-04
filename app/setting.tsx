import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from "expo-router";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tipsFrequency, setTipsFrequency] = useState('daily');
  const [studyGoal, setStudyGoal] = useState('');
 const router = useRouter();

  const dailyTips = [
    "Tip 1: Take regular breaks to improve focus.",
    "Tip 2: Stay hydrated during study sessions.",
    "Tip 3: Set small, achievable study goals."
  ];

  const weeklyTips = [
    "Tip 1: Plan your week ahead for better productivity.",
    "Tip 2: Review all the material you've studied so far.",
    "Tip 3: Reflect on your progress and adjust your goals."
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const settings = {
        isDarkMode,
        tipsFrequency,
        studyGoal,
      };
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
      Alert.alert('Settings Saved', 'Your preferences have been saved!');
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings !== null) {
        const parsedSettings = JSON.parse(savedSettings);
        setIsDarkMode(parsedSettings.isDarkMode);
        setTipsFrequency(parsedSettings.tipsFrequency);
        setStudyGoal(parsedSettings.studyGoal);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const resetSettings = async () => {
    setIsDarkMode(false);
    setTipsFrequency('daily');
    setStudyGoal('');
    await AsyncStorage.removeItem('userSettings');
    Alert.alert('Settings Reset', 'All settings have been restored to default.');
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear(); 
      Alert.alert('Logged Out', 'You have been logged out.');
      router.replace('/login'); 
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <LinearGradient colors={['#8E54E9', '#4776E6']} style={StyleSheet.absoluteFill} />

      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.label}>🌗 Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#4CAF50' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>📝 Tips Frequency</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.optionButton, tipsFrequency === 'daily' && styles.selectedButton]}
            onPress={() => setTipsFrequency('daily')}
          >
            <Text style={styles.buttonText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, tipsFrequency === 'weekly' && styles.selectedButton]}
            onPress={() => setTipsFrequency('weekly')}
          >
            <Text style={styles.buttonText}>Weekly</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipTitle}>Tips:</Text>
          {tipsFrequency === 'daily' ? (
            dailyTips.map((tip, index) => (
              <Text key={index} style={styles.tipText}>
                {tip}
              </Text>
            ))
          ) : (
            weeklyTips.map((tip, index) => (
              <Text key={index} style={styles.tipText}>
                {tip}
              </Text>
            ))
          )}
        </View>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>🎯 Study Goal (hours/week)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of hours"
          keyboardType="numeric"
          value={studyGoal}
          onChangeText={setStudyGoal}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>💾 Save Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
        <Text style={styles.resetButtonText}>♻️ Reset Settings</Text>
      </TouchableOpacity>

      {/* New Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 50,
    alignItems: 'center',
    minHeight: '100%',
  },
  darkContainer: {
    backgroundColor: '#1e1e2f',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ff4d4d',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#5555ff',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipsContainer: {
    marginTop: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 14,
    marginVertical: 5,
  },
});
