import { View, TextInput, Image, StyleSheet, Keyboard } from 'react-native';
import { GradientButton } from "./GradientButton"
import { useFocusEffect } from '@react-navigation/native'; // Import for handling focus changes
import React, { useRef, useState, useCallback } from "react";

interface LetterInputProps {
  word: string
  onPressSubmit?: (isCorrect: boolean) => void
  isValid: boolean;
}

export const LetterInput: React.FC<LetterInputProps> = ({
  word = "",
  isValid,
  onPressSubmit = (isCorrect: boolean) => {},
}) => {

  // State for storing the input values (letters)
  const [inputs, setInputs] = useState(Array(word.length).fill(''));

  // Refs for each input field to handle focus programmatically
  const inputRefs = useRef<TextInput[]>([]);

  // Handle key press events (for backspace navigation)
  const handleKeyPress = (event: any, index: number) => { // Added this function
    if (event.nativeEvent.key === "Backspace") { // Detect backspace key press
      const updatedInputs = [...inputs];
      
      // Clear the current input
      updatedInputs[index] = ""; // Clear current input
      setInputs(updatedInputs);

      // Move focus to the previous input if not the first one
      if (index > 0) { // Added check to ensure we don't go out of bounds
        inputRefs.current[index - 1].focus(); // Move focus to the previous input
      }
    }
  };

  const handleInputChange = (text: string, index: number) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = text.toUpperCase().slice(0, 1); // Always override with the first character
    setInputs(updatedInputs);
  
    // Move focus to the next input if the current one is filled
    if (text && index < word.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setInputs(Array(word.length).fill(''));
      return () => {
        setInputs(Array(word.length).fill(''));
      };
    }, [word])
  );
  const setInputRef = useCallback((ref: TextInput | null, index: number) => {
    if (ref) {
      inputRefs.current[index] = ref;
    }
  }, []);

  const renderWord = () => {
    return inputs.map((letter, index) => (
      <TextInput
        key={index}
        style={styles.input}
        value={letter}
        onChangeText={(text) => handleInputChange(text, index)}
        onKeyPress={(event) => handleKeyPress(event, index)}
        autoCapitalize="characters"
        keyboardType="default"
        ref={(ref: TextInput) => setInputRef(ref, index)}
        editable={isValid}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        {renderWord()}
      </View>
      <GradientButton 
        outerViewStyle={[styles.submitButton]}
        isValid={isValid} 
        validOuterGradientColors={["#FFFFFF", "#8FF550", "#0B6800"]}
        validInnerGradientColors={["#166200", "#166200"]}
        onPress={()=>{
          Keyboard.dismiss();
          const isCorrect = inputs.join('').toLowerCase() === word.toLowerCase()
          onPressSubmit(isCorrect)
          if(!isCorrect)
          {
            setInputs(Array(word.length).fill(''))
          }
        }}
        innerViewStyle={[{ borderRadius: 125, paddingVertical: 0, marginVertical: 0, height: "100%" }]}
      >
      <Image source={require('../../assets/icons/check_icon.png')} style={styles.icon} />
    </GradientButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 27,
    height: 35,
    marginHorizontal: 1,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: "white",
    fontSize: 24,
    padding: 1,
    margin: 10,
    fontWeight: 'bold',
  },
  submitButton: {
    borderRadius: 40,
    width: 300,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
