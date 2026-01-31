-- Password is '631330' hashed with bcrypt
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin Vitor', 'adm-vitor@capybaraholding.com', '$2a$10$YourHashedPasswordHerePleaseGenerateOne', 'admin')
ON CONFLICT (email) DO NOTHING;
-- Note: You need to generate a real bcrypt hash for '631330' and replace the placeholder above if you run this manually. 
-- The TypeScript seeder does this automatically.
