import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = Router();

router.post('/add', async (req, res) => {
    const movieId = req.body.movieId || 0;

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

        const checkWatchlistQuery = `
            SELECT watchlist_id FROM watchlist
            WHERE user_id = $1 AND movie_id = $2;
        `;

        const checkWatchlistResults = await connection.query(checkWatchlistQuery, [userId, movieId]);

        if (!checkWatchlistResults.rowCount) {
            const insertWatchlistQuery = `
                INSERT INTO watchlist (user_id, movie_id)
                VALUES ($1, $2);
            `;

            const insertWatchlistResults = await connection.query(insertWatchlistQuery, [userId, movieId]);
        } else {
            return res.status(201).json({ message: 'Movie is already on the watchlist' });
        }
        
        res.status(201).json({ message: 'Movie has been added to the watchlist successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

router.delete('/delete/:movieId', async (req, res) => {
    const movieId = parseInt(req.params.movieId) || 0;

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

        const deleteWatchlistQuery = `
            DELETE FROM watchlist
            WHERE user_id = $1 AND movie_id = $2;
        `;

        const deleteWatchlistResults = await connection.query(deleteWatchlistQuery, [userId, movieId]);
        
        res.status(200).json({ message: 'Movie has been deleted from the watchlist successfully' });
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
