import { useNavigation } from "@react-navigation/native";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { GradientButton } from "../components/GradientButton";
import { IconInCircle } from "../components/IconInCircle";
import { ButtonsHeader } from "../components/ButtonsHeader";
import LinearGradient from "react-native-linear-gradient";
import { useState } from "react";
import { SingleChoiceQuestion } from "app/apiResponseTypes";

const { width, height } = Dimensions.get('window');

interface LocationGuessPanelProps 
{
  onLocationGuessSelection: (guessId: string) => void;
  question: SingleChoiceQuestion
}

export const LocationGuessPanel = ({ onLocationGuessSelection, question }: LocationGuessPanelProps) => {
  const navigation = useNavigation();
  const [locationGuess, setLocationGuessSelection] = useState("");

  return (
    <View style={styles.container}>
      <ButtonsHeader
        imageSourceLeftButton={require("../../assets/icons/home_icon.png")}
        imageSourceRightButton={null}
        onPressLeft={() => navigation.navigate("Calendar")}
      />
        <LinearGradient colors={["#021249CC", "#116ABFCC", "#0065DBCC", "#229DFFCC"]}>
          <View style={styles.guessContainer}>
            <Text style={styles.finalDescription}>{question.title.en}</Text>
            <View style={styles.buttonsContainer}>
              {question.singleChoiceQuestionAnswers.map((location, index) => (
                <View key={index} style={styles.buttonContainer}>
                  <GradientButton 
                    text={location.value.en} 
                    textStyle={[styles.finalAnswerText]} 
                    outerViewStyle={[styles.finalAnswerButton]}
                    validOuterGradientColors={locationGuess === location.id ? (locationGuess === question.singleChoiceQuestionAnswer ? ["#00FF00", "#00FF00"] :  ["#FF0000", "#FF0000"]) : ["#A4D1E7", "#FDFFFF"]}
                    onPress={() => {setLocationGuessSelection(location.id); onLocationGuessSelection(location.id)}}
                  />
                  {locationGuess === location.id && (
                    <IconInCircle
                      style={[styles.finalGuessIcon, { width: width * 0.1, height: height * 0.1 }]}
                      imageSource={locationGuess === question.singleChoiceQuestionAnswer ? require("../../assets/icons/check_icon.png") : require("../../assets/icons/x_icon.png")}
                      backgroundColor={locationGuess === question.singleChoiceQuestionAnswer ? "#00FF00" : "#FF0000"}
                      diameter="10%"
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  guessContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    top: "-10%",
    flexShrink: 1,
  },
  finalAnswerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  finalAnswerButton: {
    width: "80%",
    marginVertical: "1%",
  },
  finalGuessIcon:{
    resizeMode:"contain",
    position: 'absolute',
    top: "-10%",
    right: "6%"
  },
  finalDescription: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: "8%",
    width: "80%"
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
  },
  buttonsContainer: {
    alignItems: "center",
    width: "100%",
  },
});