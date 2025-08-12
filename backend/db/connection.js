const mysql = require('mysql2/promise'); // this line impor mysql2 library for database connection
require('dotenv').config();  // this loading environment variables from .env file

const pool = mysql.createPool({ // create a pool of database connections for efficient reuse
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Qwe.123*',
  database: process.env.DB_NAME || 'pd_maria_yanes_cienaga',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = { pool }; // export values from this module so other files can import them