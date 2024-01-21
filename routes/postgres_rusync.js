const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'admin',
    database: 'rusync',
    password: '1945',
    port: '5432',
    max: 20,
    idleTimeoutMillis: 30000,
    _connectionTimeoutMillis: 2000,
})

module.exports = pool;
