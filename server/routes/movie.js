import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/details/:movieId', async (req, res) => {
    const movieId = parseInt(req.params.movieId) || 0;

    let connection = null;

    try {
        connection = await pool.connect();

        let query = 'SELECT * FROM movies WHERE movie_id = $1';

        const results = await connection.query(query, [movieId]);

        if (results.rowCount === 0) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }

        res.status(200).json({ results: results.rows[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default router;
