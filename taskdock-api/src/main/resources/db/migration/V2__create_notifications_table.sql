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

CREATE INDEX idx_notifications_rate_limit
ON notifications (
    user_id,
    channel,
    type,
    status,
    created_at
);