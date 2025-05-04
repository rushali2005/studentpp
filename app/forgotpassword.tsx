import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient';
import {  FontAwesome5 } from '@expo/vector-icons';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (email === "") {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Success", "Password reset link has been sent to your email.");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#4776E6', '#8E54E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <FontAwesome5 name="brain" size={40} color="#fff" />
                    </View>
                    <Text style={styles.appName}>Student Performance Predictor</Text>
                    <Text style={styles.tagline}>Analyze • Predict • Improve</Text>
                </View>
                <Text style={styles.title}>Forgot Password</Text>

                <TextInput
                    placeholder="Enter your registered email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    placeholderTextColor="#666"
                />

                <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
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
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        fontSize: 16,
        color: "#333",
    },
    button: {
        backgroundColor: '#4776E6',
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 25,
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
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ForgotPassword;
