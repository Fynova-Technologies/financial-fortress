import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: { rejectUnauthorized: false },
});

// test connection
pool.on('connect', () =>{
    console.log('Connected to database.');
})

pool.on('error', (err)=>{
    console.log('Database connection error.', err);
})

export const db = drizzle(pool, { schema });    

