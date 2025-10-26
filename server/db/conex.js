// db.js
import mysql from 'mysql2/promise';
import loadEnv from '../utils/loadEnv.js';

loadEnv();

const pool = mysql.createPool({
  uri: process.env.DB_URL,
  waitForConnections: true,
  connectionLimit: 10, // Podés subirlo un poco si Railway lo permite
  queueLimit: 0
});

pool.getConnection()
  .then((connection) => {
    console.log('Conexión a la base de datos establecida!');
    connection.release();
  })
  .catch((error) => {
    console.error('Error al establecer la conexión a la base de datos:', error);
  });

export default pool;