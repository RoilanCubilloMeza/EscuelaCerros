const express = require("express");
//const session = require("express-session");
const app = express();

//nos ayuda a analizar el cuerpo de la solicitud POST
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var cors = require('cors')
app.use(cors())

//cargamos el archivo de rutas
app.use(require('./services/Matricula'));
app.use(require('./services/Funcionario'));


app.listen(process.env.PORT||3001,() => {
    console.log("Servidor corriendo en el puerto 3001");
});
module.exports = app;