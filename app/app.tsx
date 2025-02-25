/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app.
 */
if (__DEV__) {
  // Load Reactotron in development only.
  require("./devtools/ReactotronConfig.ts")
}
import 'react-native-get-random-values';
import "./utils/gestureHandler"
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React, { useContext, useEffect } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { AppNavigator } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { Text } from "react-native"
import { iapManager } from "./services/api/IapManager"
import { AuthProvider, AuthContext } from "./contexts/AuthContext"
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

function AppContent() {
  const { isLoggedIn, loading, user, accessToken, refreshToken } = useContext(AuthContext)
  
  if (loading) {
    return <Text>Loading...</Text>
  }

  return <AppNavigator initialRouteName={isLoggedIn ? "CreateProfileScreen" : "WelcomeScreen"} />
}

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {

  const { hideSplashScreen } = props
  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)

  useEffect(() => {
    if (areFontsLoaded && !fontLoadError) {
      hideSplashScreen()
    }
  }, [areFontsLoaded, fontLoadError, hideSplashScreen])

  useEffect(() => {
  const initializeIAP = async () => {
    try {
      await iapManager.initialize();
      console.log('IAP connection initialized successfully.');
    } catch (error) {
      console.error('Error initializing IAP connection:', error);
    }
  };

  initializeIAP();

  return () => {
    iapManager.endConnection();
  };
}, []);

  if (!areFontsLoaded && !fontLoadError) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App