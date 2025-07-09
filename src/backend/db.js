import pg from 'pg';
import {
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} from './config.js';

export const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT
});

//pool.query('SELECT NOW()').then( result => 
//    {console.log(result)}
//)