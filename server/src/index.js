import express from 'express';
import * as db from './db.js';
import * as env from './env.js';

const server = express();

const start = async () => {
    
    // Middlewares
    server.use(express.json());

    // Routes
    server.get('/', (req, res) => res.send("Hello World!"));

    await db.connectDB();
    server.listen(env.SERVER_PORT, () => {
        console.log(`Server started on http://localhost:${env.SERVER_PORT}`);
    })
}

start();
