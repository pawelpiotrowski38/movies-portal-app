import { createServer } from 'http';
import app from './app.js';

const server = createServer(app);

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
