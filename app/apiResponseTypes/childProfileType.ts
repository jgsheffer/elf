
import { Language } from "./languageType";
import { Character } from "./characterType";
import { UUID, DateString } from "./sharedTypes";

export interface ChildProfile {
  id: UUID;
  firstname: string | null;
  lastname: string | null;
  date_of_birth: DateString;
  avatar_id: string | null;
  character: Character | null;
  preferred_language: Language;
}
