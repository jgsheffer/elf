import { LetterInput } from "./LetterInput";
import { FillInTheBlanksQuestion } from "../apiResponseTypes/questionType";

interface FillInTheBlanksGameplayProps {
  onQuestionAnswered: ( isCorrectAnswer : boolean ) => void;
  question: FillInTheBlanksQuestion;
  isValid: boolean;
}

export const FillInTheBlanksGameplay: React.FC<FillInTheBlanksGameplayProps> = ({ onQuestionAnswered, question, isValid })=> {
  return (
    <LetterInput
      word = {question.fillInTheBlanksAnswer.en}
      isValid={isValid}
      onPressSubmit={(isCorrect: boolean)=>{onQuestionAnswered(isCorrect)
      }}
    />
  );
};
