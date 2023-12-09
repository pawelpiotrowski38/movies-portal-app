import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Qwerty123',
    database: 'moviesdatabase',
});

pool.on('acquire', (connection) => {
    console.log(`Connection ${connection.processID} acquired from the pool.`);
});
  
pool.on('release', () => {
    console.log(`Connection released back to the pool.`);
});

export default pool;