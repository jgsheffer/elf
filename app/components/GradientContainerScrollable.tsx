import React, { useContext } from "react"
import {
  View,
  Text,
  ImageSourcePropType,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../theme"
import { AuthContext } from "../contexts/AuthContext"

interface GradientContainerScrollableProps {
  children?: React.ReactNode | null
  topOuterChildren?: React.ReactNode | null
  bottomOuterChildren?: React.ReactNode | null
  title?: string | null
  isTitle?: boolean
  showRightButton?: boolean
  bgGradientColors?: string[] | null
  gradientcolor1?: string
  gradientcolor2?: string
  showBackButton?: boolean
  showLogOutButton?: boolean
  imageSource?: ImageSourcePropType | null
  imageSourceLeftButton?: ImageSourcePropType | null
  imageSourceRightButton?: ImageSourcePropType | null
  onPressLeft?: () => void
  onPressRight?: () => void
  onPressBack?: () => void
}

export const GradientContainerScrollable: React.FC<GradientContainerScrollableProps> = ({
  children = null,
  topOuterChildren = null,
  bottomOuterChildren = null,
  title = null,
  isTitle = false,
  gradientcolor1 = "#FEFFFF",
  gradientcolor2 = "#53A8E7",
  bgGradientColors = null,
  showBackButton = false,
  showRightButton = false,
  imageSource = require("../../assets/images/bkg-image.png"),
  imageSourceLeftButton = null,
  imageSourceRightButton = null,
  onPressLeft = null,
  onPressRight = null,
  onPressBack = null,
  showLogOutButton=false
}) => {
  const { logout } = useContext(AuthContext)
  const navigation = useNavigation()
  const handleLogout = async () => {
    await logout()

    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    })
  }

  const renderContent = () => (
    <>
      <ImageBackground source={imageSource} style={styles.background}>
        <SafeAreaView style={{ width: "100%" }}>
          {showRightButton && (
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.rightButton}
                onPress={() => navigation.navigate("Settings")}
              >
                <Image
                  source={require("../../assets/images/icon-settings.png")}
                  style={styles.backArrow}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.outerContainer}>
            <LinearGradient
              colors={[gradientcolor1, gradientcolor2]}
              style={styles.gradientContainer}
            >
              <View style={styles.container}>
                <ScrollView
                  style={styles.scrollableContainer}
                  contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
                  persistentScrollbar={false}
                  showsVerticalScrollIndicator={false}
                >
                  {children}
                  {showLogOutButton && (
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                      <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  )

  return <>{renderContent()}</>
}

const styles = StyleSheet.create({
  keyboardAvoidingView:
  {
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
  },
  gradientContainer: {
    borderRadius: 55,
    padding: 5,
    width: "90%",
  },
  topBar: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    flexShrink: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: colors.palette.lightBlue,
    borderRadius: 45,
    width: "100%",
    alignItems: "center",
    flexShrink: 1,
  },
  outerContainer: {
    borderRadius: 0,
    width: "100%",
    alignItems: "center",
    flexShrink: 1,
  },
  scrollableContainer: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 50,
  },
  title: {
    fontFamily: "BowlbyOneSC-Regular",
    fontWeight: "bold",
    marginBottom: 30,
    color: colors.palette.black,
    textAlign: "center",
  },
  rightButton: {
    zIndex: 1,
  },

  backArrow: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  logoutButton: {
    marginTop: 25,
  },
  logoutButtonText: {
    color: colors.palette.angry500,
  },
})
