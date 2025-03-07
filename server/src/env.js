import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET == "") {
    throw Error("JWT Secrect must be defined in environment variable")
}

export const DEVELOPMENT = process.env.NODE_ENV === 'development';

export const MONGO_URI = process.env.MONGO_URI

export const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_LIFETIME = process.env.JWT_LIFETIME ? Number(process.env.JWT_LIFETIME) : 3600