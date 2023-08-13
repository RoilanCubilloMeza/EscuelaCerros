const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "prueba"
});

app.post("/create", (req, res) => {
  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const grado = req.body.grado;

  db.query(
    'INSERT INTO pruebas(nombre,edad,grado) VALUES(?,?,?)',
    [nombre, edad, grado],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("prueba lista");
      }
    }
  );
});
app.listen(3001, () => {
  console.log("estas en el puerto 3001");
});

app.get("/obtener",(req,res)=>{

    db.query('SELECT * FROM pruebas',
    (err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        }
    }
    )
})