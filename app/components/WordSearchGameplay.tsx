import { StyleSheet, Text } from 'react-native';
import React, { useState } from "react";
import { GradientInput } from "./GradientInput";
import { WordSearchQuestion } from "../apiResponseTypes/questionType";
import { GradientButton } from "./GradientButton";

interface WordSearchGameplayProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  question: WordSearchQuestion;
  isValid: boolean;
}

export const WordSearchGameplay: React.FC<WordSearchGameplayProps> = ({ onQuestionAnswered, question, isValid=true })=> {
  
  const [inputValue, setInputValue] = useState("");

  return (
      <>
        <GradientButton
        outerViewStyle={[styles.searchTextBg]}
        invalidOuterGradientColors = {["#A4D1E7", "#FDFFFF"]}
        invalidInnerGradientColors = {["#FFFFFF", "#D2EBF5"]}
        isValid={false}
        >
          {question.wordSearchAnswers?.en.map((row, index) => {

            if (!Array.isArray(row)) {
              console.warn(`Row at index ${index} is not an array.`);
              return null; // Skip rendering if it's not an array
            }

            return (
              <Text adjustsFontSizeToFit key={index} style={styles.searchText}>
                {row.join("       ")} {/* Join array elements with extra spaces */}
              </Text>
            );
          })}
      </GradientButton>

      <GradientInput
      inputValue={inputValue}
      placeholderText=""
      onChangeText={(newValue) => setInputValue(newValue)}
      isValid={isValid}
      onPressSubmit={()=>{ 
          const isCorrect = inputValue.toLowerCase() ==
          (question.wordSearchCorrectAnswer.en).toLowerCase()
          onQuestionAnswered(isCorrect)
          if(!isCorrect) 
            setInputValue("")
        }
      }>
      </GradientInput>
    </>
  );
};

const styles = StyleSheet.create({
  searchTextBg: {
    marginVertical: 7 
  },
  searchText: {
    textAlign: "center",
    color: "#000000",
  },
});
