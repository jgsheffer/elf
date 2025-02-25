import { StyleSheet, View } from 'react-native';
import { GradientButton } from "./GradientButton";
import { BinaryQuestion } from "../apiResponseTypes/questionType";

interface BinaryGameplayProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  question: BinaryQuestion;
  isValid: boolean;
}

export const BinaryGameplay: React.FC<BinaryGameplayProps> = ({ onQuestionAnswered, question, isValid })=> {
  return (
    <View style={styles.buttonContainer}>
      { question.binaryAnswers?.map((answer, index) => (
        <GradientButton
          isValid={isValid}
          key={answer.id}
          text={answer.value.en as string}
          textStyle={ [ styles.answerText ] }
          outerViewStyle={ [ styles.button ] }
          onPress={() => onQuestionAnswered(answer.id === question.binaryCorrectAnswer)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    width: "100%",
  },
  answerText: {
    fontSize: 15
  },
  button: {
    marginVertical: "1%",
  },
});
