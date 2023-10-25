import React from "react";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Registration from "./Pages/Register";
import Home from "./Pages/Home";
import Matricula from "./Pages/Estudiantes";
import Encargado from "./Pages/Encargado";
import Enfermedades from "./Pages/Enfermedades";
import Escolaridad from "./Pages/Escolaridad"
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
        <Route path="/Estudiantes" element={<Matricula/>}/>
        <Route path="/Encargado" element={<Encargado/>}/>
        <Route path="/Enfermedades" element={<Enfermedades/>}/>     
           <Route path="/Escolaridad" element={<Escolaridad/>}/>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
