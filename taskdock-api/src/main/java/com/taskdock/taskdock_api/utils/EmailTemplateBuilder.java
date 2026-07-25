package com.taskdock.taskdock_api.utils;

import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.Task;
import com.taskdock.taskdock_api.entities.User;
import org.springframework.stereotype.Component;

@Component
public class EmailTemplateBuilder {

  public String buildWelcomeTemplate(User user) {

    return """
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:40px;background:#f5f7fb;font-family:Arial,sans-serif;">

        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e5e7eb;">

            <h2 style="margin-top:0;color:#2563eb;">
                Welcome to TaskDock 🎉
            </h2>

            <p>Hi <strong>%s</strong>,</p>

            <p>
                Your TaskDock account has been verified successfully.
            </p>

            <p>
                You can now create boards, collaborate with your team,
                assign tasks and manage projects efficiently.
            </p>

            <br>

            <p>
                Happy Productivity 🚀
            </p>

            <p>
                <strong>TaskDock Team</strong>
            </p>

        </div>

        </body>
        </html>
        """
        .formatted(user.getFullName());
  }

  public String buildBoardInvitationTemplate(User invitedUser, User invitedBy, Board board) {

    return """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:40px;background:#f5f7fb;font-family:Arial,sans-serif;">

                <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e5e7eb;">

                    <h2 style="margin-top:0;color:#2563eb;">
                        You've been added to a Board
                    </h2>

                    <p>Hi <strong>%s</strong>,</p>

                    <p>
                        <strong>%s</strong> has added you to the board
                        <strong>%s</strong>.
                    </p>

                    <p>
                        Login to TaskDock to start collaborating with your team.
                    </p>

                    <br>

                    <p>
                        Happy Collaboration 🤝
                    </p>

                    <p>
                        <strong>TaskDock Team</strong>
                    </p>

                </div>

                </body>
                </html>
                """
        .formatted(invitedUser.getFullName(), invitedBy.getFullName(), board.getName());
  }

  public String buildTaskAssignedTemplate(User assignee, User assignedBy, Task task) {

    return """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:40px;background:#f5f7fb;font-family:Arial,sans-serif;">

            <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e5e7eb;">

                <h2 style="color:#2563eb;margin-top:0;">
                    📌 New Task Assigned
                </h2>

                <p>Hi <strong>%s</strong>,</p>

                <p>
                    <strong>%s</strong> has assigned a task to you in
                    <strong>%s</strong>.
                </p>

                <div style="margin:24px 0;padding:18px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;">

                    <p style="margin:8px 0;"><strong>Board</strong><br>%s</p>

                    <p style="margin:8px 0;"><strong>List</strong><br>%s</p>

                    <p style="margin:8px 0;"><strong>Task</strong><br>%s</p>

                    <p style="margin:8px 0;"><strong>Priority</strong><br>%s</p>

                    <p style="margin:8px 0;"><strong>Due Date</strong><br>%s</p>

                </div>

                <p>
                    Please log in to TaskDock to view the task and start working on it.
                </p>

                <br>

                <p>Happy Productivity 🚀</p>

                <p>
                    <strong>TaskDock Team</strong>
                </p>

            </div>

            </body>
            </html>
            """
        .formatted(
            assignee.getFullName(),
            assignedBy.getFullName(),
            task.getBoardList().getBoard().getName(),
            task.getBoardList().getBoard().getName(),
            task.getBoardList().getName(),
            task.getTitle(),
            task.getPriority(),
            task.getDueDate());
  }

  public String buildEmailVerificationTemplate(User user) {

    return """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:40px;background:#f5f7fb;font-family:Arial,sans-serif;">

            <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e5e7eb;">

                <h2 style="margin-top:0;color:#2563eb;">
                    Verify Your Email ✉️
                </h2>

                <p>Hi <strong>%s</strong>,</p>

                <p>
                    Thanks for signing up for <strong>TaskDock</strong>.
                </p>

                <p>
                    Please use the verification code below to activate your account.
                </p>

                <div style="
                    margin:32px 0;
                    padding:18px;
                    background:#eff6ff;
                    border:1px dashed #2563eb;
                    border-radius:10px;
                    text-align:center;
                ">
                    <span style="
                        font-size:34px;
                        font-weight:bold;
                        letter-spacing:8px;
                        color:#2563eb;
                    ">
                        %s
                    </span>
                </div>

                <p>
                    This verification code is valid for
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create a TaskDock account, you can safely ignore this email.
                </p>

                <br>

                <p>
                    Happy Productivity 🚀
                </p>

                <p>
                    <strong>TaskDock Team</strong>
                </p>

            </div>

            </body>
            </html>
            """
        .formatted(user.getFullName(), user.getEmailVerificationCode());
  }
}
