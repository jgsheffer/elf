import React, { useState, useEffect, useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, Linking, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "../components/GradientButton"
import { GradientContainer } from "../components/GradientContainer"
import { Checkbox } from "../components/Checkbox"
import { useNavigation } from "@react-navigation/native"
import { PinForm } from "../components/PinForm"
import * as Haptics from "expo-haptics"
import { Audio } from "expo-av"
import { BrowserLink } from "../components/BrowserLink"
import { load, save } from "../utils/storage"
import { useFocusEffect } from '@react-navigation/native'; // Import for handling focus changes
import { api } from "../services/api"
import { colors } from "app/theme"
import { useAuth } from "../contexts/AuthContext"
import { Preferences } from "app/apiResponseTypes"

export const SettingsScreen = () => {
  const [isPinVerified, setIsPinVerified] = useState(false)
  const [hapticsEnabled, setHapticsEnabled] = useState(false)
  const [soundsEnabled, setSoundsEnabled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false);
  const { logout, updateUserPrefs, user } = useAuth();

  const handleClosePopup = async () => {
    setModalVisible(false);
    await logout()
  
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    })

    try {
      const url = "https://api.dev.whereismyelf.click/account-deletion";
      const supported = await Linking.canOpenURL(url); // Check if URL can be opened
      if (supported) {
        await Linking.openURL(url); // Open the URL in the browser
      } else {
        Alert.alert(`Cannot open this URL: ${url}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        if (user && user.preferences) {
          console.log("Prefs", user.preferences);
          setEmail(user.email)
          setHapticsEnabled(user.preferences.enable_haptics)
          setSoundsEnabled(user.preferences.enable_sounds)
          setNotificationsEnabled(user.preferences?.enable_notification)
        }
        else
          console.log("Cant get Prefs as user is null");
      }
      fetchUserData()
    }, []),
  )

  const updatePreferences = async (updatedPreferences:Preferences) => {
    if(updateUserPrefs)
      updateUserPrefs(updatedPreferences)
  }

  const toggleNotifications = async () => {
      //PushNotification.localNotification({
      //channelId: 'default-channel-id',
      //title: 'Test Notification',
      // message: 'This is a test notification',
      //});
    setNotificationsEnabled(!notificationsEnabled)
  }

  const toggleSounds = async () => {
    setSoundsEnabled(!soundsEnabled)
  }

  const toggleHaptics = async () => {
    setHapticsEnabled(!hapticsEnabled)
  }

  const navigation = useNavigation()

  const getCheckboxStyles = (isChecked) => {
    return {
      innerGradientColors: isChecked ? ["#CDEDBDE5", "#CDEDBDE5"] : ["#A1E2FF", "#A1E2FF"],
      textColor: isChecked ? "black" : "gray",
    }
  }

  if (!isPinVerified) {
    return (
      <GradientContainer title="Enter Your Pin" showBackButton={true}>
        <PinForm onPinVerified={() => setIsPinVerified(true)} />
      </GradientContainer>
    )
  }

  const updateAllPrefs = async ()=> {
    console.log("Update all prefs:", "hapticsEnabled", hapticsEnabled, "soundsEnabled", soundsEnabled, "notificationsEnabled", notificationsEnabled);
    await api.updatePreferences(hapticsEnabled, soundsEnabled, notificationsEnabled).catch((error) => console.error("Failed to update preferences:", error))
    await updatePreferences({ id:user?.preferences ? user.preferences.id : "", enable_sounds: soundsEnabled, enable_haptics: hapticsEnabled, enable_notification: notificationsEnabled   })
    console.log("Update all prefs:", "hapticsEnabled", user?.preferences?.enable_haptics, "soundsEnabled", user?.preferences?.enable_sounds, "notificationsEnabled", user?.preferences?.enable_notification);
  }

  return (
    <GradientContainer title="Settings" showBackButton={true} onPressBack={()=>updateAllPrefs()}>
      <LinearGradient
        colors={["#7BA6E0", "#D7F2FF"]}
        style={[styles.containerGradient, { marginTop: 5 }]}
      >
        <LinearGradient
          colors={["#A1E2FF", "#A1E2FF"]}
          style={[styles.innerGradient, { paddingVertical: 5 }]}
        >
          <LinearGradient
            colors={["#7BA6E0", "#D7F2FF"]}
            style={[styles.containerGradient, { marginTop: 5 }]}
          >
            <LinearGradient
              colors={["#A1E2FF", "#A1E2FF"]}
              style={[styles.innerGradient, { paddingVertical: 0, paddingHorizontal: 0}]}
            >
              <Text style={styles.textInput}>{email}</Text>
            </LinearGradient>
          </LinearGradient>
          {false && <GradientButton text="Send" onPress={() => navigation.navigate("Welcome")} />}
        </LinearGradient>
      </LinearGradient>

      <View style={{ height: 20 }} />

      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.containerGradient}>
        <LinearGradient
          colors={getCheckboxStyles(hapticsEnabled).innerGradientColors}
          style={styles.innerGradient}
        >
          <View style={styles.row}>
            <Text
              style={[
                styles.text,
                { fontSize: 16, color: getCheckboxStyles(hapticsEnabled).textColor },
              ]}
            >
              Haptics
            </Text>
            <Checkbox isChecked={hapticsEnabled} onPress={toggleHaptics} />
          </View>
        </LinearGradient>
      </LinearGradient>

      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.containerGradient}>
        <LinearGradient
          colors={getCheckboxStyles(soundsEnabled).innerGradientColors}
          style={styles.innerGradient}
        >
          <View style={styles.row}>
            <Text
              style={[
                styles.text,
                { fontSize: 16, color: getCheckboxStyles(soundsEnabled).textColor },
              ]}
            >
              Sounds
            </Text>
            <Checkbox isChecked={soundsEnabled} onPress={toggleSounds} />
          </View>
        </LinearGradient>
      </LinearGradient>

      <LinearGradient colors={["#7BA6E0", "#D7F2FF"]} style={styles.containerGradient}>
        <LinearGradient
          colors={getCheckboxStyles(notificationsEnabled).innerGradientColors}
          style={styles.innerGradient}
        >
          <View style={styles.row}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16,
                  color: getCheckboxStyles(notificationsEnabled).textColor,
                },
              ]}
            >
              Notifications
            </Text>
            <Checkbox isChecked={notificationsEnabled} onPress={toggleNotifications} />
          </View>
        </LinearGradient>
      </LinearGradient>
      <TouchableOpacity onPress={()=>setModalVisible(true)}>
        <Text style={[styles.linkText]}>Delete Account</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>
            WARNING: You are attempting to delete your account. 
            If this is not what you intended, press the "BACK" button.
             If you continue, you will be logged out and you
              will be brought to a webpage where you can delete your account.
            </Text>
            <View style={styles.buttonContainer}>
            <View style={styles.buttonSpacing}>
              <Button title="DELETE MY ACCOUNT" onPress={handleClosePopup} color={"#CC0000"} />
            </View>
            <View style={styles.buttonSpacing}>
              <Button title="Back" onPress={() => setModalVisible(false)} />
            </View>
          </View>
          </View>
        </View>
      </Modal>
    </GradientContainer>
  )
}

const styles = StyleSheet.create({
  containerGradient: {
    borderRadius: 20,
    padding: 3,
    width: "100%",
    marginBottom: 10,
    minHeight: 25,
  },
  innerGradient: {
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    width: "100%",
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logoutButton: {
    marginTop: 25,
  },
  logoutButtonText: {
    color: colors.palette.angry500,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'column',
  },
  buttonSpacing: {
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    fontSize: 16,
    marginBottom: 10,
    color: "#CC0000"
  },
})
