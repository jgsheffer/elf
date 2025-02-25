import React from "react"
import { Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { LoginForm } from "../components/LoginForm"
import { GradientContainer } from "../components/GradientContainer"
import { useRoute } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../theme"

export const LoginScreen = () => {
  const route = useRoute()
  const { dateOfBirth } = route.params
  const navigation = useNavigation()
  const window = Dimensions.get('window');

  console.log("Width", window.width, "Height", window.height, "Scale", window.scale);

  return (
    <GradientContainer
      title="Login" 
      showBackButton={true} 
      bottomOuterChildren={
        <>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={()=>navigation.navigate("CreateAccount", { dateOfBirth })}>
            <Text style={styles.clickableText}>Create Account</Text>
          </TouchableOpacity>
        </>
      }
    >
      
      <Text style={styles.intro}>Welcome back! Please log in with your email and password.</Text>
      <LoginForm dateOfBirth/>
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  intro: {
    textAlign: "center",
    marginBottom: 30,
  },
  footerText: {
    marginTop: 40,
    color: colors.palette.white,
    fontSize: 18,
  },
  clickableText: {
    color: colors.palette.white,
    fontWeight: "bold",
    fontSize: 20,
  },
})
