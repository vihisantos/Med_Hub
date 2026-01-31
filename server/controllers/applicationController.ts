import type { Request, Response } from 'express';
import { query } from '../db.ts';

export const applyForJob = async (req: Request, res: Response) => {
    const { job_id } = req.body;
    const doctor_id = req.user?.id;

    try {
        const result = await query(
            'INSERT INTO applications (job_id, doctor_id) VALUES ($1, $2) RETURNING *',
            [job_id, doctor_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error(err);
        if (err.code === '23505') { // Unique constraint violation
            return res.status(400).json({ message: 'Already applied for this job' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyApplications = async (req: Request, res: Response) => {
    const doctor_id = req.user?.id;
    try {
        const result = await query(
            `SELECT applications.*, jobs.title, jobs.date, jobs.start_time, jobs.end_time, jobs.location, users.name as hospital_name 
       FROM applications 
       JOIN jobs ON applications.job_id = jobs.id 
       JOIN users ON jobs.hospital_id = users.id 
       WHERE doctor_id = $1 
       ORDER BY created_at DESC`,
            [doctor_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getJobApplications = async (req: Request, res: Response) => {
    const { job_id } = req.params;
    const hospital_id = req.user?.id;

    try {
        // Verify job belongs to hospital
        const jobCheck = await query('SELECT * FROM jobs WHERE id = $1 AND hospital_id = $2', [job_id, hospital_id]);
        if (jobCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Not authorized or job not found' });
        }

        const result = await query(
            `SELECT applications.*, users.name as doctor_name, users.email as doctor_email 
       FROM applications 
       JOIN users ON applications.doctor_id = users.id 
       WHERE job_id = $1 
       ORDER BY created_at ASC`,
            [job_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const hospital_id = req.user?.id;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Verify application -> job -> hospital ownership
        const appCheck = await query(
            `SELECT applications.id FROM applications 
       JOIN jobs ON applications.job_id = jobs.id 
       WHERE applications.id = $1 AND jobs.hospital_id = $2`,
            [id, hospital_id]
        );

        if (appCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Not authorized or application not found' });
        }

        const result = await query(
            'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
