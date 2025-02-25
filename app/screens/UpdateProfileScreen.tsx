import React from "react"
import { GradientContainer } from "../components/GradientContainer"
import { UpdateProfileForm } from "../components/UpdateProfileForm"
import { Text, StyleSheet, Linking, TouchableOpacity } from "react-native"
import { useRoute } from "@react-navigation/native"
import { ChildProfile } from "app/apiResponseTypes"

export const UpdateProfileScreen = () => {
  const route = useRoute()
  const { child } = route.params || {} // Get child data passed to edit the profile

  return (
    <GradientContainer
      title="Edit Profile"
      showBackButton={true}
      showLogOutButton={false}
    >
      <Text style={styles.intro}>
        Update your child's profile information below. You can make changes to their name and
        birthday.
      </Text>
      <UpdateProfileForm child={child as ChildProfile} />
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
