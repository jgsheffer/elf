import React, { useContext, useState } from "react"
import { useRoute } from "@react-navigation/native"
import { Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { GradientContainer } from "../components/GradientContainer"
import { api } from "../services/api"
import { GradientButton } from "app/components/GradientButton"
import { AuthContext } from "../contexts/AuthContext"

export const PermissionRequiredScreen = () => {
  const route = useRoute()
  const { email, password } = route.params
  const { login } = useContext(AuthContext)
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.login(email, password)
      const status = response.login.status
      if(status === "MUST_VERIFY_EMAIL")
      {
        Alert.alert("Confirmation Email Sent", "Please check your inbox to confirm your email.")
      }
      else
      {
        throw new Error("Resending verification email FAILED") 
      }
      
    } catch (error) {
      Alert.alert("Error", "There was an issue resending the confirmation email.")
      console.error("Error resending confirmation email:", error)
    }
    finally
    {
      setIsSubmitting(false);
    }
  }

  return (
    <GradientContainer title="Permission Required" showBackButton={false} showLogOutButton={true}>
      <Text style={styles.intro}>
        Almost done! We’ve sent a confirmation email to ensure it’s really you. Please click the
        link in the email to activate your child’s account and start the adventure!
      </Text>
      <GradientButton text="Resend Confirmation Email" onPress={handleSubmit} isValid={!isSubmitting} />
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  intro: {
    textAlign: "center",
    marginBottom: 30,
  },
})
