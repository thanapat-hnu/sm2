import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "172.27.155.92",
    port: 3306,
    user: "root",
    password: "root",
    database: "slideme"
});

pool.getConnection()
    .then(() => {
        console.log("MySQL successfully connected!");
    })
    .catch((err) => {
        console.log("Error connecting to DB:", err.message);
    });



export default pool; // ส่งออก pool