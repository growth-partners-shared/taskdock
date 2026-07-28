// TYPES
import { AuthResponse } from "@/types";
import { UserStatus } from "@/types/common.types";

export const BASE_URL = "http://localhost:8080/api/v1";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_TOKEN_EXPIRY_KEY = "auth_token_expiry";
const CURRENT_USER_KEY = "current_user";

export const getAuthToken = (): string | null =>
  localStorage.getItem(AUTH_TOKEN_KEY);

export const getAuthTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY);

  return expiry ? Number(expiry) : null;
};

export const setAuthToken = (token: string, expiresAt: string | number) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  const expiry =
    typeof expiresAt === "string" ? new Date(expiresAt).getTime() : expiresAt;

  localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, expiry.toString());
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
};

export const getCurrentUser = (): AuthResponse["user"] | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);

  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: AuthResponse["user"]) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const logout = () => {
  removeAuthToken();
  removeCurrentUser();
};

export const isTokenExpired = (): boolean => {
  const expiry = getAuthTokenExpiry();

  return !!expiry && Date.now() >= expiry;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
export const isUserActive = (): boolean => {
  const user = getCurrentUser();

  return user?.status === UserStatus.ACTIVE;
};

export const getAuthHeaders = (): HeadersInit => {
  if (!isAuthenticated()) {
    return {};
  }

  return {
    Authorization: `Bearer ${getAuthToken()}`,
  };
};
