import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../db.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to authenticate token (Copied/Adapted if not exported)
// TODO: Refactor into shared middleware file if needed
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Null token' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Token invalid' });
        req.user = user;
        next();
    });
};

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET Current User
router.get('/me', authenticateToken, async (req: any, res) => {
    try {
        const result = await query(
            'SELECT id, name, email, role, avatar_url, registration, specialty, location, phone, bio, specialties, experiences, is_verified, subscription_tier FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /me Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE User (Text Data)
router.put('/me', authenticateToken, async (req: any, res) => {
    const {
        name, registration, location, phone, bio,
        specialties, experiences, password, confirmPassword
    } = req.body;

    try {
        let updateFields = ['name = $1', 'registration = $2', 'location = $3', 'phone = $4', 'bio = $5', 'specialties = $6', 'experiences = $7'];
        let params = [
            name,
            registration,
            location,
            phone,
            bio,
            Array.isArray(specialties) ? JSON.stringify(specialties) : (specialties || '[]'),
            Array.isArray(experiences) ? JSON.stringify(experiences) : (experiences || '[]')
        ];
        let paramIndex = 8;

        if (password) {
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.push(`password = $${paramIndex}`);
            params.push(hashedPassword);
            paramIndex++;
        }

        const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, role, avatar_url, registration, location, phone, bio, specialties, experiences, is_verified, subscription_tier`;
        params.push(req.user.id);

        const result = await query(updateQuery, params);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /me Error:', err);
        res.status(500).json({ error: 'Update failed' });
    }
});

// UPLOAD Avatar
router.post('/me/avatar', authenticateToken, upload.single('avatar'), async (req: any, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const avatarUrl = `/uploads/${req.file.filename}`;
        await query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatarUrl, req.user.id]);
        res.json({ avatar_url: avatarUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Avatar upload failed' });
    }
});

export default router;
