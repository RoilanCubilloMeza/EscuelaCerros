module.exports = {
    apps : [{
      name: 'EscuelaCerros',
      script: './index.js',
      watch: true,
      env: { 
          NODE_ENV: 'production',
       PORT: 3001, 
       DBHOST: 'localhost',
       DBUSER: 'root',
       DBPASS: '12345',
       DBNAME: 'escuelacerros'
      }
    }] 
  };