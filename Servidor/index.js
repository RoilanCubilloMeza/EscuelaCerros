const express = require("express");
//const session = require("express-session");
const app = express();
const { verifyToken, verifyRole } = require("./middleware/auth");

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

// ❤️ Health check endpoint para mantener el servidor activo
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor Escuela Cerros activo',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 🏠 Ruta principal
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🎓 API Escuela Cerros',
    version: '1.0',
    status: 'online',
    endpoints: {
      health: '/health',
      estudiantes: '/obtenerMatricula',
      materias: '/obtenerMaterias',
      notas: '/obtenerNotas',
      noticias: '/obtenerEventos'
    }
  });
});

//cargamos el archivo de rutas

// Rutas públicas (sin autenticación)
app.use(require('./services/Funcionario'));   // login, registro, logout
app.use(require('./services/Noticias'));      // eventos públicos + imágenes
app.use(require('./services/Usuarios').publicRouter); // verificación, recuperación de contraseña

// Rutas protegidas (requieren token JWT)
app.use(verifyToken, require('./services/Encargado'));
app.use(verifyToken, require('./services/Enfermedades'));
app.use(verifyToken, require('./services/Escolaridad'));
app.use(verifyToken, require('./services/Estudiantes'));
app.use(verifyToken, require('./services/Ocupacion'));
app.use(verifyToken, require('./services/Parentesco'));
app.use(verifyToken, require('./services/Personas'));
app.use(verifyToken, require('./services/Adecuacion'));
app.use(verifyToken, require('./services/Residente'));
app.use(verifyToken, require('./services/Prueba'));
app.use(verifyToken, require('./services/Grado'));
app.use(verifyToken, require('./services/ValorTareas'));
app.use(verifyToken, require('./services/Materias'));
app.use(verifyToken, require('./services/Cotidiano'));
app.use(verifyToken, require('./services/Asistencia'));
app.use(verifyToken, require('./services/Usuarios'));
app.use(verifyToken, require('./services/Roles'));
app.use(verifyToken, require('./services/Examen'));
app.use(verifyToken, require('./services/Justificacion'));
app.use(verifyToken, require('./services/Notas'));
app.use(verifyToken, require('./services/NotasFinales'));
app.use(verifyToken, require('./services/Profesores'));
app.use('/notificaciones', verifyToken, require('./services/Notificaciones'));
app.use(verifyToken, require('./services/AsistenciaEstudiantes'));
app.use(verifyToken, require('./services/ConfiguracionPorcentajes'));


app.listen(process.env.PORT||3001,() => {
    console.log("Servidor corriendo en el puerto 3001");
});
module.exports = app;