import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.HOST_DB,
  port: Number(process.env.PORT_DB),
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE_DB,
});