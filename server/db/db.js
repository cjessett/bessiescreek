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
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res && res.rowCount })
      callback(err, res)
    })
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query
      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
      }
      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
      }, 5000)
      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err)
        // clear our timeout
        clearTimeout(timeout)
        // set the query method back to its old un-monkey-patched version
        client.query = query
      }
      callback(err, client, release)
    })
  }
}