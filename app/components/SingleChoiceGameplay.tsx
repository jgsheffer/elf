import { StyleSheet, View } from 'react-native';
import { GradientButton } from "./GradientButton";
import { SingleChoiceQuestion } from "../apiResponseTypes/questionType";

interface SingleChoiceGameplayProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  question: SingleChoiceQuestion;
  isValid: boolean;
}

export const SingleChoiceGameplay: React.FC<SingleChoiceGameplayProps> = ({ onQuestionAnswered, question, isValid })=> {
  return (
    <View style={styles.buttonContainer}>
      { question.singleChoiceQuestionAnswers?.map((answer, index) => (
        <GradientButton
          key={answer.id}
          text={answer.value.en as string}
          textStyle={ [ styles.answerText ] }
          outerViewStyle={ [ styles.button ] }
          isValid={isValid}
          onPress={() => onQuestionAnswered(answer.id === question.singleChoiceQuestionAnswer)}
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
