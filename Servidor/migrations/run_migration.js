// Script para ejecutar la migración de agregar campos de seguridad
const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT || 3306,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    multipleStatements: true,
    ssl: {
        rejectUnauthorized: false
    }
});

console.log("🔄 Iniciando migración de campos de seguridad...");

// Verificar si las columnas ya existen
connection.query(
    "SHOW COLUMNS FROM Usuarios LIKE 'Pregunta_Seguridad'",
    (err, result) => {
        if (err) {
            console.error("❌ Error al verificar columnas:", err);
            connection.end();
            return;
        }

        if (result.length > 0) {
            console.log("✅ Las columnas de seguridad ya existen");
            connection.end();
            return;
        }

        // Agregar columnas si no existen
        const sql = `
            ALTER TABLE Usuarios 
            ADD COLUMN Pregunta_Seguridad VARCHAR(255) NULL AFTER Usuarios_contraseña,
            ADD COLUMN Respuesta_Seguridad VARCHAR(255) NULL AFTER Pregunta_Seguridad;
        `;

        connection.query(sql, (err, result) => {
            if (err) {
                console.error("❌ Error al agregar columnas:", err);
                connection.end();
                return;
            }

            console.log("✅ Columnas agregadas exitosamente:");
            console.log("   - Pregunta_Seguridad (VARCHAR 255)");
            console.log("   - Respuesta_Seguridad (VARCHAR 255)");

            // Agregar datos de ejemplo para usuarios existentes (opcional)
            const updateSql = `
                UPDATE Usuarios 
                SET Pregunta_Seguridad = '¿Cuál es el nombre de tu primera mascota?',
                    Respuesta_Seguridad = 'respuesta'
                WHERE Pregunta_Seguridad IS NULL;
            `;

            connection.query(updateSql, (err, result) => {
                if (err) {
                    console.error("⚠️ Advertencia al actualizar usuarios existentes:", err);
                } else {
                    console.log(`✅ ${result.affectedRows} usuario(s) actualizados con pregunta por defecto`);
                    console.log("   ⚠️ IMPORTANTE: Los usuarios deben cambiar su pregunta y respuesta de seguridad");
                }

                connection.end();
                console.log("✅ Migración completada exitosamente");
                console.log("   Puedes reiniciar el servidor ahora");
            });
        });
    }
);
