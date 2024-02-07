import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/details/:movieId', async (req, res) => {
    const movieId = parseInt(req.params.movieId) || 0;

    let connection = null;

    try {
        connection = await pool.connect();

        let query = `
            SELECT DISTINCT m.*,
            ROUND((m.sum_of_ratings::decimal/m.number_of_ratings), 1) AS average_rating,
            STRING_AGG(DISTINCT g.name, ', ') AS genres_names,
            STRING_AGG(DISTINCT c.name, ', ') AS countries_names,
            r.rating,
            w.watchlist_id AS watchlist
            FROM movies m
            JOIN movies_genres mg ON m.movie_id = mg.movie_id
            JOIN genres g ON mg.genre_id = g.genre_id
            JOIN movies_countries mc ON m.movie_id = mc.movie_id
            JOIN countries c ON mc.country_id = c.country_id
            LEFT JOIN ratings r ON m.movie_id = r.movie_id AND r.user_id = 1
            LEFT JOIN watchlist w ON m.movie_id = w.movie_id AND w.user_id = 1
            WHERE m.movie_id = $1
            GROUP BY m.movie_id, r.rating, w.watchlist_id`

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
