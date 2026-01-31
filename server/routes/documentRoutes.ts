import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

// Multer Config for Documents
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// UPLOAD Document (Hospital sends to Doctor/Nurse)
router.post('/upload', authenticateToken, upload.single('document'), async (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { user_id, month, file_name } = req.body;

    // Authorization check: Only Hospital or Admin can upload
    if (req.user.role !== 'hospital' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const fileUrl = `/uploads/documents/${req.file.filename}`;
        const result = await query(
            'INSERT INTO documents (uploader_id, user_id, file_url, file_name, month) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, user_id, fileUrl, file_name || req.file.originalname, month]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// GET My Documents (Doctor/Nurse)
router.get('/mine', authenticateToken, async (req: any, res) => {
    try {
        const result = await query(
            `SELECT d.*, u.name as uploader_name 
             FROM documents d 
             JOIN users u ON d.uploader_id = u.id 
             WHERE d.user_id = $1 
             ORDER BY d.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fetch failed' });
    }
});

// GET Sent Documents (Hospital)
router.get('/sent', authenticateToken, async (req: any, res) => {
    try {
        const result = await query(
            `SELECT d.*, u.name as recipient_name 
             FROM documents d 
             JOIN users u ON d.user_id = u.id 
             WHERE d.uploader_id = $1 
             ORDER BY d.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fetch failed' });
    }
});

// GET List of my Employees (Professionals accepted in jobs)
// Helper to populate the dropdown for Hospitals
router.get('/my-employees', authenticateToken, async (req: any, res) => {
    try {
        // Find users who have an 'accepted' application for jobs posted by this hospital
        const result = await query(
            `SELECT DISTINCT u.id, u.name, u.role, u.specialty
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             JOIN users u ON a.doctor_id = u.id
             WHERE j.hospital_id = $1 AND a.status = 'accepted'`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fetch failed' });
    }
});

export default router;
