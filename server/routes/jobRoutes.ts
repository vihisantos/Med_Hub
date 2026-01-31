import express from 'express';
import { createJob, getJobs, getMyJobs } from '../controllers/jobController.ts';
import { authenticateToken, authorizeRole } from '../middleware/auth.ts';

const router = express.Router();

// Public/Doctors can view jobs
router.get('/', authenticateToken, getJobs);

// Hospitals only
router.post('/', authenticateToken, authorizeRole(['hospital']), createJob);
router.get('/my-jobs', authenticateToken, authorizeRole(['hospital']), getMyJobs);

export default router;
