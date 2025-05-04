"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native"
import { getFirestore, collection, query, getDocs, deleteDoc, doc, where } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { format } from "date-fns"
import { LinearGradient } from "expo-linear-gradient"

export default function PredictionHistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        console.log("No user is signed in")
        setLoading(false)
        return
      }

      const db = getFirestore()
      const predictionsRef = collection(db, "predictions")
      // Add where clause to filter by userId
      const q = query(predictionsRef, where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const tempHistory: any[] = []

      querySnapshot.forEach((doc) => {
        const item = doc.data()
        const createdAt = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt)

        tempHistory.push({
          id: doc.id,
          date: format(createdAt, "MMM dd, yyyy"),
          studytime: item.studytime,
          absences: item.absences,
          sleepHours: item.sleepHours,
          predicted_grade: item.predicted_grade,
          letter_grade: item.letter_grade,
        })
      })

      tempHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by latest first

      setHistory(tempHistory)
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Prediction",
      "Are you sure you want to delete this prediction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const db = getFirestore()
              const predictionDocRef = doc(db, "predictions", id)
              await deleteDoc(predictionDocRef)
              setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id))
              Alert.alert("Prediction Deleted", "The prediction has been successfully deleted.")
            } catch (error) {
              console.error("Error deleting prediction:", error)
              Alert.alert("Error", "Failed to delete prediction. Please try again.")
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#8E54E9", "#4776E6"]} style={StyleSheet.absoluteFill} />
      <Text style={styles.title}>📜 Prediction History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.info}>📖 Study Time: {item.studytime} hrs</Text>
            <Text style={styles.info}>🏫 Absences: {item.absences}</Text>
            <Text style={styles.info}>🌙 Sleep Hours: {item.sleepHours}</Text>
            <Text style={styles.info}>
              🎯 Predicted Grade: {item.predicted_grade.toFixed(2)} ({item.letter_grade})
            </Text>

            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 50,
    alignItems: "center",
    backgroundColor: "#1e1e2f",
    minHeight: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "90%",
    marginBottom: 15,
    elevation: 4,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
