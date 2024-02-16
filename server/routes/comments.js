import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.post('/', async (req, res) => {
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
