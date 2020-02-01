require('dotenv').config();
const { Pool } = require('pg');

const { BESSIES_DB_USER, BESSIES_DB_PASSWORD, BESSIES_DB_NAME, BESSIES_DB_PORT, BESSIES_DB_HOST, BESSIES_DB_SSL } = process.env;

const pool = new Pool({
  user: BESSIES_DB_USER,
  password: BESSIES_DB_PASSWORD,
  database: BESSIES_DB_NAME,
  port: BESSIES_DB_PORT,
  host: BESSIES_DB_HOST,
  ssl: BESSIES_DB_SSL,
});

module.exports = {
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (e) {
      throw e;
    }    
  },
  getClient: () => pool.connect(),
}