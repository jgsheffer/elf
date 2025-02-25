import { AuthPayload } from "./authPayloadType";
import { RegisterStatuses } from "./registerStatusesType";

export interface AuthResponse {
  tokens: AuthPayload;
  status: RegisterStatuses;
}