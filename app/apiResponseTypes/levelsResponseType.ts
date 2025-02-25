import { Level } from "./levelType";

export interface LevelsResponse {
  data: {
    getLevels: Level[];
  };
}