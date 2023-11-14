import React from "react";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Registration from "./Pages/Register";
import Home from "./Pages/Home";
import Persona from "./Pages/Estudiantes";
import Encargado from "./Pages/Encargado";
import Enfermedades from "./Pages/Enfermedades";
import Escolaridad from "./Pages/Escolaridad"
import Ocupacion from "./Pages/Ocupacion";
import Adecuacion from "./Pages/Adecuacion";
import Residente from "./Pages/Residente";
import Grado from "./Pages/Grado";
import Materias from "./Pages/Materias";
import Tareas from "./Pages/Tareas";
import Cotidiano from "./Pages/Cotidiano";
import Asistencia from "./Pages/Asistencia";
import Matricula from "./Pages/Matricula";
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/Theme";
function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Navbar/>  
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<Home/>} /> 
        <Route path="/Estudiantes" element={<Persona/>}/>
        <Route path="/Encargado" element={<Encargado/>}/>
        <Route path="/Enfermedades" element={<Enfermedades/>}/>     
        <Route path="/Escolaridad" element={<Escolaridad/>}/>
        <Route path="/Adecuacion" element={<Adecuacion/>}/>  
        <Route path="/Ocupacion" element={<Ocupacion/>}/>
        <Route path="/Residente" element={<Residente/>}/>
        <Route path="/Grado" element={<Grado/>}/>
        <Route path="/Materias" element={<Materias/>}/>
        <Route path="/Tareas" element={<Tareas/>}/>
        <Route path="/Cotidiano" element={<Cotidiano/>}/>
        <Route path="/Asistencia" element={<Asistencia/>}/>
        <Route path="/Matricula" element={<Matricula/>}/>


      </Routes>
    </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
