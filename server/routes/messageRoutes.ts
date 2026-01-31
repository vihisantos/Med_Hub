import express from 'express';
import { query } from '../db.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware (TODO: Refactor into shared file)
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

// GET Contacts
// Returns list of users that the current user has a connection with (via job applications)
router.get('/contacts', authenticateToken, async (req: any, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        let sql = '';
        let params: any[] = [];

        if (userRole === 'hospital') {
            // Find professionals (doctors/nurses) who have accepted applications for ANY job from this hospital
            sql = `
                SELECT DISTINCT u.id, u.name, u.role, u.avatar_url
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                JOIN users u ON a.doctor_id = u.id
                WHERE j.hospital_id = $1 AND a.status = 'accepted'
            `;
            params = [userId];
        } else {
            // Find hospitals for which this professional has an accepted application
            sql = `
                SELECT DISTINCT u.id, u.name, u.role, u.avatar_url
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                JOIN users u ON j.hospital_id = u.id
                WHERE a.doctor_id = $1 AND a.status = 'accepted'
            `;
            params = [userId];
        }

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// GET Message History with a specific user
router.get('/:otherUserId', authenticateToken, async (req: any, res) => {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    try {
        const result = await query(
            `SELECT * FROM messages 
             WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1)
             ORDER BY created_at ASC`,
            [userId, otherUserId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST Send Message
router.post('/', authenticateToken, async (req: any, res) => {
    const senderId = req.user.id;
    const { receiver_id, content } = req.body;

    if (!content || !receiver_id) {
        return res.status(400).json({ error: 'Missing content or receiver' });
    }

    try {
        const result = await query(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
            [senderId, receiver_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
