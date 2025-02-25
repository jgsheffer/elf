import { User } from "./userType";

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}
