import { Translation } from "./translationType";

export interface Asset {
  id: string;
  path: string;
  role: string;
  type: string;
  url: string;
  description: string;
  suggestion: Translation;
}