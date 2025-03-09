import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import * as db from './db.js';
import * as env from './env.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

const server = express();
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}
const baseEndpoint = '/api/v1';

const start = async () => {
    
    // Middlewares
    server.use(cors(corsOptions));
    server.use(express.json());
    
    // Routes
    server.use(`${baseEndpoint}/auth`, authRoutes);
    server.use(`${baseEndpoint}/user`, userRoutes);
    
    await db.connectDB();
    server.listen(env.SERVER_PORT, () => {
        console.log(`Server started on http://localhost:${env.SERVER_PORT}`);
    })
}

start();
