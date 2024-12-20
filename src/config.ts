import dotenv from 'dotenv';

dotenv.config();

export const BASE_URL: string = process.env.BASE_URL ?? 'http://localhost:3000';

export const PORT: number = process.env.PORT
    ? parseInt(process.env.PORT) : 3000;

export const ACCOUNT_STORAGE_FILEPATH = process.env.ACCOUNT_STORAGE_FILEPATH ?? '.data/accounts.data';

export const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME
    ? parseInt(process.env.ACCESS_TOKEN_LIFETIME) : 43200;

export const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME
    ? parseInt(process.env.REFRESH_TOKEN_LIFETIME) : 172800;

export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;