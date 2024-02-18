import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const sortOption = req.query.sortOption || 'title_asc';
    const genresFilter = req.query.filters?.genresFilter || [];
    const countriesFilter = req.query.filters?.countriesFilter || [];
    const yearsFilter = req.query.filters?.yearsFilter || [];
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const username = req.query.username || '';

    let connection = null;

    try {
        connection = await pool.connect();

        const selectUserQuery = `
            SELECT user_id
            FROM users
            WHERE username = $1;
        `;

        const selectUserResults = await connection.query(selectUserQuery, [username]);

        const userId = selectUserResults.rowCount ? selectUserResults.rows[0].user_id : 0;

        console.log(userId);

        const values = [];
        const countValues = [];

        let countQuery = `
            SELECT COUNT(DISTINCT m.movie_id) AS count
            FROM movies m
            JOIN movies_genres mg ON m.movie_id = mg.movie_id
            JOIN genres g ON mg.genre_id = g.genre_id
            JOIN movies_countries mc ON m.movie_id = mc.movie_id
            JOIN countries c ON mc.country_id = c.country_id
            WHERE 1=1
        `;

        let query = `
            SELECT m.movie_id, m.title, m.release_date, m.number_of_ratings, m.sum_of_ratings, COALESCE(m.poster_thumbnail_url, 'default') AS poster_url,
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
            LEFT JOIN ratings r ON m.movie_id = r.movie_id AND r.user_id = $1
            LEFT JOIN watchlist w ON m.movie_id = w.movie_id AND w.user_id = $2
            WHERE 1=1
        `;

        if (yearsFilter.length > 0) {
            query += ` AND EXTRACT(YEAR FROM m.release_date)::text = ANY($${values.length + 3})`;
            countQuery += ` AND EXTRACT(YEAR FROM m.release_date)::text = ANY($${countValues.length + 1})`;
            values.push(yearsFilter);
            countValues.push(yearsFilter);
        }
        if (genresFilter.length > 0) {
            countQuery += ` AND g.name = ANY($${countValues.length + 1})`;
            countValues.push(genresFilter);
        }
        if (countriesFilter.length > 0) {
            countQuery += ` AND c.name = ANY($${countValues.length + 1})`;
            countValues.push(countriesFilter);
        }

        query += ` GROUP BY m.movie_id, m.title, m.release_date, m.description, m.number_of_ratings, m.sum_of_ratings, r.rating, w.watchlist_id`;

        if (genresFilter.length > 0 && countriesFilter.length > 0) {
            query += `
                HAVING SUM(CASE WHEN g.name = ANY($${values.length + 3}) THEN 1 ELSE 0 END) > 0
			    AND SUM(CASE WHEN c.name = ANY($${values.length + 4}) THEN 1 ELSE 0 END) > 0
            `
            values.push(genresFilter);
            values.push(countriesFilter);
        } else {
            if (genresFilter.length > 0) {
                query += ` HAVING SUM(CASE WHEN g.name = ANY($${values.length + 3}) THEN 1 ELSE 0 END) > 0`;
                values.push(genresFilter);
            }
            if (countriesFilter.length > 0) {
                query += ` HAVING SUM(CASE WHEN c.name = ANY($${values.length + 3}) THEN 1 ELSE 0 END) > 0`;
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

        query += ` OFFSET $${values.length + 3} LIMIT $${values.length + 4}`;
        values.push(offset);
        values.push(limit);

        const moviesResults = await connection.query(query, [userId, userId, ...values]);
        const countResults = await connection.query(countQuery, countValues);

        res.status(200).json({
            results: moviesResults.rows,
            count: countResults.rows[0].count,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

router.get('/:movieId', async (req, res) => {
    const movieId = parseInt(req.params.movieId) || 0;
    const username = req.query.username || '';

    let connection = null;

    try {
        connection = await pool.connect();

        const selectUserQuery = `
            SELECT user_id
            FROM users
            WHERE username = $1;
        `;

        const selectUserResults = await connection.query(selectUserQuery, [username]);

        const userId = selectUserResults.rowCount ? selectUserResults.rows[0].user_id : 0;

        let query = `
            SELECT DISTINCT m.*, COALESCE(m.poster_thumbnail_url, 'default') AS poster_url,
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
            LEFT JOIN ratings r ON m.movie_id = r.movie_id AND r.user_id = $1
            LEFT JOIN watchlist w ON m.movie_id = w.movie_id AND w.user_id = $2
            WHERE m.movie_id = $3
            GROUP BY m.movie_id, r.rating, w.watchlist_id
        `;

        const results = await connection.query(query, [userId, userId, movieId]);

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

router.get('/:movieId/comments', async (req, res) => {
    const movieId = parseInt(req.params.movieId) || 0;
    const sortOption = req.query.sortOption || 'new';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 2;

    if (movieId === 0) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    let connection = null;

    try {
        connection = await pool.connect();

        let selectCommentsQuery = `
            SELECT c.*, u.username
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            WHERE c.movie_id = $1
            GROUP BY c.comment_id, u.username
        `;

        switch (sortOption) {
            case 'new':
                selectCommentsQuery += ' ORDER BY created_at DESC';
                break;
            case 'old':
                selectCommentsQuery += ' ORDER BY created_at ASC';
                break;
            default:
                selectCommentsQuery += ' ORDER BY created_at DESC';
        }

        selectCommentsQuery += ` OFFSET $2 LIMIT $3`;

        const countCommentsQuery = `
            SELECT COUNT(DISTINCT comment_id) AS count
            FROM comments
            WHERE movie_id = $1;
        `;

        const selectCommentsResults = await connection.query(selectCommentsQuery, [movieId, offset, limit]);
        const countCommentsResults = await connection.query(countCommentsQuery, [movieId]);
        
        res.status(200).json({
            results: selectCommentsResults.rows,
            count: countCommentsResults.rows[0].count,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

router.post('/ratings', async (req, res) => {
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

router.patch('/:movieId/ratings', async (req, res) => {
    const movieId = parseInt(req.params.movieId) || 0;
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

        if (checkRatingResults.rowCount === 0) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        const oldRating = checkRatingResults.rows[0].rating;

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
        
        res.status(200).json({ message: 'Rating has been updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

router.delete('/:movieId/ratings', async (req, res) => {
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

        const selectRatingQuery = `
            SELECT rating FROM ratings
            WHERE user_id = $1 AND movie_id = $2;
        `;

        const selectRatingResults = await connection.query(selectRatingQuery, [userId, movieId]);

        if (selectRatingResults.rowCount === 0) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        const oldRating = selectRatingResults.rows[0].rating;

        const deleteRatingQuery = `
            DELETE FROM ratings
            WHERE user_id = $1 AND movie_id = $2;
        `;

        const deleteRatingResults = await connection.query(deleteRatingQuery, [userId, movieId]);

        const updateMovieQuery = `
            UPDATE movies
            SET number_of_ratings = number_of_ratings - 1,
            sum_of_ratings = sum_of_ratings - $1
            WHERE movie_id = $2;
        `;

        const updateMovieResults = await connection.query(updateMovieQuery, [oldRating, movieId]);
        
        res.status(200).json({ message: 'Rating has been deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

router.post('/watchlist', async (req, res) => {
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

router.delete('/:movieId/watchlist', async (req, res) => {
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
