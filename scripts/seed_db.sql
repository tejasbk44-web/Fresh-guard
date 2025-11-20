-- Script to seed initial data (optional)
-- Run this after creating tables to test the app

-- Create a test user (password: test123456)
INSERT INTO users (email, name, password_hash) VALUES 
  ('test@example.com', 'Test User', '$2a$12$example_hash_here');

-- Note: Replace the password_hash with an actual bcryptjs hash of 'test123456'
-- You can generate it using: bcryptjs.hashSync('test123456', 12)
