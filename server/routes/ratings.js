import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = Router();

router.post('/add', async (req, res) => {
    const movieId = req.body.movieId || 0;
    const rating = req.body.rating || 0;

    if (movieId === 0) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        return res.status(401).json({ message: 'Token expired' });
    }

    let connection = null;

    try {
        const decodedToken = jwt.verify(accessToken, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;

        connection = await pool.connect();

        const checkRatingQuery = `
            SELECT rating FROM ratings
            WHERE user_id = $1 AND movie_id = $2;
        `;

        const checkRatingResults = await connection.query(checkRatingQuery, [userId, movieId]);

        const oldRating = checkRatingResults.rows[0]?.rating || 0;

        if (oldRating) {
            const updateRatingQuery = `
                UPDATE ratings
                SET rating = $1
                WHERE user_id = $2 AND movie_id = $3;
            `;

            const updateRatingResults = await connection.query(updateRatingQuery, [rating, userId, movieId]);

            const ratingDiff = rating - oldRating;

            const updateMovieQuery = `
                UPDATE movies
                SET sum_of_ratings = sum_of_ratings + $1
                WHERE movie_id = $2;
            `;

            const updateMovieResults = await connection.query(updateMovieQuery, [ratingDiff, movieId]);
        } else {
            const insertRatingQuery = `
                INSERT INTO ratings (user_id, movie_id, rating)
                VALUES ($1, $2, $3);
            `;

            const insertRatingResults = await connection.query(insertRatingQuery, [userId, movieId, rating]);

            const updateMovieQuery = `
                UPDATE movies
                SET number_of_ratings = number_of_ratings + 1,
                sum_of_ratings = sum_of_ratings + $1
                WHERE movie_id = $2;
            `;

            const updateMovieResults = await connection.query(updateMovieQuery, [rating, movieId]);
        }
        
        res.status(201).json({ message: 'Rating has been added successfully' });
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
