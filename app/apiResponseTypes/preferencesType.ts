import { UUID } from "./sharedTypes";

export interface Preferences {
  id: UUID;
  enable_haptics: boolean;
  enable_sounds: boolean;
  enable_notification: boolean;
}