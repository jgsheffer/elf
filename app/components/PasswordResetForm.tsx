import React, { useState } from "react"
import { View, StyleSheet, TextInput, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "../components/GradientButton"
import { colors } from "../theme"
import { api } from "../services/api"
import { useNavigation } from "@react-navigation/native"
import { useRoute } from "@react-navigation/native"

export const PasswordResetForm = () => {
  const route = useRoute()
  const { dateOfBirth } = route.params
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation()

  const handleSubmit = async () => {
    if (email) {
      setLoading(true)
      try {
        const response = await api.forgotPassword(email)

        if (response.data.forgotPassword.status === "EMAIL_SENT") {
          Alert.alert("Success", "Password reset instructions have been sent to your email.")
          navigation.navigate("Login", { dateOfBirth })
        } else {
          throw new Error("Failed to send reset instructions")
        }
      } catch (error) {
        console.error("Password reset error:", error)
        Alert.alert("Error", "Failed to send password reset instructions. Please try again.")
      } finally {
        setLoading(false)
      }
    } else {
      Alert.alert("Error", "Please enter your email")
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor={colors.palette.black}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </LinearGradient>
      </LinearGradient>

      <GradientButton text="Reset Password" onPress={handleSubmit} isValid={!loading} />
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
    marginBottom: 20,
  },
  innerGradient: {
    borderRadius: 20,
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
    backgroundColor: colors.palette.white,
    paddingVertical: 5,
    borderRadius: 75,
  },
  linkText: {
    marginTop: 40,
    color: colors.palette.angry500,
    fontSize: 14,
  },
})
