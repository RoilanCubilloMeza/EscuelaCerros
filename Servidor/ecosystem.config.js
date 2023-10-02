module.exports = {
    apps : [{
      name: 'Escuela Cerros',
      script: './index.js',
      watch: true,
      env: { 
          NODE_ENV: 'production',
       PORT: 3001, 
       DBHOST: 'localhost',
       DBUSER: 'root',
       DBPASS: '12345',
       DBNAME: 'prueba'
      }
    }] 
  };