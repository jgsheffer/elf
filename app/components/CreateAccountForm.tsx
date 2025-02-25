import React, { useState, useContext, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, Alert, Modal, Button } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientButton } from "./GradientButton"
import { colors } from "../theme"
import { useNavigation } from "@react-navigation/native"
import { api } from "../services/api"
import { AuthContext } from "../contexts/AuthContext"

export const CreateAccountForm = ({ dateOfBirth }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const navigation = useNavigation()
  useEffect(() => {
    if (dateOfBirth === undefined) {
      navigation.navigate("Welcome");
    }
  }, [dateOfBirth, navigation]);

  const { login } = useContext(AuthContext)

  const parseGraphQLValidationErrors = (response) => {
    if (response.errors && response.errors.length > 0) {
      const error = response.errors[0];
      const validationErrors = error?.extensions?.validation;

      if (validationErrors) {
        return validationErrors;
      }
    }
    return null;
  };

  const getFirstValidationError = (validationErrors) => {
    const firstField = Object.keys(validationErrors)[0];

    if (firstField) 
    {
      return validationErrors[firstField][0].replace('input.', '');
    }
  };

  const handleSubmit = async () => {
    if (email && password && dateOfBirth) 
    {
      setLoading(true)
      try 
      {
        const response = await api.createAccount(email, password, dateOfBirth)
        const validationErrors = parseGraphQLValidationErrors(response);
        if(validationErrors)
        {
          setErrorMessage(getFirstValidationError(validationErrors))
          return
        }

        console.log("response", response)
        if (response && response.data && response.data.register && response.data.register.tokens)
        {
          const status = response?.data.register?.status;

          if(status === "MUST_VERIFY_EMAIL")
          {
            navigation.navigate("PermissionRequired", {email, password});
          }
          else
          {
            throw new Error("Status for new account was not MUST_VERIFY_EMAIL")
          }
        }
        else
        {
          throw new Error("Missing response data")
        }
      } 
      catch (err) 
      {
        setErrorMessage("Error creating account using: " + api.config.url)
        console.error("Error creating account:", err.message || err)
      } 
      finally 
      {
        setLoading(false)
      }
    } 
    else 
    {
      Alert.alert("Error", "Please enter email, password, and date of birth")
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
      {loading && <Text style={styles.loadingText}>Creating account...</Text>}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: colors.palette.white,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  modalText: {
    fontSize: 16,
    color: colors.palette.black,
    textAlign: "center",
    marginBottom: 20,
  },
  errorTextStyle:{
    marginBottom: 10,
    color: colors.palette.angry500,
    fontSize: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },

  buttonSpacing: {
    marginVertical: 10, 
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    width: "80%",
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
  loadingText: {
    marginTop: 10,
    color: colors.palette.black,
  },
})
