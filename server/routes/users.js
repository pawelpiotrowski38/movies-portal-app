import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import * as dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.get('/', async (req, res) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        const refreshToken = req.cookies?.refreshToken;

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

        try {
            const selectUserQuery = `
                SELECT username, theme
                FROM users
                WHERE user_id = $1;
            `;

            const selectUserResults = await connection.query(selectUserQuery, [userId]);

            if (selectUserResults.rowCount === 0) {
                return res.status(200).json({ message: 'User not found' });
            }

            const username = selectUserResults.rows[0].username;
            const theme = selectUserResults.rows[0].theme;

            res.status(200).json({ userId: userId, username: username, theme: theme });
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ message: 'Internal server error', err: error });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token expired' });
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
});

router.post('/', async (req, res) => {
    const { emailAddress, username, password } = req.body;

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

        const checkEmailQuery = `
            SELECT user_id FROM users
            WHERE email = $1;
        `;

        const checkEmailResults = await connection.query(checkEmailQuery, [emailAddress]);
        
        if (checkEmailResults.rowCount) {
            res.status(409).json({ message: 'Email address already in use' });
            return;
        }

        const checkUsernameQuery = `
            SELECT user_id FROM users
            WHERE username = $1;
        `;

        const checkUsernameResults = await connection.query(checkUsernameQuery, [username]);
            
        if (checkUsernameResults.rowCount) {
            res.status(409).json({ message: 'Username already in use' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = `
            INSERT INTO users (email, username, password, is_verified)
            VALUES ($1, $2, $3, $4);
        `

        const insertUserResults = await connection.query(insertUserQuery, [emailAddress, username, hashedPassword, true]);

        res.status(201).json({ message: 'User has been created successfully' });
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
