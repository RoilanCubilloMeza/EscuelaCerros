//dotenv nos permite leer las variables de entorno de nuestro .env
const dotenv = require("dotenv");
dotenv.config();


const mysql = require('mysql2');
let connection;

try {
    exports.connection = mysql.createConnection({
        host: process.env.DBHOST,
        port: process.env.DBPORT || 3306,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME,
        multipleStatements: true,
        ssl: {
            rejectUnauthorized: false
        },
        connectTimeout: 20000
    });
    console.log("conexión exitosa con la db");
} catch (error) {
    console.log("Error al conectar con la base de datos", error);
}