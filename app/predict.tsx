"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

export default function StudentPerformancePredictor() {
  const router = useRouter()
  const [studytime, setStudytime] = useState("")
  const [absences, setAbsences] = useState("")
  const [sleepHours, setSleepHours] = useState("")
  const [freetime, setFreetime] = useState("")
  const [Walc, setWalc] = useState("")
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = "http://192.168.0.102:8081/predict"
  const db = getFirestore()

  const handlePredict = async () => {
    if (!studytime || !absences || !sleepHours || !freetime || !Walc) {
      Alert.alert("Missing Information", "Please fill in all fields")
      return
    }

    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      Alert.alert("Authentication Error", "You must be logged in to make predictions")
      return
    }

    const data = {
      studytime: Number.parseInt(studytime, 10),
      absences: Number.parseInt(absences, 10),
      sleepHours: Number.parseInt(sleepHours, 10),
      freetime: Number.parseInt(freetime, 10),
      Walc: Number.parseInt(Walc, 10),
    }

    setLoading(true)
    setError(null)

    try {
      console.log("Sending to backend:", data)

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Prediction Result:", result)

      const predictionData = {
        status: `Grade: ${result.letter_grade} (${result.predicted_grade.toFixed(2)})`,
        recent: {
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          study: `${studytime} h`,
          attendance: `${absences} absences`,
          grade: result.letter_grade,
        },
        tip: getTipBasedOnPrediction(result),
        numeric: result.predicted_grade,
      }

      setPrediction(predictionData)

      // Save prediction data to Firestore with user UID
      await addDoc(collection(db, "predictions"), {
        ...data,
        predicted_grade: result.predicted_grade,
        letter_grade: result.letter_grade,
        tip: predictionData.tip,
        date: predictionData.recent.date,
        createdAt: new Date(),
        userId: user.uid, // Add the user ID to the document
      })
    } catch (err) {
      console.error("Prediction error:", err)
      setError(`Failed to get prediction: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getTipBasedOnPrediction = (result) => {
    const grade = result.predicted_grade

    const lowTips = [
      "📚 Attend more classes regularly.",
      "😴 Sleep at least 7-8 hours daily.",
      "❓ Ask questions when confused.",
      "🕒 Set fixed daily study hours.",
    ]

    const mediumTips = [
      "📝 Revise your notes every weekend.",
      "🤝 Join a study group for motivation.",
      "📈 Participate actively in discussions.",
      "📆 Plan your week with study targets.",
    ]

    const highTips = [
      "🏆 Challenge yourself with harder exercises!",
      "🤓 Try mentoring or helping classmates.",
      "🧠 Solve extra practice papers.",
      "🚀 Explore new subjects beyond the syllabus.",
    ]

    let tipsArray = []

    if (grade < 7) {
      tipsArray = lowTips
    } else if (grade < 12) {
      tipsArray = mediumTips
    } else {
      tipsArray = highTips
    }

    // Pick a random tip
    const randomTip = tipsArray[Math.floor(Math.random() * tipsArray.length)]
    return randomTip
  }

  const getGradeColor = () => {
    if (!prediction || !prediction.numeric) return "green"
    const grade = prediction.numeric
    if (grade >= 12) return "#2e7d32"
    if (grade >= 7) return "#ff9800"
    return "#d32f2f"
  }

  return (
    <LinearGradient colors={["#8E54E9", "#4776E6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <FontAwesome5 name="brain" size={60} color="black" />
          <Text style={styles.headerText}>Student Performance Prediction</Text>
          <Text style={styles.subHeader}>Ready to analyze your academic path?</Text>
        </View>

        {/* Prediction Card */}
        <View style={styles.predictionCard}>
          <View style={styles.predictionHeader}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="chart-bar" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.predictionTitle}>Average Grade</Text>
              <Text style={styles.predictionSubtitle}>Predicted Performance</Text>
              {prediction && (
                <Text style={[styles.predictionStatus, { color: getGradeColor() }]}>{prediction.status}</Text>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.inputGrid}>
          <TextInput
            style={styles.input}
            placeholder="📖 Study Hours (1-10)"
            value={studytime}
            onChangeText={setStudytime}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="🏫 Absences (0-93)"
            value={absences}
            onChangeText={setAbsences}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="🌙 Sleep Hours (4-10)"
            value={sleepHours}
            onChangeText={setSleepHours}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="😊 Free Time (1-5)"
            value={freetime}
            onChangeText={setFreetime}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { width: "100%" }]}
            placeholder="🍷 Alcohol Consumption (1-5)"
            value={Walc}
            onChangeText={setWalc}
            keyboardType="numeric"
          />
        </View>

        {/* Predict Button */}
        <TouchableOpacity style={styles.predictButton} onPress={handlePredict}>
          {loading ? (
            <ActivityIndicator color="#14532d" />
          ) : (
            <Text style={styles.predictButtonText}>🔮 Predict Now</Text>
          )}
        </TouchableOpacity>

        {/* Recent Predictions */}
        {prediction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Predictions</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {`${prediction.recent.date}  Study: ${prediction.recent.study}, Absences: ${prediction.recent.attendance}  Grade: ${prediction.recent.grade}`}
              </Text>
            </View>
          </View>
        )}

        {/* Tips for Improvement */}
        {prediction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips for Improvement</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{prediction.tip}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push("/analytics")} style={styles.bottomItem}>
          <Ionicons name="stats-chart" size={28} color="black" />
          <Text style={styles.bottomText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/history")} style={styles.bottomItem}>
          <Ionicons name="History" size={28} color="black" />
          <Text style={styles.bottomText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/setting")} style={styles.bottomItem}>
          <Ionicons name="settings-outline" size={28} color="black" />
          <Text style={styles.bottomText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "black", marginTop: 10 },
  subHeader: { fontSize: 16, color: "black", marginTop: 5 },
  predictionCard: { backgroundColor: "#f2f6ff", borderRadius: 16, padding: 16, width: "100%", marginBottom: 20 },
  predictionHeader: { flexDirection: "row", alignItems: "center" },
  iconContainer: { backgroundColor: "#3b82f6", padding: 10, borderRadius: 12, marginRight: 10 },
  predictionTitle: { fontSize: 18, fontWeight: "600" },
  predictionSubtitle: { fontSize: 14, color: "#666" },
  predictionStatus: { fontSize: 16, fontWeight: "500", marginTop: 4 },
  errorText: { fontSize: 14, color: "red", marginTop: 4 },
  inputGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 15,
    width: "48%",
    fontSize: 14,
  },
  predictButton: {
    backgroundColor: "#ccf5cc",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    minHeight: 50,
  },
  predictButtonText: { color: "#14532d", fontWeight: "600", fontSize: 20 },
  section: { width: "100%", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#fff" },
  infoBox: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#eee" },
  infoText: { fontSize: 18, color: "#333" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(98, 52, 223, 0.14)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomItem: { alignItems: "center", color: "black" },
  bottomText: { marginTop: 4, fontSize: 12, color: "black" },
})
