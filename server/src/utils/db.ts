import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../models/index.js';

const { Pool } = pkg;

// setup postgresql connection pool
// const testPool = new Pool ({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'financial-fortress',
//     password: 'bibash',
//     port: 5432,
// })

// const pool = new Pool ({
//     connectionString:'postgresql://fynova_db_user:mj2r0eglsJDd6N3OOk89REIc2fWXTIgU@dpg-d2rtainfte5s739atuvg-a/fynova_db',
//     ssl: { rejectUnauthorized: false},
// })

const pool = new Pool({
  user: 'fynova_db_user',
  host: 'dpg-d2rtainfte5s739atuvg-a',
  database: 'fynova_db',
  password: 'mj2r0eglsJDd6N3OOk89REIc2fWXTIgU',
  port: 5432,
});

// test connection
pool.on('connect', () =>{
    console.log('Connected to database.');
})

pool.on('error', (err)=>{
    console.log('Database connection error.', err);
})

export const db = drizzle(pool, { schema });    

