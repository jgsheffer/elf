import { Coordinates } from "./coordinatesType";
import { Translation } from "./translationType";
import { Country } from "./countryType";
import { Question } from "./questionType";
import { Asset } from "./assetType";
import { CompletedQuestion } from "./completedQuestionType";

export interface Level {
  coordinates: Coordinates;
  country: Country;
  id: string;
  intro: Translation;
  name: Translation;
  questions: Question[];
  assets: Asset[];
  scheduledAt : string;
  completedQuestions : CompletedQuestion[];
  isAvailable: boolean;
  recapDescription: Translation;
}