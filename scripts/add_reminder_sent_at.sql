-- Add reminder_sent_at column to items table for tracking expiry reminders
ALTER TABLE items ADD COLUMN reminder_sent_at TIMESTAMP;
CREATE INDEX idx_items_reminder_sent_at ON items(reminder_sent_at) WHERE reminder_sent_at IS NOT NULL;
