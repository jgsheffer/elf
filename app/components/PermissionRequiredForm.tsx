import React, { useState } from "react"
import { View, StyleSheet, TextInput } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "./GradientButton"
import { colors } from "../theme"
import { useNavigation } from "@react-navigation/native"

export const PermissionsRequiredForm = () => {
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const navigation = useNavigation()

  const handleSubmit = () => {}

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
          />
        </LinearGradient>
      </LinearGradient>

      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.gradientInput}>
        <LinearGradient colors={["#A1E2FF", "#A1E2FF"]} style={styles.innerGradient}>
          <TextInput
            style={styles.input}
            placeholder="CONFIRM EMAIL"
            placeholderTextColor={colors.palette.black}
            value={confirmEmail}
            onChangeText={setConfirmEmail}
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
    marginBottom: 20,
  },
  innerGradient: {
    borderRadius: 20,
    paddingVertical: 10,
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
