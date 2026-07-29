package com.taskdock.taskdock_api.mappers;

import com.taskdock.taskdock_api.dtos.users.UpdateUserProfileRequest;
import com.taskdock.taskdock_api.dtos.users.UserProfileResponse;
import com.taskdock.taskdock_api.dtos.users.UserResponse;
import com.taskdock.taskdock_api.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  public UserProfileResponse toUserProfileResponse(User user) {
    if (user == null) {
      return null;
    }

    return new UserProfileResponse(
        user.getFullName(),
        user.getAge(),
        user.getEmail(),
        user.getPhoneNumber(),
        user.getProfileImageUrl(),
        user.getCreatedAt(),
        user.getUpdatedAt(),
        user.getStatus());
  }

  public UserResponse toUserResponse(User user) {
    if (user == null) {
      return null;
    }

    return new UserResponse(
        user.getFullName(),
        user.getEmail(),
        Boolean.TRUE.equals(user.getEmailVerified()),
        user.getPhoneNumber(),
        user.getProfileImageUrl(),
        user.getLastLoginAt(),
        user.getCreatedAt(),
        user.getStatus());
  }

  public void updateUserFromRequest(UpdateUserProfileRequest request, User user) {
    if (request == null || user == null) {
      return;
    }

    if (request.fullName() != null) {
      user.setFullName(request.fullName());
    }

    if (request.age() != null) {
      user.setAge(request.age());
    }
  }
}
