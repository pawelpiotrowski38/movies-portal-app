import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = Router();

router.get('/check-user', async (req, res) => {
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
            const usernameQuery = 'SELECT username, theme FROM users WHERE user_id = $1'
            const [usernameResults] = await connection.query(usernameQuery, [userId]);

            if (usernameResults.length === 0) {
                connection.release();
                return res.sendStatus(404);
            }

            const username = usernameResults[0].username;
            const theme = usernameResults[0].theme;

            res.status(200).json({ id: userId, username: username, theme: theme });
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

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('asd');

    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken || refreshToken) {
        try {
            const decodedToken = jwt.verify(refreshToken, process.env.TOKEN_KEY);
            console.log('Decoded token: ', decodedToken);
            return res.send('User is logged in');
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    let connection = null;

    try {
        connection = await pool.connect();

        const userResults = await connection.query('SELECT user_id FROM users WHERE username = $1', [username]);
        
        if (userResults.rowCount === 0) {
            res.status(201).json({ message: 'User not found' });
            return;
        }

        const userId = userResults.rows[0].user_id;

        const verifiedResults = await connection.query('SELECT is_verified FROM users WHERE user_id = $1', [userId]);

        if (!verifiedResults.rows[0].is_verified) {
            res.status(401).json({ message: 'Account is not verified' });
            return;
        }

        const accountQuery = `
            SELECT u.hashed_password, u.is_verified, u.dfa_enabled, u.user_role,
            t.theme, t.schedule_enabled, t.start_hour, t.start_minute, t.end_hour, t.end_minute, t.language,
            p.rank_name
            FROM heroku_4ca5abe69b33068.users u
            INNER JOIN heroku_4ca5abe69b33068.users_points p ON u.id = p.user_id
            INNER JOIN heroku_4ca5abe69b33068.users_preferences t ON u.id = t.user_id
            WHERE u.id = ?
        `

        const [accountResults] = await connection.query(accountQuery, [userId]);

        const theme = accountResults[0].theme;

        const isMatch = await bcrypt.compare(password, accountResults[0].hashed_password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
                
        const accessToken = jwt.sign({ userId: userId, newTokensGenerated: false }, process.env.TOKEN_KEY, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ userId: userId, type: 'refresh', newTokensGenerated: false }, process.env.TOKEN_KEY, { expiresIn: '7d' });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, domain: '.moviesworld.one', sameSite: 'none', maxAge: 10 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, domain: '.moviesworld.one', sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });

        const [deleteResults] = await connection.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
        const [insertResults] = await connection.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, hashedRefreshToken, expiresAt]);

        res.status(201).json({ theme: theme, message: 'Login successful' });
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
