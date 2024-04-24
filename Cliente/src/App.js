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
import Horarios from "./Pages/Horarios";
import Examen from "./Pages/Examen";
import Justificacion from "./Pages/Justificacion";
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
            <Route path="/Estudiantes" roles={[1, 2, 3]} element={<Persona />} />
            <Route path="/Encargado" roles={[1, 2, 3]} element={<Encargado />} />
            <Route path="/Enfermedades" roles={[1, 2, 3]} element={<Enfermedades />} />
            <Route path="/Escolaridad" roles={[1, 2, 3]} element={<Escolaridad />} />
            <Route path="/Adecuacion" roles={[1, 2, 3]} element={<Adecuacion />} />
            <Route path="/Ocupacion" roles={[1, 2, 3]} element={<Ocupacion />} />
            <Route path="/LugarResidencia" roles={[1, 2, 3]} element={<LugarResidencia />} />
            <Route path="/Grado" roles={[1, 2, 3]} element={<Grado />} />
            <Route path="/Materias" roles={[1, 2, 3]} element={<Materias />} />
            <Route path="/Examen" element={<Examen/>}/>
            <Route path="/Tareas" roles={[1, 2, 3]} element={<Tareas />} />
            <Route path="/Cotidiano" roles={[1, 2, 3]} element={<Cotidiano />} />
            <Route path="/Asistencia" roles={[1, 2, 3]} element={<Asistencia />} />
            <Route path="/Matricula" roles={[1, 2, 3]} element={<Matricula />} />
            <Route path="/AdminDashboard" roles={[1]} element={<AdminDashboard />} />
            <Route path="/ProfesorDashboard" roles={[2]} element={<ProfesorDashboard />} />
            <Route path="/EstudianteDashboard" roles={[3]} element={<EstudianteDashboard />} /> 
            <Route path="/Usuarios" roles={[1, 2, 3]} element={<Usuarios/>}/>
            <Route path="/Roles" roles={[1, 2, 3]} element={<Roles/>}/>
            <Route path="/Noticias" roles={[1, 2, 3]} element={<Noticias/>}/>
            <Route path="/Parentesco" roles={[1, 2, 3]} element={<Parentesco/>}/>
            <Route path="/Horarios" element={<Horarios/>}/>
            <Route path="/Justificacion" element={<Justificacion/>}/>

          </Routes>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
