const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");

const QueryOrRollback = async (query, params) => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  let res;
  const client = await pool.connect();
  try {
    res = await client.query('BEGIN');
    try {
      res = await client.query(query, params);
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  }
  finally {
    client.release()
  }
  return res;
}


export { QueryOrRollback };
