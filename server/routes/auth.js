import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import * as dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken || refreshToken) {
        try {
            const decodedToken = jwt.verify(refreshToken, process.env.TOKEN_KEY);
            return res.status(409).json({ message: 'User is logged in' });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    let connection = null;

    try {
        connection = await pool.connect();

        const selectUserQuery = `
            SELECT user_id, password, is_verified, theme
            FROM users
            WHERE username = $1;
        `

        const selectUserResults = await connection.query(selectUserQuery, [username]);
        
        if (selectUserResults.rowCount === 0) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        if (!selectUserResults.rows[0].is_verified) {
            res.status(401).json({ message: 'Account is not verified' });
            return;
        }

        const userId = selectUserResults.rows[0].user_id;

        const isMatch = await bcrypt.compare(password, selectUserResults.rows[0].password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
                
        const accessToken = jwt.sign({ userId: userId, newTokensGenerated: false }, process.env.TOKEN_KEY, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ userId: userId, type: 'refresh', newTokensGenerated: false }, process.env.TOKEN_KEY, { expiresIn: '7d' });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 10 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });

        const deleteTokenResults = await connection.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
        const insertTokenResults = await connection.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [userId, hashedRefreshToken, expiresAt]);

        res.status(201).json({ theme: selectUserResults.rows[0].theme, message: 'Login successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

router.post('/tokens', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Missing refresh token' });
    }

    let connection = null;
      
    try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.TOKEN_KEY);
        const expirationTime = decodedRefreshToken.exp;
        const expirationDate = new Date(expirationTime * 1000);
        const formattedExpirationDate = expirationDate.toLocaleString();
        console.log('Refresh token will expire at', formattedExpirationDate);

        const userId = decodedRefreshToken.userId;

        connection = await pool.connect();

        const selectTokenQuery = `
            SELECT token
            FROM refresh_tokens
            WHERE user_id = $1;
        `;

        const selectTokenResults = await connection.query(selectTokenQuery, [userId]);

        if (!selectTokenResults.rowCount) {
            connection.release();
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }

        const isMatch = await bcrypt.compare(refreshToken, selectTokenResults.rows[0].token);

        if (!isMatch) {
            connection.release();
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }

        const newAccessToken = jwt.sign({ userId: userId }, process.env.TOKEN_KEY, { expiresIn: '10m' });
        const newRefreshToken = jwt.sign({ userId: userId, type: 'refresh' }, process.env.TOKEN_KEY, { expiresIn: '7d' });
        const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 10 * 60 * 1000 });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000  });

        const deleteTokenQuery = `
            DELETE FROM refresh_tokens
            WHERE user_id = $1;
        `;

        const insertTokenQuery = `
            INSERT INTO refresh_tokens (user_id, token, expires_at)
            VALUES ($1, $2, $3);
        `;

        const deleteTokenResults = await connection.query(deleteTokenQuery, [userId]);
        const insertTokenResults = await connection.query(insertTokenQuery, [userId, hashedNewRefreshToken, expiresAt]);

        connection.release();
      
        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        if (connection) {
            connection.release();
        }
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});

router.delete('/', async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    let connection = null;

    try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.TOKEN_KEY);
        const userId = decodedRefreshToken.userId;

        connection = await pool.connect();

        const deleteTokenQuery = `
            DELETE FROM refresh_tokens
            WHERE user_id = $1;
        `;

        const deleteTokenResults = await connection.query(deleteTokenQuery, [userId]);
        console.log('Refresh token has been deleted from database');
    } catch (error) {
        console.log('Refresh token is invalid or expired');
    } finally {
        if (connection) {
            connection.release();
        }
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Cookies have been removed' });
});

export default router;
