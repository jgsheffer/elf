import React, { useEffect, useContext } from "react"
import { GradientContainer } from "../components/GradientContainer"
import { SetPasswordForm } from "../components/SetPasswordForm"
import { Text, StyleSheet, TouchableOpacity } from "react-native"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigation } from "@react-navigation/native"

export const SetPasswordScreen = () => {
  const authContext = useContext(AuthContext)
  const navigation = useNavigation()

  useEffect(() => {
    const checkPinStatus = async () => {
      try {
        const isPinAlreadySet = await authContext?.isPinSet()
        if (isPinAlreadySet) {
          navigation.navigate("Profile")
        }
      } catch (error) {
        console.error("Error checking PIN status:", error)
      }
    }

    checkPinStatus()
  }, [authContext, navigation])

  const screenTitle = "Set Your Password"
  const instructions = "Please create a secure password to protect your account."

  return (
    <GradientContainer title={screenTitle} 
    showLogOutButton={false}
    bottomOuterChildren={
      <>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate("Welcome")}>
          <Text style={styles.clickableText}>Login</Text>
        </TouchableOpacity>
      </>
    }>
      <Text style={styles.intro}>{instructions}</Text>
      <SetPasswordForm />
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  footerText: {
    marginTop: 40,
    color: "white",
    fontSize: 18,
  },
  clickableText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
})
