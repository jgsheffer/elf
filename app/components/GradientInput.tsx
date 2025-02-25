import { ViewStyle, View, Image, TextStyle, StyleSheet, TextInput, ColorValue, Keyboard, KeyboardAvoidingView, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { colors } from "../theme"
import { GradientButton } from "./GradientButton"

interface GradientInputProps {
  inputValue?: string | undefined
  onChangeText?: (value: string) => void
  onEndEditing?: () => void
  onPressSubmit?: () => void
  isValid?: boolean
  validOuterGradientColors?: string[]
  validInnerGradientColors?: string[]
  invalidOuterGradientColors?: string[]
  invalidInnerGradientColors?: string[]
  outerViewStyle?: ViewStyle[] | null
  innerViewStyle?: ViewStyle[] | null
  textStyle?: TextStyle[] | null
  placeholderText?: string | undefined
  placeholderTextColor?: ColorValue | undefined
  autoCapitalize? : "none" | "sentences" | "words" | "characters" | undefined
  useSecureTextEntry? : boolean | undefined

}

export const GradientInput: React.FC<GradientInputProps> = ({
  inputValue = undefined,
  onChangeText = (value:string) => {},
  onEndEditing = () => {},
  onPressSubmit = () => {},
  isValid = true,
  validOuterGradientColors = ["#A4D1E7", "#FDFFFF"],
  validInnerGradientColors = ["#FFFFFF", "#D2EBF5"],
  invalidOuterGradientColors = ["#E5A1A3", "#FFFDFD"],
  invalidInnerGradientColors = ["#FFFFFF", "#F4CFD0"],
  outerViewStyle = null,
  innerViewStyle = null,
  textStyle = null,
  placeholderTextColor = colors.palette.black,
  placeholderText = "",
  autoCapitalize = "none",
  useSecureTextEntry = false
}) => {
  const outerGradientColors = isValid ? validOuterGradientColors : invalidOuterGradientColors
  const innerGradientColors = isValid ? validInnerGradientColors : invalidInnerGradientColors
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={outerGradientColors} style={[styles.outerGradient, outerViewStyle]}>
        <LinearGradient colors={innerGradientColors} style={[styles.innerGradient, innerViewStyle]}>
            <TextInput
              style={[styles.input, textStyle]}
              placeholder={placeholderText}
              placeholderTextColor={placeholderTextColor}
              value={inputValue}
              onChangeText={(newValue) => onChangeText(newValue)}
              onEndEditing={onEndEditing}
              secureTextEntry={useSecureTextEntry}
              autoCapitalize={autoCapitalize}
              editable={isValid}
            />
        </LinearGradient>
    </LinearGradient>
    <GradientButton 
      outerViewStyle={[styles.submitButton]}
      isValid={isValid} 
      validOuterGradientColors={["#FFFFFF", "#8FF550", "#0B6800"]}
      validInnerGradientColors={["#166200", "#166200"]}
      onPress={()=>{onPressSubmit(); Keyboard.dismiss();}}
      innerViewStyle={[{ borderRadius: 125, paddingVertical: 0, marginVertical: 0, height: "100%" }]}
    >
      <Image source={require('../../assets/icons/check_icon.png')} style={styles.icon} />
    </GradientButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "8%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 15
  },
  outerGradient: {
    borderRadius: 40,
    padding: 3,
    width: "80%",
    height: 40,
    marginVertical: 10,
  },
  innerGradient: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  submitButton: {
    borderRadius: 40,
    width: 50,
    height: 40
  },
  icon: {
    width: 30,
    height: 20,
    resizeMode: "contain",
  },
  input: {
    fontSize: 16,
    color: colors.palette.black,
    width: "100%",
    height: 40,
    fontFamily: "BowlbyOneSC-Regular",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: colors.palette.white,
    borderRadius: 75,
  },
})
