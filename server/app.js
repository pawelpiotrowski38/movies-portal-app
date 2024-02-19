import express from 'express';
import cookieParser from 'cookie-parser'; 
import pkg from 'body-parser';
const { json, urlencoded } = pkg;

import moviesRouter from './routes/movies.js';
import commentsRouter from './routes/comments.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    // allowed origins for localhost
    // https://localhost:3000 is for the access from the same device
    // https://192.168.1.12:3000 is for the access from remote device
    const allowedOrigins = ['http://localhost:5173', 'http://192.168.1.12:5173'];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
       res.setHeader('Access-Control-Allow-Methods', ['POST', 'PUT', 'PATCH', 'GET', 'DELETE', 'OPTIONS']);
       res.setHeader('Access-Control-Allow-Headers', ['Content-Type']);
       res.setHeader('Access-Control-Allow-Credentials', true);
    }

    next();
});

app.use('/api/movies', moviesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

export default app;
