import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/:movieId', async (req, res) => {
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

router.post('/add', async (req, res) => {
    const movieId = req.body.movieId || 0;
    const content = req.body.content || '';

    if (movieId === 0) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    let connection = null;

    try {
        const userId = 1; // default user

        connection = await pool.connect();

        const addCommentQuery = `
            INSERT INTO comments (user_id, movie_id, content)
            VALUES ($1, $2, $3)
            RETURNING comment_id;
        `;

        const addCommentResults = await connection.query(addCommentQuery, [userId, movieId, content]);

        const selectNewCommentQuery = `
            SELECT c.*, u.username
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            WHERE c.comment_id = $1;
        `;

        const selectNewCommentResults = await connection.query(selectNewCommentQuery, [addCommentResults.rows[0].comment_id]);
        
        res.status(201).json({
            newComment: selectNewCommentResults.rows[0],
            message: 'Comment has been added successfully',
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

export default router;
