import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
// console.log(process.env);

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

pool.getConnection()
    .then(() => {
        console.log("MySQL successfully connected!");
    })
    .catch((err) => {
        console.log("Error connecting to DB:", err.message);
    });