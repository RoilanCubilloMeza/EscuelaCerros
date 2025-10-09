//dotenv nos permite leer las variables de entorno de nuestro .env
const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql2');

try {
    exports.connection = mysql.createPool({
        connectionLimit: 5,
        host: process.env.DBHOST,
        port: process.env.DBPORT || 3306,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME,
        multipleStatements: true,
        ssl: {
            rejectUnauthorized: false
        },
        connectTimeout: 60000,
        waitForConnections: true,
        queueLimit: 0
    });
    console.log("✅ Pool de conexiones configurado correctamente");
} catch (error) {
    console.log("❌ Error al configurar pool de conexiones:", error);
}