import dotenv from 'dotenv';

dotenv.config();

export const BASE_URL: string = process.env.BASE_URL ?? 'http://localhost:3000';

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;