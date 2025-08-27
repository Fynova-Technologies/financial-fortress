import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../models/index.js';

const { Pool } = pkg;

// setup postgresql connection pool
const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'financial-fortress',
    password: 'bibash',
    port: 5432,
})

// test connection
pool.on('connect', () =>{
    console.log('Connected to database.');
})

pool.on('error', (err)=>{
    console.log('Database connection error.', err);
})

export const db = drizzle(pool, { schema });    