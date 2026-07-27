// TYPES
import { UserResponse } from "./user.types";
import { UserStatus } from "./common.types";

export interface SignupRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  emailVerified: boolean;
  status: UserStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string; // Instant
  user: UserResponse;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetPasswordResponse {
  resetToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}
