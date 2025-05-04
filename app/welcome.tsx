import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#8E54E9', '#4776E6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/brain.png')} // Replace with your brain icon
          style={styles.logo}
        />
        <Text style={styles.title}>Student Performance Predictor</Text>
        <Text style={styles.tagline}>Analyze • Predict • Improve</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#eee',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 60,
    elevation: 4,
  },
  buttonText: {
    color: '#4776E6',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
