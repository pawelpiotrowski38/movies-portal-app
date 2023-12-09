import pkg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

pool.on('acquire', (connection) => {
    console.log(`Connection ${connection.processID} acquired from the pool.`);
});
  
pool.on('release', () => {
    console.log(`Connection released back to the pool.`);
});

export default pool;