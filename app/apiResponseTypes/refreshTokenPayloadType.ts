

// Refresh Token Payload
export interface RefreshTokenPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}