package com.taskdock.taskdock_api.services;

import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.Task;
import com.taskdock.taskdock_api.entities.User;

public interface NotificationService {

    /**
     * Sends an email verification notification to a newly
     * registered user.
     *
     * @param registeredUser newly registered user
     */
    void sendEmailVerificationNotification(User registeredUser);

    /**
     * Sends a welcome notification after the user has
     * successfully verified their email.
     *
     * @param user verified user
     */
    void sendUserWelcomeNotification(User user);

    /**
     * Sends a notification informing a user that they have
     * been added to a board.
     *
     * @param invitedUser recipient of the notification
     * @param invitedBy user who added the member
     * @param board board to which the user was added
     */
    void sendBoardInvitation(
            User invitedUser,
            User invitedBy,
            Board board
    );

    /**
     * Sends a notification informing a user that a task
     * has been assigned to them.
     *
     * @param assignee user assigned to the task
     * @param assignedBy user who assigned the task
     * @param task assigned task
     */
    void sendTaskAssignedNotification(
            User assignee,
            User assignedBy,
            Task task
    );
}