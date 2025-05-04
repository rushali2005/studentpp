"use client"

import { useEffect, useState } from "react"
import { Text, Dimensions, ActivityIndicator, StyleSheet, ScrollView } from "react-native"
import { getFirestore, collection, query, getDocs, where } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { BarChart } from "react-native-chart-kit"
import { format } from "date-fns"
import { LinearGradient } from "expo-linear-gradient"

export default function AnalyticsPage() {
  const [studyHours, setStudyHours] = useState<number[]>([])
  const [absences, setAbsences] = useState<number[]>([])
  const [sleepHours, setSleepHours] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const screenWidth = Dimensions.get("window").width - 20

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      console.log("No user is signed in")
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const db = getFirestore()
      const predictionsRef = collection(db, "predictions")
      // Add where clause to filter by userId
      const q = query(predictionsRef, where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const tempStudy: number[] = []
      const tempAbsences: number[] = []
      const tempSleep: number[] = []
      const tempLabels: string[] = []

      querySnapshot.forEach((doc) => {
        const item = doc.data()
        if (!item.createdAt) return

        const createdAt = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt)
        const label = format(createdAt, "MM/dd")

        tempLabels.push(label)
        tempStudy.push(item.studytime || 0)
        tempAbsences.push(item.absences || 0)
        tempSleep.push(item.sleepHours || 0)
      })

      setLabels(tempLabels)
      setStudyHours(tempStudy)
      setAbsences(tempAbsences)
      setSleepHours(tempSleep)
    } catch (error) {
      console.error("Failed to fetch:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartConfig = {
    backgroundGradientFrom: "#1e1e2f",
    backgroundGradientTo: "#1e1e2f",
    fillShadowGradient: "#4CAF50",
    fillShadowGradientOpacity: 1,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#444",
    },
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#8E54E9", "#4776E6"]} style={StyleSheet.absoluteFill} />
      <Text style={styles.title}>📊 Performance Analytics</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <>
          {/* Study Hours vs Grades */}
          <Text style={styles.graphTitle}>📚 Study Hours</Text>
          <BarChart
            data={{
              labels: labels,
              datasets: [{ data: studyHours }],
            }}
            width={screenWidth}
            height={250}
            yAxisSuffix="h"
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={30}
          />

          {/* Number of Absences */}
          <Text style={styles.graphTitle}>🏫 Number of Absences</Text>
          <BarChart
            data={{
              labels: labels,
              datasets: [{ data: absences }],
            }}
            width={screenWidth}
            height={250}
            yAxisSuffix="x"
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={30}
          />

          {/* Sleep Hours */}
          <Text style={styles.graphTitle}>🌙 Sleep Hours</Text>
          <BarChart
            data={{
              labels: labels,
              datasets: [{ data: sleepHours }],
            }}
            width={screenWidth}
            height={250}
            yAxisSuffix="h"
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={30}
          />
        </>
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
  graphTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
})
