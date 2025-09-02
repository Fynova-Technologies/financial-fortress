import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../models/index.js';

const { Pool } = pkg;

// setup postgresql connection pool
const testPool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'financial-fortress',
    password: 'bibash',
    port: 5432,
})


testPool.query("SELECT NOW()")
  .then(res => console.log("DB reachable, time:", res.rows[0]))
  .catch(err => console.error("Cannot connect to DB:", err));
// const pool = new Pool ({
//     connectionString:'postgresql://financial_table_2mo1_user:UwWuXTlkkIpIIM37RU9tJeqEZD9wBiDC@dpg-d2qnnuv5r7bs73avmuq0-a.oregon-postgres.render.com/financial_table_2mo1',
//     ssl: { rejectUnauthorized: false},
// })

// test connection
// pool.on('connect', () =>{
//     console.log('Connected to database.');
// })

// pool.on('error', (err)=>{
//     console.log('Database connection error.', err);
// })

export const db = drizzle(testPool, { schema });    

