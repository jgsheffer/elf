import React from "react"
import { GradientContainer } from "../components/GradientContainer"
import { CreateProfileForm } from "../components/CreateProfileForm"
import { Text, StyleSheet, Linking, TouchableOpacity } from "react-native"
import { BrowserLink } from "../components/BrowserLink"

export const CreateProfileScreen = () => {
  const handlePrivacyPolicyPress = () => {
    Linking.openURL("https://google.com")
  }

  return (
    <GradientContainer
      title="Create Profile"
      showBackButton={true}
      showLogOutButton={false}
    >
      <Text style={styles.intro}>
        Let’s set up a profile for your child! Please enter their name and birthday. This
        information will help us personalize their experience.
      </Text>
      <TouchableOpacity onPress={handlePrivacyPolicyPress}>
      <BrowserLink url="https://api.dev.whereismyelfie.click/privacy" text="Privacy Policy" color="#1E90FF"/>
      </TouchableOpacity>
      <CreateProfileForm />
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  linkText: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    color: "blue",
    textDecorationLine: "underline",
  },
})
