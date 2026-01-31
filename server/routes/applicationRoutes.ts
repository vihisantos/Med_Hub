import express from 'express';
import { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus } from '../controllers/applicationController.ts';
import { authenticateToken, authorizeRole } from '../middleware/auth.ts';

const router = express.Router();

// Doctor
router.post('/apply', authenticateToken, authorizeRole(['doctor']), applyForJob);
router.get('/my-applications', authenticateToken, authorizeRole(['doctor']), getMyApplications);

// Hospital
router.get('/job/:job_id', authenticateToken, authorizeRole(['hospital']), getJobApplications);
router.patch('/:id/status', authenticateToken, authorizeRole(['hospital']), updateApplicationStatus);

export default router;
