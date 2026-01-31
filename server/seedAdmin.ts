import bcrypt from 'bcryptjs';
import { query } from './db.ts';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    const adminEmail = process.env.ADMIN_EMAIL || 'adm-vitor@capybaraholding.com';
    const adminPass = process.env.ADMIN_PASSWORD || '631330';
    const adminName = process.env.ADMIN_NAME || 'Admin Vitor';

    if (!process.env.ADMIN_PASSWORD) {
        console.warn('⚠️  ADMIN_PASSWORD not set in .env. Using fallback (Not secure for production).');
    }

    try {
        console.log('Checking for existing admin...');
        const check = await query('SELECT * FROM users WHERE email = $1', [adminEmail]);

        if (check.rows.length > 0) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        console.log('Creating admin user...');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(adminPass, salt);

        await query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
            [adminName, adminEmail, hash, 'admin']
        );

        console.log('Admin user created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
