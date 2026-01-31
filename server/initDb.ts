import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
};

const setupDatabase = async () => {
    // 1. Connect to default 'postgres' database to check/create 'med_hub'
    const client = new pg.Client({ ...config, database: 'postgres' });

    try {
        await client.connect();

        const checkDb = await client.query("SELECT 1 FROM pg_database WHERE datname = 'med_hub'");
        if (checkDb.rows.length === 0) {
            console.log("Creating database 'med_hub'...");
            await client.query("CREATE DATABASE med_hub");
            console.log("Database created successfully.");
        } else {
            console.log("Database 'med_hub' already exists.");
        }
        await client.end();

        // 2. Connect to 'med_hub' and apply schema
        console.log("Applying schema...");
        const dbClient = new pg.Client({ ...config, database: 'med_hub' });
        await dbClient.connect();

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await dbClient.query(schema);
        console.log("Schema applied successfully.");
        await dbClient.end();
        process.exit(0);

    } catch (err) {
        console.error("Error setting up database:", err);
        process.exit(1);
    }
};

setupDatabase();
