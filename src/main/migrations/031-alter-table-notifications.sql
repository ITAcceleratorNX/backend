ALTER TABLE notifications
DROP COLUMN user_id;
ALTER TABLE notifications
DROP COLUMN is_read;
ALTER TABLE notifications
ADD COLUMN for_all BOOLEAN DEFAULT FALSE;
CREATE TABLE user_notifications (
                                    id SERIAL PRIMARY KEY,
                                    user_id INTEGER NOT NULL REFERENCES users(id),
                                    notification_id INTEGER NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
                                    is_read BOOLEAN DEFAULT FALSE
);
