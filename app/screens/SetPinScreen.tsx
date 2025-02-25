import React, { useState, useEffect, useContext } from "react"
import { GradientContainer } from "../components/GradientContainer"
import { SetPinForm } from "../components/SetPinForm"
import { Text, StyleSheet } from "react-native"
import { useAuth } from "../contexts/AuthContext"
import { useNavigation, useNavigationState } from "@react-navigation/native"

export const SetPinScreen = () => {
  const { isPinSet } = useAuth();
  const navigation = useNavigation();
  const currentRouteName = useNavigationState(state => state.routes[state.index]?.name)

  useEffect(() => {
    const checkPinStatus = async () => {
      try {
        console.log("Is set Pin")
        const isPinAlreadySet = await isPinSet();
        if (isPinAlreadySet) {
          navigation.navigate("Profile")
        }
      } catch (error) {
        console.error("Error checking PIN status:", error)
      }
    }

    checkPinStatus()
  }, [currentRouteName === "SetPin"])

  const screenTitle = "Set Your PIN"
  const instructions = "Please create a secure PIN to protect your account."

  return (
    <GradientContainer title={screenTitle} showBackButton={false} showLogOutButton={true}>
      <Text style={styles.intro}>{instructions}</Text>
      <SetPinForm />
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
})
