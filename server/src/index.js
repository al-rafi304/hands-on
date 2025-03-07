import express from 'express';
import 'express-async-errors';
import * as db from './db.js';
import * as env from './env.js';

import userRoutes from './routes/user.js';

const server = express();

const start = async () => {
    
    // Middlewares
    server.use(express.json());

    // Routes
    server.use('/api/v1/user', userRoutes);

    await db.connectDB();
    server.listen(env.SERVER_PORT, () => {
        console.log(`Server started on http://localhost:${env.SERVER_PORT}`);
    })
}

start();
