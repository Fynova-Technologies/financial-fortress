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
//     connectionString:'postgresql://financial_table_wwun_user:wzv9FUICWbtrYL2KKklzYorfVe5aWd5D@dpg-d2s00umr433s738dk6jg-a/financial_table_wwun',
//     ssl: { rejectUnauthorized: false},
// })

const pool = new Pool({
  user: 'fynova_db_user',
  host: 'dpg-d2rtainfte5s739atuvg-a.oregon-postgres.render.com',
  database: 'fynova_db',
  password: 'mj2r0eglsJDd6N3OOk89REIc2fWXTIgU',
  port: 5432,
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

