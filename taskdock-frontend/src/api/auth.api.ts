// TYPES
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginCredentials,
  RegisterResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  SignupRequest,
  VerifyEmailRequest,
  VerifyResetPasswordResponse,
} from "@/types";

// API
import { BASE_URL, getAuthHeaders } from "./common.api";
import { handleError } from "./api.utils";

export const authApi = {
  // Register
  async register(request: SignupRequest): Promise<RegisterResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as RegisterResponse;
  },

  // Verify Email
  async verifyEmail(request: VerifyEmailRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Resend Verification Email
  async resendVerification(request: ResendVerificationRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as AuthResponse;
  },

  // Forgot Password
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Verify Reset Password
  async verifyResetPassword(
    request: VerifyEmailRequest,
  ): Promise<VerifyResetPasswordResponse> {
    const response = await fetch(`${BASE_URL}/auth/verify-reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as VerifyResetPasswordResponse;
  },

  // Reset Password
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },
};
