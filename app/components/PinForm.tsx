import React, { useState, useContext } from "react"
import { View, TextInput, StyleSheet, Alert } from "react-native"
import { GradientButton } from "./GradientButton"
import { colors } from "../theme"
import { AuthContext } from "../contexts/AuthContext"
import LinearGradient from "react-native-linear-gradient"

export const PinForm = ({ onPinVerified }) => {
  const [pin, setPin] = useState("")
  const authContext = useContext(AuthContext)

  const handleVerifyPin = async () => {
    try {
      const isCorrectPin = await authContext?.verifyPin(pin)
      if (isCorrectPin) {
        onPinVerified()
      } else {
        Alert.alert("Incorrect PIN", "Please enter the correct PIN.")
      }
    } catch (error) {
      console.error("Error verifying PIN:", error)
      Alert.alert("Error", "Failed to verify the PIN. Please try again.")
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

      <GradientButton text="Verify" onPress={handleVerifyPin} />
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
    paddingVertical: 5,
    backgroundColor: colors.palette.white,
    borderRadius: 75,
  },
})
