import React, { useContext } from "react"
import { View, Text, ImageSourcePropType, Dimensions,  KeyboardAvoidingView, Platform, ImageBackground, StyleSheet, TouchableOpacity,} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../theme"
import { AuthContext } from "../contexts/AuthContext"
import { ButtonsHeader } from "./ButtonsHeader"

interface GradientContainerProps {
  children?: React.ReactNode | null
  topOuterChildren?: React.ReactNode | null
  bottomOuterChildren?: React.ReactNode | null
  title?: string | null
  isTitle?: boolean
  bgGradientColors?: string[] | null
  gradientcolor1?: string
  gradientcolor2?: string
  showBackButton?: boolean
  showLogOutButton?: boolean
  imageSource?: ImageSourcePropType | null
  imageSourceLeftButton?: ImageSourcePropType | null
  imageSourceRightButton?: ImageSourcePropType | null
  iosKeyboardAvoidingViewBehavior? : 'height' | 'position' | 'padding' | undefined
  onPressLeft?: () => void
  onPressRight?: () => void
  onPressBack?: () => void
}

export const GradientContainer: React.FC<GradientContainerProps> = ({
  children = null,
  topOuterChildren = null,
  bottomOuterChildren = null,
  title = null,
  isTitle = false,
  gradientcolor1 = "#FEFFFF",
  gradientcolor2 = "#53A8E7",
  bgGradientColors = null,
  showBackButton = false,
  showLogOutButton = false,
  imageSource = require("../../assets/images/bkg-image.png"),
  imageSourceLeftButton = null,
  imageSourceRightButton = null,
  iosKeyboardAvoidingViewBehavior = null,
  onPressLeft = null,
  onPressRight = null,
  onPressBack = null,
}) => {
  const { logout } = useContext(AuthContext)
  const navigation = useNavigation()
  const { height } = Dimensions.get("window");

  const handleLogout = async () => {
    await logout()

    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    })
  }

  const renderBackground = () => {
    const content = () => 
      <>
      {Platform.OS === 'ios' && iosKeyboardAvoidingViewBehavior ? (
        <KeyboardAvoidingView
          behavior={iosKeyboardAvoidingViewBehavior}
          style={styles.keyboardAvoidingView}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      ) : (
        renderContent()
      )}
      {(imageSourceLeftButton || imageSourceRightButton || showBackButton) && (
        <ButtonsHeader
          imageSourceLeftButton={showBackButton ? require("../../assets/images/icon-back.png") : imageSourceLeftButton}
          imageSourceRightButton={imageSourceRightButton}
          isLeftGradient = {!showBackButton}
          onPressLeft={showBackButton && navigation.canGoBack() ?
             () => {
                if (onPressBack) 
                {
                  onPressBack(); 
                }; 
                navigation.goBack(); 
              } : 
              () =>
              { 
                if(onPressLeft) 
                {
                  onPressLeft(); 
                } 
              }
          }
          onPressRight={()=>onPressRight ? onPressRight() : null}
        />
      )}
      </>
    ;
  
    if (bgGradientColors) {
      return (
        <LinearGradient colors={bgGradientColors} style={styles.background}>
          {content()}
        </LinearGradient>
      );
    } else if (imageSource) {
      return (
        <ImageBackground source={imageSource} style={styles.background}>
          {content()}
        </ImageBackground>
      );
    }
    return <View style={styles.background}>{content()}</View>;
  };

  const renderContent = () => (
    <>

      <View style={styles.outerContainer}>
        {topOuterChildren}
          <LinearGradient colors={[gradientcolor1, gradientcolor2]} style={styles.gradientContainer}>
            <View style={styles.container}>
              {title && <Text style={[styles.title, { fontSize: isTitle ? 36 : 24 }]}>{title}</Text>}
                {children}
              {showLogOutButton && (
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        {bottomOuterChildren}
      </View>
    </>
  )

  return <>{renderBackground()}</>
}

const styles = StyleSheet.create({
  keyboardAvoidingView:
  {
    justifyContent: "center",
    height: "100%",
    width: "100%",
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
    flexShrink: 1,
  },
  container: {
    backgroundColor: colors.palette.lightBlue,
    borderRadius: 50,
    paddingVertical: "7%",
    paddingHorizontal: "6%",
    width: "100%",
    alignItems: "center",
    flexGrow: 1,
  },
  outerContainer: {
    width: "100%",
    alignItems: "center",
    flexShrink: 1,
  },
  title: {
    fontFamily: "BowlbyOneSC-Regular",
    fontWeight: "bold",
    marginBottom: 30,
    color: colors.palette.black,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: "10%",
    left: "5%",
    zIndex: 1,
  },
  rightButton: {
    position: "absolute",
    top: 50,
    right: 20,
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
