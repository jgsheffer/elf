import React, { ReactNode } from "react"
import {
  ViewStyle,
  TextStyle,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { colors } from "../theme"

interface GradientButtonProps {
  children?: ReactNode | null
  text?: string | null
  onPress?: () => void
  isValid?: boolean
  imageSource?: ImageSourcePropType | null
  validOuterGradientColors?: string[]
  validInnerGradientColors?: string[]
  invalidOuterGradientColors?: string[]
  invalidInnerGradientColors?: string[]
  outerViewStyle?: ViewStyle[] | null
  innerViewStyle?: ViewStyle[] | null
  imageStyle?: ImageStyle[] | null
  textStyle?: TextStyle[] | null
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children = null,
  text = null,
  onPress = () => {},
  isValid = true,
  imageSource = null,
  validOuterGradientColors = ["#A4D1E7", "#FDFFFF"],
  validInnerGradientColors = ["#FFFFFF", "#D2EBF5"],
  invalidOuterGradientColors = ["#44444466", "#AAAAAA66"],
  invalidInnerGradientColors = ["#AAAAAA66", "#AAAAAA66"],
  outerViewStyle = null,
  innerViewStyle = null,
  imageStyle = null,
  textStyle = null,
}) => {
  const outerGradientColors = isValid ? validOuterGradientColors : invalidOuterGradientColors
  const innerGradientColors = isValid ? validInnerGradientColors : invalidInnerGradientColors

  return (
    <LinearGradient colors={outerGradientColors} style={[styles.outerGradient, outerViewStyle]}>
      <TouchableOpacity style={styles.touchable} onPress={onPress} disabled={!isValid}>
        <LinearGradient colors={innerGradientColors} style={[styles.innerGradient, innerViewStyle]}>
          {imageSource && <Image source={imageSource} style={[styles.image, imageStyle]} />}
          {text !== null && text !== undefined && (
            <Text
              adjustsFontSizeToFit
              style={[styles.buttonText, !isValid && styles.disabledText, textStyle]}
            >
              {text}
            </Text>
          )}
          {children}
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  outerGradient: {
    borderRadius: 20,
    padding: 3,
    width: "100%",
    marginVertical: 10,
    marginHorizontal: 0,
  },
  touchable: {
    width: "100%",
    borderRadius: 20,
  },
  innerGradient: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
  },
  buttonText: {
    fontFamily: "BowlbyOneSC-Regular",
    fontSize: 20,
    fontWeight: "bold",
    color: colors.palette.black,
    resizeMode: "contain",
    textAlign: "center",
  },
  disabledText: {
    color: colors.palette.black,
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
})
