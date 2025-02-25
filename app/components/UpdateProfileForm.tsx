import React, { useState, useEffect } from "react"
import { View, StyleSheet, TextInput, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "./GradientButton"
import { DatePicker } from "app/components/DatePicker"
import { colors } from "../theme"
import { useNavigation } from "@react-navigation/native"
import { api } from "../services/api"
import { LottieLoader } from "./LottieLoader"
import { useAuth } from "../contexts/AuthContext"
import { ChildProfile } from "app/apiResponseTypes"

interface UpdateProfileFormProps {
  child: ChildProfile;
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  child
}) => {
  const [loading, setLoading] = useState(false)
  const [childName, setChildName] = useState(child?.firstname || "")
  const [birthdate, setBirthdate] = useState(child?.date_of_birth || "")
  const [selectedYear, setSelectedYear] = useState(birthdate ? birthdate.split("-")[0] : "")
  const [selectedMonth, setSelectedMonth] = useState(birthdate ? birthdate.split("-")[1] : "")
  const [selectedDay, setSelectedDay] = useState(birthdate ? birthdate.split("-")[2] : "")

  const navigation = useNavigation()

  const { setActiveChildProfileID, activeChildProfileID, updateChildren, removeChildren, user } = useAuth()

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const constructedDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(
        selectedDay,
      ).padStart(2, "0")}`
      setBirthdate(constructedDate)
    }
  }, [selectedYear, selectedMonth, selectedDay])

  const handleSubmit = async () => {
    if (childName && birthdate) {
      setLoading(true) // Show loader
      try {
        const updatedProfile: ChildProfile = await api.updateChildProfile(child.id, childName, birthdate)

        await updateChildren([updatedProfile])
        console.log("user.children.data", user?.children?.data);
        const updatedChild = user?.children?.data?.find((c) => c.id === child.id)

        navigation.navigate("CharacterCreation", { child: updatedChild })
      } catch (error) {
        console.error("Error updating profile:", error)
        Alert.alert("Error", "Failed to update profile. Please try again.")
      } finally {
        setLoading(false) // Hide loader
      }
    } else {
      Alert.alert("Oops!", "It looks like we're missing your child's name or birthday.")
    }
  }

  const handleActivate = async () => {
    if (!child || !child.id) {
      Alert.alert("Error", "No child profile selected.")
      return
    }

    try {
      setLoading(true)
      console.log("setActiveChildProfileID handleActivate")
      await setActiveChildProfileID(child.id)
      navigation.navigate("Profile")
    } catch (error) {
      console.error("Error setting active profile:", error)
      Alert.alert("Error", "Failed to set active profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    Alert.alert("Delete Profile", "Are you sure you want to delete this profile?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          setLoading(false)
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await api.deleteChildProfile(child.id)
            if(child.id === activeChildProfileID)
            {
              console.log("setActiveChildProfileID handleDelete")
              setActiveChildProfileID(null);
            }
            await removeChildren([child]);
            navigation.navigate("Profile")
          } catch (error) {
            console.error("Error deleting profile:", error)
            Alert.alert("Error", "Failed to delete profile. Please try again.")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <LottieLoader visible={loading} />
      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="Child's Name"
            placeholderTextColor={colors.palette.black}
            value={childName}
            onChangeText={setChildName}
            autoCapitalize="words"
          />
        </LinearGradient>
      </LinearGradient>

      <DatePicker
        onMonthChange={(month) => setSelectedMonth(month)}
        onDayChange={(day) => setSelectedDay(day)}
        onYearChange={(year) => setSelectedYear(year)}
        defaultMonth={birthdate ? parseInt(birthdate.split("-")[1], 10) : undefined}
        defaultDay={birthdate ? parseInt(birthdate.split("-")[2], 10) : undefined}
        defaultYear={birthdate ? parseInt(birthdate.split("-")[0], 10) : undefined}
        yearsLength={18}
      />

      <GradientButton text="Next" onPress={handleSubmit} />

      <GradientButton
        onPress={handleActivate}
        text="Set as Active"
      />

      <GradientButton
        onPress={handleDelete}
        text="Delete"
        validOuterGradientColors={["#FF4D4D", "#FF0000"]}
        validInnerGradientColors={["#FF9999", "#FF4D4D"]}
        textStyle={[{ color: "#FFFFFF" }]}
      />
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
