/**
 * Script para crear la tabla Notificaciones
 * Ejecutar con: node migrations/ejecutar_crear_notificaciones.js
 */

const fs = require('fs');
const path = require('path');
const { connection } = require('../config');

console.log('🔧 Iniciando creación de tabla Notificaciones...\n');

// Leer el archivo SQL
const sqlFilePath = path.join(__dirname, 'crear_tabla_notificaciones.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Dividir las consultas por punto y coma
const queries = sqlContent
  .split(';')
  .map(q => q.trim())
  .filter(q => q.length > 0 && !q.startsWith('--'));

console.log(`📄 Se encontraron ${queries.length} consultas para ejecutar\n`);

// Función para ejecutar consultas secuencialmente
async function ejecutarConsultas() {
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    
    // Saltar comentarios
    if (query.startsWith('--')) continue;
    
    try {
      console.log(`⏳ Ejecutando consulta ${i + 1}/${queries.length}...`);
      
      await new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
          if (err) {
            // Si la tabla ya existe, no es un error crítico
            if (err.code === 'ER_TABLE_EXISTS_ERROR') {
              console.log('⚠️  La tabla ya existe, continuando...');
              resolve();
            } else {
              reject(err);
            }
          } else {
            console.log('✅ Consulta ejecutada correctamente');
            if (result && Array.isArray(result) && result.length > 0) {
              console.log('📊 Resultado:', result[0]);
            }
            resolve(result);
          }
        });
      });
      
    } catch (error) {
      console.error(`❌ Error ejecutando consulta ${i + 1}:`, error.message);
      throw error;
    }
  }
}

// Ejecutar el proceso
ejecutarConsultas()
  .then(() => {
    console.log('\n✅ ¡Tabla Notificaciones creada exitosamente!\n');
    console.log('📋 Verificando estructura...');
    
    // Verificar la tabla
    connection.query(
      'DESCRIBE Notificaciones',
      (err, result) => {
        if (err) {
          console.error('❌ Error al verificar tabla:', err.message);
        } else {
          console.log('\n📊 Estructura de la tabla Notificaciones:');
          console.table(result);
          console.log('\n🎉 ¡Todo listo! La tabla está operativa.\n');
        }
        connection.end();
        process.exit(0);
      }
    );
  })
  .catch((error) => {
    console.error('\n❌ Error fatal durante la migración:', error);
    connection.end();
    process.exit(1);
  });
