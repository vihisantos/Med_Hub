import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/authRoutes.ts';
import jobRoutes from './routes/jobRoutes.ts';
import applicationRoutes from './routes/applicationRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import documentRoutes from './routes/documentRoutes.ts';
import messageRoutes from './routes/messageRoutes.ts';
import { query } from './db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Med Hub Backend Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

// Initialize DB
const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await query(schemaSql);
            console.log('Database schema initialized');

            // Migrations for new fields and column normalization
            await query(`
                DO $$ 
                BEGIN 
                    -- Rename password_hash to password if it exists
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
                        ALTER TABLE users RENAME COLUMN password_hash TO password;
                    END IF;

                    -- Add new columns if they don't exist
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
                        ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
                        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='bio') THEN
                        ALTER TABLE users ADD COLUMN bio TEXT;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='specialties') THEN
                        ALTER TABLE users ADD COLUMN specialties TEXT;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='experiences') THEN
                        ALTER TABLE users ADD COLUMN experiences TEXT;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location') THEN
                        ALTER TABLE users ADD COLUMN location VARCHAR(255);
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='registration') THEN
                        ALTER TABLE users ADD COLUMN registration VARCHAR(100);
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='specialty') THEN
                        ALTER TABLE users ADD COLUMN specialty VARCHAR(100);
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_verified') THEN
                        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_tier') THEN
                        ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'free';
                    END IF;
                END $$;
            `);
            console.log('Database migrations completed');
        } else {
            console.log('Schema file not found, skipping auto-init');
        }
    } catch (err) {
        console.error('Error initializing database schema:', err);
    }
};

app.listen(PORT, async () => {
    await initDb();
    console.log(`Server running on http://localhost:${PORT}`);
});
