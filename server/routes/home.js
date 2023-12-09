import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const sortOption = req.query.sortOption || 'title_asc';
    const genresFilter = req.query.genresFilter || [];
    const countriesFilter = req.query.countriesFilter || [];
    const yearsFilter = req.query.yearsFilter || [];

    let connection = null;

    try {
        connection = await pool.connect();

        let query = 'SELECT * FROM movies';

        switch (sortOption) {
            case 'title_asc':
                query += ' ORDER BY title ASC';
                break;
            case 'title_desc':
                query += ' ORDER BY title DESC';
                break;
            case 'rating_asc':
                query += ' ORDER BY (sum_of_ratings/number_of_ratings) ASC, title ASC';
                break;
            case 'rating_desc':
                query += ' ORDER BY (sum_of_ratings/number_of_ratings) DESC, title ASC';
                break;
            case 'num_ratings_asc':
                query += ' ORDER BY number_of_ratings ASC, title ASC';
                break;
            case 'num_ratings_desc':
                query += ' ORDER BY number_of_ratings DESC, title ASC';
                break;
            case 'year_asc':
                query += ' ORDER BY release_date ASC, title ASC';
                break;
            case 'year_desc':
                query += ' ORDER BY release_date DESC, title ASC';
                break;
            default:
                query += ' ORDER BY title ASC';
        }

        const results = await connection.query(query);

        res.status(200).json({ results: results.rows });
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
