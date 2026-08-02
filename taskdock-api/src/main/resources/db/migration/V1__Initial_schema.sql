CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,
    age INTEGER,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verification_code VARCHAR(6),
    email_verification_expiry TIMESTAMP WITH TIME ZONE,

    password_reset_code VARCHAR(6),
    password_reset_expiry TIMESTAMP WITH TIME ZONE,

    password_reset_token VARCHAR(100),
    password_reset_token_expiry TIMESTAMP WITH TIME ZONE,

    phone_number VARCHAR(10) NOT NULL,

    profile_image_url VARCHAR(500),
    profile_image_public_id VARCHAR(255),

    last_login_at TIMESTAMP WITH TIME ZONE,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE boards (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),

    color VARCHAR(20) NOT NULL,

    starred BOOLEAN NOT NULL DEFAULT FALSE,

    owner_id BIGINT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_boards_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_board_owner_name
        UNIQUE(owner_id, name)
);

CREATE TABLE board_lists (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    position INTEGER NOT NULL,

    board_id BIGINT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_board_lists_board
        FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_board_list_name
        UNIQUE(board_id, name),

    CONSTRAINT uk_board_list_position
        UNIQUE(board_id, position)
);

CREATE TABLE board_members (
    id BIGSERIAL PRIMARY KEY,

    board_id BIGINT NOT NULL,

    user_id BIGINT NOT NULL,

    role VARCHAR(20) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_board_members_board
        FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_board_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_board_member
        UNIQUE(board_id, user_id)
);

CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    description VARCHAR(5000),

    priority VARCHAR(20) NOT NULL,

    due_date TIMESTAMP NOT NULL,

    position INTEGER NOT NULL,

    board_list_id BIGINT NOT NULL,

    assignee_id BIGINT,

    created_by BIGINT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_tasks_board_list
        FOREIGN KEY (board_list_id)
        REFERENCES board_lists(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_assignee
        FOREIGN KEY (assignee_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_tasks_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    CONSTRAINT uk_task_position
        UNIQUE(board_list_id, position)
);

CREATE TABLE notifications (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    recipient_email VARCHAR(255) NOT NULL,

    recipient_name VARCHAR(255),

    subject VARCHAR(200) NOT NULL,

    content TEXT NOT NULL,

    channel VARCHAR(20) NOT NULL,

    type VARCHAR(40) NOT NULL,

    status VARCHAR(20) NOT NULL,

    provider_message_id VARCHAR(255),

    sent_at TIMESTAMP,

    error_message VARCHAR(500),

    created_at TIMESTAMPTZ NOT NULL,

    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_boards_owner
ON boards(owner_id);

CREATE INDEX idx_board_lists_board
ON board_lists(board_id);

CREATE INDEX idx_board_members_board
ON board_members(board_id);

CREATE INDEX idx_board_members_user
ON board_members(user_id);

CREATE INDEX idx_tasks_board_list
ON tasks(board_list_id);

CREATE INDEX idx_tasks_assignee
ON tasks(assignee_id);

CREATE INDEX idx_tasks_created_by
ON tasks(created_by);

CREATE INDEX idx_notifications_rate_limit
ON notifications (
    user_id,
    channel,
    type,
    status,
    created_at
);