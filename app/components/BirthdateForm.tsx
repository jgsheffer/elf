import React, { useState } from "react"
import { View, Text, StyleSheet, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../theme"
import { GradientButton } from "app/components/GradientButton"
import { DatePicker } from "./DatePicker"
export const BirthdateForm = ({ yearsLength=100 }) => {
  const navigation = useNavigation()
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>()
  const [selectedDay, setSelectedDay] = useState<number | undefined>()
  const [selectedYear, setSelectedYear] = useState<number | undefined>()

  const handleSubmit = () => {
    if (selectedMonth && selectedDay && selectedYear) {
      const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay)
      const currentDate = new Date()
      let age = currentDate.getFullYear() - birthDate.getFullYear()
      const monthDiff = currentDate.getMonth() - birthDate.getMonth()
      const dayDiff = currentDate.getDate() - birthDate.getDate()

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--
      }

      if (age >= 18) {
        const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(
          selectedDay,
        ).padStart(2, "0")}`
        navigation.navigate("CreateAccount", { dateOfBirth: formattedDate })
      } else {
        Alert.alert("", "You must be a parent to create an account.")
      }
    } else {
      Alert.alert("Error", "Please select a valid birthdate.")
    }
  }

  return (
    <View style={styles.container}>
      <DatePicker
        yearsLength={yearsLength}
        onMonthChange={(month: number | undefined) => setSelectedMonth(month)}
        onDayChange={(day: number | undefined) => setSelectedDay(day)}
        onYearChange={(year: number | undefined) => setSelectedYear(year)}
        defaultMonth={selectedMonth}
        defaultDay={selectedDay}
        defaultYear={selectedYear}
      />
      <View style={styles.buttonContainer}>
        <GradientButton text="OK" onPress={handleSubmit} />
      </View>
      <Text style={styles.info}>
        To keep everything safe and secure, we need your permission to create an account for your
        child. You’ll receive an email to confirm this process. Please check your inbox to verify
        and give consent for your child to use our services.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  buttonContainer: {},
  info: {
    fontSize: 16,
    color: colors.palette.black,
    textAlign: "center",
    marginTop: 10,
  },
})
