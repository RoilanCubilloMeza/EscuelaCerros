import React from "react";
import { UserProvider } from "./components/UserContext";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Registration from "./Pages/Register";
import Home from "./Pages/Home";
import Persona from "./Pages/Estudiantes";
import Encargado from "./Pages/Encargado";
import Enfermedades from "./Pages/Enfermedades";
import Escolaridad from "./Pages/Escolaridad";
import Ocupacion from "./Pages/Ocupacion";
import Adecuacion from "./Pages/Adecuacion";
import LugarResidencia from "./Pages/LugarResidencia";
import Grado from "./Pages/Grado";
import Materias from "./Pages/Materias";
import Tareas from "./Pages/Tareas";
import Cotidiano from "./Pages/Cotidiano";
import Asistencia from "./Pages/Asistencia";
import Matricula from "./Pages/Matricula";
import AdminDashboard from "./Dashboard/AdminDashboard";
import ProfesorDashboard from "./Dashboard/ProfesorDashboard";
import EstudianteDashboard from "./Dashboard/EstudianteDashboard";
import Usuarios from "./Pages/Usuarios";
import Noticias from "./Pages/Noticias";
import Roles from "./Pages/Roles";
import Parentesco from "./Pages/Perentesco";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/Theme";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <Navbar/>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/" element={<Home/>} />
            <Route path="/Estudiantes" element={<Persona />} />
            <Route path="/Encargado" element={<Encargado />} />
            <Route path="/Enfermedades" element={<Enfermedades />} />
            <Route path="/Escolaridad" element={<Escolaridad />} />
            <Route path="/Adecuacion" element={<Adecuacion />} />
            <Route path="/Ocupacion" element={<Ocupacion />} />
            <Route path="/LugarResidencia" element={<LugarResidencia />} />
            <Route path="/Grado" element={<Grado />} />
            <Route path="/Materias" element={<Materias />} />
            <Route path="/Tareas" element={<Tareas />} />
            <Route path="/Cotidiano" element={<Cotidiano />} />
            <Route path="/Asistencia" element={<Asistencia />} />
            <Route path="/Matricula" element={<Matricula />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/ProfesorDashboard" element={<ProfesorDashboard />} />
            <Route path="/EstudianteDashboard" element={<EstudianteDashboard />} /> 
            <Route path="/Usuarios" element={<Usuarios/>}/>
            <Route path="/Roles" element={<Roles/>}/>
            <Route path="/Noticias" element={<Noticias/>}/>
            <Route path="/Parentesco" element={<Parentesco/>}/>
          </Routes>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
