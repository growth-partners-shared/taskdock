// TYPES
import { UserStatus } from "./common.types";

export interface UpdateUserProfileRequest {
  fullName?: string;
  age?: number;
}

export interface UserProfileResponse {
  fullName: string;
  age?: number;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: UserStatus;
}

export interface UserResponse {
  fullName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  profileImageUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  status: UserStatus;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
