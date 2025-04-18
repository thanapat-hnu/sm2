import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

pool.getConnection()
  .then((connection) => {
    console.log("MySQL successfully connected!");
    console.log("Connected to database:", process.env.MYSQL_DB);
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    console.error("Connection config:", {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USERNAME,
      database: process.env.MYSQL_DB,
    });
  });

// Export the pool to be used in other modules
export { pool };
