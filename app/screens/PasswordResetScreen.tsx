import React from "react"
import { Text, StyleSheet } from "react-native"
import { GradientContainer } from "../components/GradientContainer"
import { PasswordResetForm } from "../components/PasswordResetForm"

export const PasswordResetScreen = () => {
  return (
    <GradientContainer title="Forgot your password?" showBackButton={true}>
      <Text style={styles.intro}>
        Enter your email below and we'll email you instructions on resetting your password.
      </Text>
      <PasswordResetForm />
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  intro: {
    textAlign: "center",
    marginBottom: 30,
  },
})
