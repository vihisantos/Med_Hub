import type { Request, Response } from 'express';
import { query } from '../db.ts';

export const createJob = async (req: Request, res: Response) => {
    const { title, description, location, date, start_time, end_time } = req.body;
    const hospital_id = req.user?.id;

    try {
        // Enforce Plan Limits
        // First get the user's subscription tier
        const userRes = await query('SELECT subscription_tier FROM users WHERE id = $1', [hospital_id]);
        const tier = userRes.rows[0]?.subscription_tier || 'free';

        if (tier === 'free') {
            const countRes = await query('SELECT COUNT(*) FROM jobs WHERE hospital_id = $1 AND status = $2', [hospital_id, 'open']);
            const activeJobs = parseInt(countRes.rows[0].count);

            if (activeJobs >= 1) {
                return res.status(403).json({
                    message: 'Limite do plano Básico atingido (1 vaga ativa). Faça upgrade para o Pro para vagas ilimitadas.',
                    code: 'LIMIT_REACHED'
                });
            }
        }

        const result = await query(
            'INSERT INTO jobs (hospital_id, title, description, location, date, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [hospital_id, title, description, location, date, start_time, end_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getJobs = async (_req: Request, res: Response) => {
    try {
        const result = await query('SELECT jobs.*, users.name as hospital_name FROM jobs JOIN users ON jobs.hospital_id = users.id WHERE status = $1 ORDER BY date ASC', ['open']);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyJobs = async (req: Request, res: Response) => {
    const hospital_id = req.user?.id;
    try {
        const result = await query('SELECT * FROM jobs WHERE hospital_id = $1 ORDER BY created_at DESC', [hospital_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
