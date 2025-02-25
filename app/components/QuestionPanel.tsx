import React, { useState, useContext, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { GradientContainer } from "../components/GradientContainer";
import { WordSearchGameplay } from "./WordSearchGameplay";
import { FillInTheBlanksGameplay } from "./FillInTheBlanksGameplay";
import { MatchGameplay } from "../components/MatchGameplay";
import { CryptogramGameplay } from "./CryptogramGameplay";
import { MultiChoiceGameplay } from "./MultiChoiceGameplay";
import { View, Image, Text, Dimensions, StyleSheet } from "react-native";
import { GradientButton } from "./GradientButton";
import Video from "react-native-video";
import { AuthContext } from "../contexts/AuthContext"
import { BinaryQuestion, CryptogramQuestion, FillInTheBlanksQuestion, MatchQuestion, MultiChoiceQuestion, Question, SingleChoiceQuestion, WordSearchQuestion } from "../apiResponseTypes/questionType";
import { BinaryGameplay } from "./BinaryGameplay";
import { SingleChoiceGameplay } from "./SingleChoiceGameplay";

const { width, height } = Dimensions.get("window");

interface QuestionPanelProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  isSubmitButtonValid: boolean
  question: Question
  questionNumber: number;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ onQuestionAnswered, questionNumber, question, isSubmitButtonValid }) => {
  const navigation = useNavigation();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isInvalidAsset, setIsInvalidAsset] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  
  const getTitle = () => {

    const type = question.type.toUpperCase();
    if(type === "WORD_SEARCH")
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        Find and Enter The Hidden Word
      </Text>
    }
    else if(type === "CRYPTOGRAM")
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        Enter The Unscrambled Word
      </Text>
    }
    else if(type === "FILL_IN_THE_BLANKS")
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        Enter The Missing Word
      </Text>
    }
    else if(type === "MATCH")
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        Drag Items To Their Match
      </Text>
    }
    else if(type === "MULTI_CHOICE")
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        Answer The Question
      </Text>
    }
    else if(type === "SINGLE_CHOICE")
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        Answer The Question
      </Text>
    }
    else if(type === "BINARY")
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        True or False
      </Text>
    }
    else
    {
      return <Text adjustsFontSizeToFit style={styles.title}>
        {question.type}
      </Text>
    }
  };

  const renderAsset = () => {
    if (isInvalidAsset) {
      const suggestions = question.assets
        ?.filter((asset) => asset.type?.toLowerCase() === "video" || asset.type?.toLowerCase() === "image")
        .map((asset) => asset.suggestion?.en || "Unknown")
        .join("\n");
  
      return <Text style={styles.errorText}>Missing Assets{"\n\n"}[{suggestions}]</Text>;
    }
  
    const validAssets = question.assets?.filter(
      (asset) => asset.type?.toLowerCase() === "video" || asset.type?.toLowerCase() === "image"
    );

    if (!validAssets || validAssets.length === 0) {

      setIsInvalidAsset(true);
      return null; // No valid assets, return nothing
    }
  
    return validAssets.map((asset, index) => {
      if (asset.type.toLowerCase() === "video") {
        return (
          <Video
            key={index}
            source={
              asset?.url
                ? { uri: asset.url }
                : require("../../assets/images/bkg-gradient.png")
            }
            style={styles.video}
            paused={!isVideoPlaying}
            controls={true}
            onEnd={() => setIsVideoPlaying(false)}
            onError={() => setIsInvalidAsset(true)} // Handle invalid video URI
          />
        );
      } else if (asset.type.toLowerCase() === "image") {
        return (
          <Image
            key={index}
            style={styles.image}
            source={
              asset?.url
                ? { uri: asset.url }
                : require("../../assets/images/bkg-gradient.png")
            }
            onError={() => setIsInvalidAsset(true)} // Handle invalid image URI
          />
        );
      }
      return null; // Ignore unsupported asset types
    });
  };

  return (
    <GradientContainer
      imageSource={null}
      imageSourceLeftButton={require("../../assets/icons/home_icon.png")}
      imageSourceRightButton={null}
      iosKeyboardAvoidingViewBehavior="position"
      onPressLeft={() => isLoggedIn ? navigation.navigate("Calendar") : navigation.navigate("Welcome")}
      topOuterChildren={
        <GradientButton
          text={`Fact #${questionNumber+1}`}
          isValid={false}
          textStyle={[styles.factText]}
          outerViewStyle={[styles.factButton]}
          invalidInnerGradientColors={["#00386C", "#0761B5"]}
          invalidOuterGradientColors={["#228DEF", "#023F78"]}
        />
      }
    >
      <View style={styles.questionContainer}>
        { getTitle() }
        { renderAsset() }

        <Text adjustsFontSizeToFit style={styles.description}>
          {question.title.en}
        </Text>

      {question.type.toUpperCase() == "CRYPTOGRAM" &&
        <CryptogramGameplay
          question={question as CryptogramQuestion}
          onQuestionAnswered={onQuestionAnswered}
          isValid={isSubmitButtonValid}
        />
      }

      { question.type.toUpperCase() == "WORD_SEARCH" && (
        <WordSearchGameplay 
          question={question as WordSearchQuestion}
          onQuestionAnswered={onQuestionAnswered}
          isValid={isSubmitButtonValid}
        />
      )}

      { question.type.toUpperCase() == "FILL_IN_THE_BLANKS" &&
        <FillInTheBlanksGameplay
          question={question as FillInTheBlanksQuestion}
          onQuestionAnswered={onQuestionAnswered}
          isValid={isSubmitButtonValid}
        />
      }

      { question.type.toUpperCase() === "MATCH" && (
        <MatchGameplay 
          question={question as MatchQuestion}
          onQuestionAnswered={onQuestionAnswered}
        />
      )}
      
      {(question.type.toUpperCase() === "MULTI_CHOICE") && (
        <MultiChoiceGameplay
          question={question as MultiChoiceQuestion}
          onQuestionAnswered={onQuestionAnswered}
          isValid={isSubmitButtonValid}
        />
      )}

      {(question.type.toUpperCase() === "SINGLE_CHOICE") && (
        <SingleChoiceGameplay
          question={question as SingleChoiceQuestion}
          onQuestionAnswered={onQuestionAnswered}
          isValid={isSubmitButtonValid}
        />
      )}

      {(question.type.toUpperCase() === "BINARY") && (
        <BinaryGameplay
          question={question as BinaryQuestion}
          onQuestionAnswered={onQuestionAnswered}
          isValid={isSubmitButtonValid}
        />
      )}
      </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    width: "100%",
    alignItems: "center",
    flexShrink: 1,
  },
  scrambleTextContainer: {

  },
  image: {
    resizeMode: "contain",
    width: width*.9,
    height: height * 0.28,
  },
  video: {
    width: width*.9,
    height: height * 0.25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    marginBottom: "4%"
  },
  errorText:{
    fontSize: 18,
    textAlign: "center",
    color: "#000000",
    margin: 30,
    width: width*.9,
    height: height * 0.28,
  },
  scrambleTextBg: {
    marginVertical: 7 
  },
  scrambleText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 24,
  },
  searchText: {
    textAlign: "center",
    color: "#000000",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#000000",
    marginVertical: "5%",
  },
  factText: {
    fontFamily: "BowlbyOneSC-Regular",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  factButton: {
    width: "40%",
    top: "-10%",
    right: "4%",
    zIndex: 10,
    position: "absolute",
  },

});
