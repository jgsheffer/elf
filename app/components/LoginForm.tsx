import React, { useState, useContext, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Modal, Button } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "./GradientButton"
import { colors } from "../theme"
import { api } from "../services/api"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigation } from "@react-navigation/native"

export const LoginForm = (dateOfBirth:string) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { login, isLoggedIn } = useContext(AuthContext)
  const navigation = useNavigation()
  useEffect(() => {
    if (dateOfBirth === undefined) {
      navigation.navigate("Welcome");
    }
  }, [dateOfBirth, navigation]);

 const handleSubmit = async () => {
    if (email && password) {
      setLoading(true)
      try {
        const response = await api.login(email, password)

        const status = response.login.status
        const tokens = response.login.tokens
        const { accessToken, refreshToken, user } = tokens
        console.log("TOKENS", tokens);
        console.log("Status", status);

        if(status==="SUCCESS")
        {
          await login(accessToken, refreshToken, user)
        }
        else if(status === "MUST_VERIFY_EMAIL")
        {
          navigation.navigate("PermissionRequired", {email, password});
        }
        else
        {
          throw new Error("FAILED to login")
        }

      } catch (error) {
        console.error("Login error:", error)
        Alert.alert("Error", "Failed to log in. Please check your credentials and try again.")
      } finally {
        setLoading(false)
      }
    } else {
      Alert.alert("Error", "Please enter both email and password")
    }
  }


  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={errorMessage != null}
        animationType="none"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.errorTextStyle}>Error</Text>
            <Text>
              {errorMessage}
            </Text>
            <View style={styles.buttonContainer}>
            <View style={styles.buttonSpacing}>
              <Button title="Ok" onPress={() => {setErrorMessage(null);}} />
            </View>
          </View>
          </View>
        </View>
      </Modal>
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
            placeholder="PASSWORD"
            placeholderTextColor={colors.palette.black}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </LinearGradient>
      </LinearGradient>

      <GradientButton text="OK" onPress={handleSubmit} isValid={!loading} />
      {loading && <Text style={styles.loadingText}>Logging in...</Text>}

      <TouchableOpacity onPress={() => navigation.navigate("PasswordReset", dateOfBirth)}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  loadingText: {
    marginTop: 10,
    color: colors.palette.black,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  buttonSpacing: {
    marginVertical: 10, 
    width: "100%",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: colors.palette.white,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000", // Added shadow for better visibility
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow effect
  },
  gradientInput: {
    borderRadius: 20,
    padding: 3,
    width: "100%",
    marginBottom: 20,
  },
  innerGradient: {
    borderRadius: 20,
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
    backgroundColor: colors.palette.white,
    paddingVertical: 5,
    borderRadius: 75,
  },
  errorTextStyle:{
    marginBottom: 10,
    color: colors.palette.angry500,
    fontSize: 20,
  },
  linkText: {
    marginTop: 40,
    color: colors.palette.angry500,
    fontSize: 14,
  },
})
