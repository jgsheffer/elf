import React, { useState, useEffect } from "react"
import { StyleSheet, View, TextInput, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "./GradientButton"
import { colors } from "../theme"
import { useNavigation } from "@react-navigation/native"
import { DatePicker } from "app/components/DatePicker"
import { api } from "../services/api"
import { LottieLoader } from "../components/LottieLoader"
import { useAuth } from "../contexts/AuthContext"
import { ChildProfile } from "app/apiResponseTypes"

export const CreateProfileForm = () => {
  const [loading, setLoading] = useState(false)
  const [childName, setChildName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(12)
  const [selectedDay, setSelectedDay] = useState(25)
  const [selectedYear, setSelectedYear] = useState(2024)

  const navigation = useNavigation()

  const { updateChildren } = useAuth();

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const constructedDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(
        selectedDay
      ).padStart(2, "0")}`
      setBirthdate(constructedDate)
    }
  }, [selectedYear, selectedMonth, selectedDay])

  const handleSubmit = async () => {
    if (childName && birthdate) {
      setLoading(true)
      try {
        let createdProfile : ChildProfile = await api.createChildProfile(childName, birthdate, "ENGLISH");
        const levelsObj = await api.getLevels(createdProfile.id);
        if(levelsObj?.data.getLevels.length === 0)
        {
          console.log("Child had no levels... resetting");
          await api.deleteChildProfile(createdProfile.id);
          createdProfile = await api.createChildProfile(childName, "2011-12-20", "ENGLISH");
        }

        await updateChildren([createdProfile]);

        navigation.navigate("CharacterCreation", { child: createdProfile })
      } catch (error) {
        console.error("Error creating profile:", error)
        Alert.alert("Error", "Failed to create profile. Please try again.")
      }
      finally
      {
        setLoading(false)
      }
    } else {
      Alert.alert("Oops!", "It looks like we're missing your child's name or birthday.")
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <LottieLoader visible={loading} />
      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.palette.black}
            value={childName}
            onChangeText={setChildName}
            autoCapitalize="words"
          />
        </LinearGradient>
      </LinearGradient>

      <DatePicker
      	yearsLength={18}
        onMonthChange={(month:number|undefined)=>setSelectedMonth(month)}
        onDayChange={(day:number|undefined)=>setSelectedDay(day)}
        onYearChange={(year:number|undefined)=>setSelectedYear(year)}
      />
      <GradientButton text="OK" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  gradientInput: {
    borderRadius: 20,
    padding: 3,
    width: "100%",
    marginBottom: 5,
    minHeight: 25,
  },
  innerGradient: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    width: "100%",
  },
  input: {
    fontSize: 16,
    color: colors.palette.black,
    width: "100%",
    fontFamily: "BowlbyOneSC-Regular",
    fontWeight: "bold",
    textAlign: "center",
  },
})