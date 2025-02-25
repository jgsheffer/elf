import { StyleSheet, View } from 'react-native';
import { GradientButton } from "./GradientButton";
import { MultiChoiceQuestion } from "../apiResponseTypes/questionType";

interface MultiChoiceGameplayProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  question: MultiChoiceQuestion;
  isValid: boolean;
}

export const MultiChoiceGameplay: React.FC<MultiChoiceGameplayProps> = ({ onQuestionAnswered, question, isValid })=> {
  return (
    <View style={styles.buttonContainer}>
      { question.multichoiceAnswers?.map((answer, index) => (
        <GradientButton
          key={answer.id}
          text={answer.value.en as string}
          textStyle={ [ styles.answerText ] }
          outerViewStyle={ [ styles.button ] }
          isValid={isValid}
          onPress={() => onQuestionAnswered(answer.id === question.multichoiceCorrectAnswer[0])}
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
