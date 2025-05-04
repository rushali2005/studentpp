import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, TextInput
} from 'react-native';
import { Link, useRouter } from "expo-router";
import { Fontisto, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => password.length >= 8;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const gradientValue = useSharedValue(0);
  gradientValue.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);

  const animatedGradient = useAnimatedStyle(() => ({
    opacity: gradientValue.value,
  }));

  const onRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        createdAt: new Date(),
        displayName: user.displayName || "Anonymous",
      });

      Alert.alert("Success", "Registered successfully.");
      router.replace('/login');
    } catch (error) {
      Alert.alert("Registration failed", error.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedGradient]}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9', '#4776E6', '#2F80ED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="brain" size={40} color="#fff" />
          </View>
          <Text style={styles.appName}>Student Performance Predictor</Text>
          <Text style={styles.tagline}>Analyze • Predict • Improve</Text>
        </View>

        <Text style={styles.title}>Register</Text>

        <View style={styles.inputBoxContainer}>
          <Fontisto name='email' size={24} color="#333" />
          <TextInput
            placeholder='Enter Your Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            style={styles.textInput}
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBoxContainer}>
          <MaterialIcons name='lock' size={24} color="#333" />
          <TextInput
            placeholder='Enter Password'
            value={password}
            onChangeText={setPassword}
            style={styles.textInput}
            secureTextEntry={!showPassword}
            placeholderTextColor="#666"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputBoxContainer}>
          <MaterialIcons name='lock' size={24} color="#333" />
          <TextInput
            placeholder='Confirm Password'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.textInput}
            secureTextEntry={!showPassword}
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <FontAwesome5 name="user-plus" size={20} color="#fff" />
            <Text style={styles.featureText}>Create Profile</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome5 name="cogs" size={20} color="#fff" />
            <Text style={styles.featureText}>Custom Settings</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome5 name="rocket" size={20} color="#fff" />
            <Text style={styles.featureText}>Start Predicting</Text>
          </View>
        </View>

        <View style={styles.linkContainer}>
          <Text style={styles.registerText}>Already have an account?</Text>
          <Link href={'/login'} style={styles.registerLink}>Login here</Link>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(71, 118, 230, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: 16,
    color: 'black',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputBoxContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  button: {
    backgroundColor: 'rgba(71, 118, 230, 0.9)',
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: '#black',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(71, 118, 230, 0.3)',
    padding: 10,
    borderRadius: 10,
    width: '30%',
  },
  featureText: {
    color: 'black',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: 'black',
    fontSize: 16,
    marginRight: 5,
  },
  registerLink: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  linkText: {
    color: 'black',
    textAlign: 'right',
    alignSelf: 'flex-end',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 10,
  },
});


export default Register;
