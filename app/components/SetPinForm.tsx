import React, { useState, useContext } from "react"
import { Text, StyleSheet, View, TextInput, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "./GradientButton"
import { colors } from "../theme"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../contexts/AuthContext"

export const SetPinForm = () => {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const navigation = useNavigation()
  const authContext = useContext(AuthContext)

  const handleSubmit = async () => {
    if (pin.length < 4 || confirmPin.length < 4) {
      Alert.alert("Invalid PIN", "PIN must be at least 4 digits.")
      return
    }
    if (pin !== confirmPin) {
      Alert.alert("PIN Mismatch", "PIN and confirmation do not match.")
      return
    }
    try {
      await authContext?.setPin(pin)
      Alert.alert("Success", "PIN has been set successfully.")
      navigation.navigate("Profile")
    } catch (error) {
      console.error("Error setting PIN:", error)
      Alert.alert("Error", "Failed to set PIN. Please try again.")
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="Enter PIN"
            secureTextEntry
            keyboardType="numeric"
            placeholderTextColor={colors.palette.black}
            value={pin}
            onChangeText={setPin}
            maxLength={6}
            autoCapitalize="none"
          />
        </LinearGradient>
      </LinearGradient>

      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="Confirm PIN"
            secureTextEntry
            keyboardType="numeric"
            placeholderTextColor={colors.palette.black}
            value={confirmPin}
            onChangeText={setConfirmPin}
            maxLength={6}
            autoCapitalize="none"
          />
        </LinearGradient>
      </LinearGradient>

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
    justifyContent: "center",
    width: "100%",
  },
  input: {
    color: colors.palette.black,
    width: "100%",
    fontFamily: "BowlbyOneSC-Regular",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: colors.palette.white,
    paddingVertical: 5,
    borderRadius: 75,
  },
})
