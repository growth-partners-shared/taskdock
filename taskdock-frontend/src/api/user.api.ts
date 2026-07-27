// TYPES
import {
  ChangePasswordRequest,
  UpdateUserProfileRequest,
  UserProfileResponse,
} from "@/types";

// API
import { BASE_URL, getAuthHeaders } from "./common.api";
import { handleError } from "./api.utils";

export const userApi = {
  // Get Profile
  async getProfile(): Promise<UserProfileResponse> {
    const response = await fetch(`${BASE_URL}/account`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as UserProfileResponse;
  },

  // Update Profile
  async updateProfile(
    request: UpdateUserProfileRequest,
  ): Promise<UserProfileResponse> {
    const response = await fetch(`${BASE_URL}/account`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as UserProfileResponse;
  },

  // Change Password
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/account/change-password`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Upload Profile Image
  async uploadProfileImage(file: File): Promise<UserProfileResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/account/profile-image`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as UserProfileResponse;
  },

  // Delete Profile Image
  async deleteProfileImage(): Promise<void> {
    const response = await fetch(`${BASE_URL}/account/profile-image`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Delete Account
  async deleteAccount(): Promise<void> {
    const response = await fetch(`${BASE_URL}/account`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },
};
