import jwt from 'jsonwebtoken';

export const verifyAccessToken = function(req, res, next) {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: 'Token expired' });
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.TOKEN_KEY);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error('Error verifying access token:', error);
        res.status(500).json({ message: 'Internal server error', err: error });
    }
};
