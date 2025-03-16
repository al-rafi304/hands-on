import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import * as db from './db.js';
import * as env from './env.js';
import * as constant from './constants.js';

import logger from './middlewares/logger.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import eventRoutes from './routes/event.js';
import requestRoutes from './routes/helpRequest.js';
import commentRoutes from './routes/comment.js';

const server = express();
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}

const start = async () => {
    
    // Middlewares
    server.use(logger);
    server.use(cors(corsOptions));
    server.use(express.json());
    
    // Routes
    server.use(`${constant.BASE_API_ROUTE}/auth`, authRoutes);
    server.use(`${constant.BASE_API_ROUTE}/user`, userRoutes);
    server.use(`${constant.BASE_API_ROUTE}/event`, eventRoutes);
    server.use(`${constant.BASE_API_ROUTE}/request`, requestRoutes);
    server.use(`${constant.BASE_API_ROUTE}/comment`, commentRoutes);
    
    await db.connectDB();
    server.listen(env.SERVER_PORT, () => {
        console.log(`Server started on http://localhost:${env.SERVER_PORT}`);
    })
}

start();
