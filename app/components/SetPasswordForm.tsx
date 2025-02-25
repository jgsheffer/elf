import React, { useState } from "react"
import { StyleSheet, View, TextInput, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "./GradientButton"
import { colors } from "../theme"
import { useNavigation } from "@react-navigation/native"
import { api } from "../services/api"
import { useRoute } from "@react-navigation/native";

export const SetPasswordForm = () => {
  const route = useRoute();
  const token = route.params?.token ?? null;
  const email = route.params?.email ?? null; 
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigation = useNavigation()

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Password and confirmation do not match.")
      return
    }
    try {
      if(!email || !token)
        throw new Error("Missing email and token from deep link")
      const response = await api.updateForgottenPassword(email, token, password, confirmPassword)
      if(response.data.updateForgottenPassword.status === "PASSWORD_UPDATED")
      {
        Alert.alert("Success", "Password has been set successfully.")
        navigation.navigate("Welcome");
      }
      else
      {
        throw new Error("Failed reset password!")
      }
      
    } catch (error) {
      console.error("Error setting Password:", error)
      Alert.alert("Error", "Failed to set Password. Please try again.")
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry
            placeholderTextColor={colors.palette.black}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </LinearGradient>
      </LinearGradient>

      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor={colors.palette.black}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
