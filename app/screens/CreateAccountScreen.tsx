import React from "react"
import { Text, StyleSheet, TouchableOpacity } from "react-native"
import { GradientContainer } from "../components/GradientContainer"
import { CreateAccountForm } from "../components/CreateAccountForm"
import { BrowserLink } from "../components/BrowserLink"
import { useRoute } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"

export const CreateAccountScreen = () => {
  const route = useRoute()
  const { dateOfBirth } = route.params
  const navigation = useNavigation()

  return (
    <GradientContainer 
      title="Create Account" 
      showBackButton={true}
      bottomOuterChildren={
        <>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={()=>navigation.navigate("Login", { dateOfBirth: dateOfBirth })}>
            <Text style={styles.clickableText}>Login</Text>
          </TouchableOpacity>
        </>
      }
    >
      <Text style={styles.intro}>
        Please enter your email and create a password. This information helps us keep your account
        secure. You can read more about how we protect and use your information in our Privacy
        Policy. 
      </Text>
      <BrowserLink url="https://api.dev.whereismyelfie.click/privacy" text="Privacy Policy" color="#1E90FF"/>
      <CreateAccountForm dateOfBirth={dateOfBirth} />
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  intro: {
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
