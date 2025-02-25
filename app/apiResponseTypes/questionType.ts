import { Translation, TranslationArray } from "./translationType";
import { Category } from "./categoryType";
import { Complexity } from "./complexityType";
import { Asset } from "./assetType";

interface BaseQuestion {
  type: string;
  id: string;
  assets: Asset[];
  category: Category;
  complexity: Complexity;
  hint: Translation;
  title: Translation;
}

export interface FillInTheBlanksQuestion extends BaseQuestion {
  fillInTheBlanksAnswer: Translation;
}

export interface MatchQuestion extends BaseQuestion {
  matchAnswers: {
    en: [string, string][];
    es?: [string, string][];
    fr?: [string, string][];
  } | null;
  matchCorrectAnswer: {
    en: [string, string][];
    es?: [string, string][];
    fr?: [string, string][];
  } | null;
}

export interface CryptogramQuestion extends BaseQuestion {
  cryptogramAnswers: Translation;
  cryptoGramCorrectAnswer: Translation;
}

export interface BinaryQuestion extends BaseQuestion {
  binaryCorrectAnswer: string; // Refers to one of the binaryAnswers.id
  binaryAnswers: {
    id: string;
    value: {
      en: string;
      es: string;
      fr: string;
    };
  }[];
}

export interface MultiChoiceQuestion extends BaseQuestion {
  multichoiceAnswers: ChoiceAnswer[];
  multichoiceCorrectAnswer: string[];
}

export interface SingleChoiceQuestion extends BaseQuestion {
  singleChoiceQuestionAnswers: ChoiceAnswer[];
  singleChoiceQuestionAnswer: string;
}

export interface WordSearchQuestion extends BaseQuestion {
  wordSearchAnswers: TranslationArray;
  wordSearchCorrectAnswer: Translation;
  meta: Record<string, WordSearchMeta>;
}

export interface BinaryAnswer {
  id: string;
  value: Translation;
}

export interface ChoiceAnswer {
  id: string;
  value: Translation;
}

export interface WordSearchMeta {
  coordinates: {
    x: number;
    y: number;
  };
  direction: string;
  length: number;
}

export type Question =
  | FillInTheBlanksQuestion
  | MatchQuestion
  | CryptogramQuestion
  | BinaryQuestion
  | MultiChoiceQuestion
  | SingleChoiceQuestion
  | WordSearchQuestion;
