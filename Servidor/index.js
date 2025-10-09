const express = require("express");
//const session = require("express-session");
const app = express();

//nos ayuda a analizar el cuerpo de la solicitud POST
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var cors = require('cors')

// Configuración de CORS para permitir Vercel y localhost
const corsOptions = {
  origin: [
    'https://escuela-cerros.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions))

//cargamos el archivo de rutas
app.use(require('./services/Encargado'));
app.use(require('./services/Enfermedades'));
app.use(require('./services/Escolaridad'));
app.use(require('./services/Estudiantes'));
app.use(require('./services/Funcionario'));
app.use(require('./services/Ocupacion'));
app.use(require('./services/Parentesco'));
app.use(require('./services/Personas'));
app.use(require('./services/Adecuacion'));
app.use(require('./services/Residente'));
app.use(require('./services/Prueba'));
app.use(require('./services/Grado'));
app.use(require('./services/ValorTareas'));
app.use(require('./services/Materias'))
app.use(require('./services/Cotidiano'))
app.use(require('./services/Asistencia'))
app.use(require('./services/Usuarios'))
app.use(require('./services/Roles'))
app.use(require('./services/Parentesco'))
app.use(require('./services/Examen'))
app.use(require('./services/Justificacion'))
app.use(require('./services/Noticias'))
app.use(require('./services/Notas'))
app.use(require('./services/NotasFinales'))
app.use(require('./services/Profesores'))
app.use(require('./services/Notificaciones')) // 📬 Nuevo servicio


app.listen(process.env.PORT||3001,() => {
    console.log("Servidor corriendo en el puerto 3001");
});
module.exports = app;