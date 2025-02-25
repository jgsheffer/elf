import { StyleSheet, Text } from 'react-native';
import React, { useState } from "react";
import { GradientInput } from "./GradientInput";
import { GradientButton } from "./GradientButton";
import { CryptogramQuestion } from "app/apiResponseTypes";

interface CryptogramGameplayProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  question: CryptogramQuestion;
  isValid: boolean;
}

export const CryptogramGameplay: React.FC<CryptogramGameplayProps> = ({ onQuestionAnswered, question, isValid })=> {
  const [ inputValue, setInputValue ] = useState("");

  return (
    <>
      <GradientButton
        outerViewStyle={[styles.scrambleTextBg]}
        invalidOuterGradientColors = {["#A4D1E7", "#FDFFFF"]}
        invalidInnerGradientColors = {["#FFFFFF", "#D2EBF5"]}
        isValid={false}
      >
        <Text adjustsFontSizeToFit style={styles.scrambleText}>
          {question.cryptogramAnswers?.en.split(',').join(' ')}
        </Text>
      </GradientButton>

      <GradientInput
        inputValue={inputValue}
        placeholderText=""
        onChangeText={(newValue) => setInputValue(newValue)}
        isValid={isValid}
        onPressSubmit={()=>{ 
          const isCorrect = inputValue.toLowerCase() == (question.cryptoGramCorrectAnswer.en).toLowerCase()
          onQuestionAnswered(isCorrect)
          if(!isCorrect)
            setInputValue("")
          }}>
      </GradientInput>
    </>
  );
};

const styles = StyleSheet.create({
  scrambleTextBg: {
    marginVertical: 7 
  },
  scrambleText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 24,
  },
});
