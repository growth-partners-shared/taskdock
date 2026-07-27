package com.taskdock.taskdock_api.services;

import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.Task;
import com.taskdock.taskdock_api.entities.User;

public interface EmailService {

  /**
   * Sends an email containing the verification code required to activate a newly registered user's
   * account.
   *
   * @param registeredUser newly registered user
   */
  void sendEmailVerificationEmail(User registeredUser);

  /**
   * Sends a welcome email after the user has successfully verified their email and activated their
   * TaskDock account.
   *
   * @param user verified user
   */
  void sendWelcomeEmail(User user);

  /**
   * Sends an email notifying a user that they have been added as a member to a board by another
   * user.
   *
   * <p>The email includes:
   *
   * <ul>
   *   <li>Inviter's name
   *   <li>Board name
   * </ul>
   *
   * @param invitedUser recipient of the email
   * @param invitedBy user who added the member
   * @param board board to which the user was added
   */
  void sendBoardInvitationEmail(User invitedUser, User invitedBy, Board board);

  /**
   * Sends an email notifying a user that a task has been assigned to them.
   *
   * <p>The email includes:
   *
   * <ul>
   *   <li>Board name
   *   <li>Board list name
   *   <li>Task title
   *   <li>Task priority
   *   <li>Task due date
   *   <li>Assigner's name
   * </ul>
   *
   * @param assignee user assigned to the task
   * @param assignedBy user who assigned the task
   * @param task assigned task
   */
  void sendTaskAssignedEmail(User assignee, User assignedBy, Task task);

  /**
   * Sends an email containing a one-time verification code required to verify the user's identity
   * before allowing a password reset.
   *
   * @param user user requesting a password reset
   */
  void sendResetPasswordVerificationEmail(User user);
}
