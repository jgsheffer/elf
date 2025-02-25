import { Language } from "./languageType";
import { UUID, DateString } from "./sharedTypes";

export interface Profile {
    id: UUID;
    firstname?: string;
    lastname?: string;
    date_of_birth: DateString;
    avatar_id?: string;
    preferred_language: Language;
  }