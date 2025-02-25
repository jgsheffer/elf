import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useContext, useEffect } from "react"
import { Alert, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { AuthContext } from "../contexts/AuthContext"
import * as Linking from "expo-linking"
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api"

export type AppStackParamList = {
  Welcome: undefined
  Parent: undefined
  CreateAccount: undefined
  Profile: undefined
  CreateProfile: undefined
  Permission: undefined
}

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>
  const Stack = createNativeStackNavigator<AppStackParamList>()

  const AppStack = observer(function AppStack() {
  const navigation = useNavigation();
  const { login, logout } = useContext(AuthContext)
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
      // Handles the incoming deep link URL
      const handleDeeplink = (url: string) => {
        console.log("URL", url)
        const { hostname, path, queryParams } = Linking.parse(url);
        if(queryParams?.email)
        {
          queryParams.email = decodeURIComponent(queryParams.email);
        }
        console.log("params:", queryParams);
        console.log("path:", path);
        console.log("hostname:", hostname);

        if (hostname === "reset-password" && queryParams?.token && queryParams?.email) {
          console.log("Token:", queryParams.token);
          console.log("Email:", queryParams.email);
          
            const handleLogout = async () => {
              await logout()
          
              navigation.navigate("SetPassword", {token: queryParams.token, email: queryParams.email,});
            }
            handleLogout();
        }
        if (hostname === "verify-account" && queryParams?.token) {
          const handleVerify = async () => {
            await logout();
            console.log("Token:", queryParams.token);
            try{
              const response = await api.verifyEmail(queryParams.token)
              console.log("verify account response", response);
              if(!response.errors)
              {
                const { accessToken, refreshToken, user, expiresIn } = response.data.verifyEmail.tokens;
                console.log("accessToken:", accessToken);
                console.log("refreshToken:", refreshToken);
                console.log("user:", user);
                console.log("expiresIn:", expiresIn);

                await login(accessToken, refreshToken, user, expiresIn);
                console.log("Is logged in?:", isLoggedIn);
              }
              else
              {
                throw new Error("Failed to verify")
              }
            }
            catch (error) {
              console.error("Verification error:", error)
              Alert.alert("Error", "Failed to verify. Please try again." + error)
            }
          }
          handleVerify();
        }
      };

      // Listener for deep links triggered while the app is open
      const handleDeeplinkEvent = (event: { url: string }) => {
        const { url } = event;
        console.log("Deep link received:", url);
        handleDeeplink(url);
      };

      // Register the deep link listener and get the initial URL
      const deepLinkListener = Linking.addEventListener("url", handleDeeplinkEvent);
      Linking.getInitialURL().then((url) => {
        if (url) {
          handleDeeplink(url);
        }
      });

    return () => {
      deepLinkListener.remove();
    };
  }, []);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="SetPin" component={Screens.SetPinScreen} />
          <Stack.Screen name="Profile" component={Screens.ProfileScreen} />
          <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
          <Stack.Screen name="Calendar" component={Screens.CalendarScreen} />
          <Stack.Screen name="Gameplay" component={Screens.GameplayScreen} />
          <Stack.Screen name="CreateProfile" component={Screens.CreateProfileScreen} />
          <Stack.Screen name="UpdateProfile" component={Screens.UpdateProfileScreen} />
          <Stack.Screen name="CharacterCreation" component={Screens.CharacterCreationScreen} />
          <Stack.Screen name="ComingSoon" component={Screens.ComingSoonScreen} />
          <Stack.Screen name="PasswordReset" component={Screens.PasswordResetScreen} />
          <Stack.Screen name="Globe" component={Screens.GlobeScreen} />
          <Stack.Screen name="GlobeAndroid" component={Screens.GlobeAndroidScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          <Stack.Screen name="Parent" component={Screens.ParentScreen} />
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
          <Stack.Screen name="PasswordReset" component={Screens.PasswordResetScreen} />
          <Stack.Screen name="SetPassword" component={Screens.SetPasswordScreen} />
          <Stack.Screen name="CreateAccount" component={Screens.CreateAccountScreen} />
          <Stack.Screen name="PermissionRequired" component={Screens.PermissionRequiredScreen} />
        </>
      )}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
      
    >
      <AppStack />
    </NavigationContainer>
  )
})
