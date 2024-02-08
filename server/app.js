import express from 'express';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;

import homeRouter from './routes/home.js';
import movieRouter from './routes/movie.js';
import ratingsRouter from './routes/ratings.js';
import watchlistRouter from './routes/watchlist.js';
import authenticationRouter from './routes/authentication.js';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
    // allowed origins for localhost
    // https://localhost:3000 is for the access from the same device
    // https://192.168.1.12:3000 is for the access from remote device
    const allowedOrigins = ['http://localhost:5173', 'http://192.168.1.12:5173'];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
       res.setHeader('Access-Control-Allow-Methods', ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS']);
       res.setHeader('Access-Control-Allow-Headers', ['Content-Type']);
    }

    next();
});

app.use('/', homeRouter);
app.use('/movie', movieRouter);
app.use('/ratings', ratingsRouter);
app.use('/watchlist', watchlistRouter);
app.use('/authentication', authenticationRouter);

export default app;
