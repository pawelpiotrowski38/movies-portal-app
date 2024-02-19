import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import pool from '../config/db.js';

const router = Router();

router.post('/', verifyAccessToken, async (req, res) => {
    const movieId = req.body.movieId || 0;
    const content = req.body.content || '';

    if (movieId === 0) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    let connection = null;

    try {
        connection = await pool.connect();

        const addCommentQuery = `
            INSERT INTO comments (user_id, movie_id, content)
            VALUES ($1, $2, $3)
            RETURNING comment_id;
        `;

        const addCommentResults = await connection.query(addCommentQuery, [req.userId, movieId, content]);

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

router.patch('/:commentId', verifyAccessToken, async (req, res) => {
    const commentId = parseInt(req.params.commentId) || 0;
    const content = req.body.content || '';

    if (commentId === 0) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    let connection = null;

    try {
        connection = await pool.connect();

        const updateCommentQuery = `
            UPDATE comments
            SET content = $1
            WHERE comment_id = $2 AND user_id = $3;
        `;

        const updateCommentResults = await connection.query(updateCommentQuery, [content, commentId, req.userId]);
        
        res.status(200).json({
            message: 'Comment has been updated successfully',
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

router.delete('/:commentId', verifyAccessToken, async (req, res) => {
    const commentId = parseInt(req.params.commentId) || 0;

    if (commentId === 0) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    let connection = null;

    try {
        connection = await pool.connect();

        const deleteCommentQuery = `
            UPDATE comments
            SET deleted = true
            WHERE comment_id = $1 AND user_id = $2;
        `;

        const deleteCommentResults = await connection.query(deleteCommentQuery, [commentId, req.userId]);
        
        res.status(200).json({ message: 'Comment has been deleted successfully' });
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
