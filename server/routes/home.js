import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const sortOption = req.query.sortOption || 'title_asc';
    const genresFilter = req.query.filters?.genresFilter || [];
    const countriesFilter = req.query.filters?.countriesFilter || [];
    const yearsFilter = req.query.yearsFilter || [];

    let connection = null;

    try {
        connection = await pool.connect();

        const values = [];

        let query = `
            SELECT m.movie_id, m.title, m.number_of_ratings, m.sum_of_ratings,
            ROUND((m.sum_of_ratings::decimal/m.number_of_ratings), 1) AS average_rating,
            STRING_AGG(DISTINCT g.name, ', ') AS genres_names,
            STRING_AGG(DISTINCT c.name, ', ') AS countries_names
            FROM movies m
            JOIN movies_genres mg ON m.movie_id = mg.movie_id
            JOIN genres g ON mg.genre_id = g.genre_id
            JOIN movies_countries mc ON m.movie_id = mc.movie_id
            JOIN countries c ON mc.country_id = c.country_id
            WHERE 1=1
        `;

        query += ' GROUP BY m.movie_id, m.title, m.release_date, m.description, m.number_of_ratings, m.sum_of_ratings';

        if (genresFilter.length > 0 && countriesFilter.length > 0) {
            query += `
                HAVING SUM(CASE WHEN g.name = ANY($1) THEN 1 ELSE 0 END) > 0
			    AND SUM(CASE WHEN c.name = ANY($2) THEN 1 ELSE 0 END) > 0
            `
            values.push(genresFilter);
            values.push(countriesFilter);
        } else {
            if (genresFilter.length > 0) {
                query += ' HAVING SUM(CASE WHEN g.name = ANY($1) THEN 1 ELSE 0 END) > 0';
                values.push(genresFilter);
            }
            if (countriesFilter.length > 0) {
                query += ' HAVING SUM(CASE WHEN c.name = ANY($1) THEN 1 ELSE 0 END) > 0';
                values.push(countriesFilter);
            }
        }

        switch (sortOption) {
            case 'title_asc':
                query += ' ORDER BY title ASC';
                break;
            case 'title_desc':
                query += ' ORDER BY title DESC';
                break;
            case 'rating_asc':
                query += ' ORDER BY average_rating ASC, title ASC';
                break;
            case 'rating_desc':
                query += ' ORDER BY average_rating DESC, title ASC';
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

        const results = await connection.query(query, values);

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
