import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

console.log('--- PG TEST ---');
console.log('Raw DATABASE_URL type:', typeof connectionString);
if (connectionString) {
    console.log('Raw value length:', connectionString.length);
    console.log('Value (first 20 chars):', connectionString.substring(0, 20));
    console.log('Value (last 5 chars):', connectionString.substring(connectionString.length - 5));
    console.log('First char code:', connectionString.charCodeAt(0));
    console.log('Last char code:', connectionString.charCodeAt(connectionString.length - 1));
} else {
    console.error('DATABASE_URL is undefined');
    process.exit(1);
}

try {
    const pool = new Pool({ connectionString });
    pool.connect().then(client => {
        console.log('Successfully connected to Postgres!');
        return client.query('SELECT NOW()').then(res => {
            console.log('Query result:', res.rows[0]);
            client.release();
            pool.end();
            process.exit(0);
        });
    }).catch(err => {
        console.error('Pool connection error:', err);
        process.exit(1);
    });
} catch (e) {
    console.error('Sync error:', e);
}
