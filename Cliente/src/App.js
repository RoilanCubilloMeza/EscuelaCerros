import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import { ThemeProvider } from "./components/Theme";
import Navbar from "./components/Navbar";
import {
  AdminRoute,
  ProfesorRoute,
  EstudianteRoute,
  MultiRoleRoute,
} from "./components/PrivateRoute";
import Login from "./Pages/Login";
import Registration from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
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
import Profesores from "./Pages/Profesores";
import AdminDashboard from "./Dashboard/AdminDashboard";
import ProfesorDashboard from "./Dashboard/ProfesorDashboard";
import EstudianteDashboard from "./Dashboard/EstudianteDashboard";
import Usuarios from "./Pages/Usuarios";
import Noticias from "./Pages/Noticias";
import Roles from "./Pages/Roles";
import Parentesco from "./Pages/Perentesco";
import Horarios from "./Pages/Horarios";
import Examen from "./Pages/Examen";
import Justificacion from "./Pages/Justificacion";
import Notas from "./Pages/Notas";
import NotasEstudiante from "./Pages/NotasEstudiante";
import NotasFinales from "./Pages/NotasFinales";
import JustificacionProfesor from "./Pages/JustificacionProfesor";
import PasarLista from "./Pages/PasarLista";
import ConfiguracionPorcentajes from "./Pages/ConfiguracionPorcentajes";

function App() {
  const [refresh, setRefresh] = useState(false);
  const isAuthenticated = localStorage.getItem("token") !== null;

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prevRefresh) => !prevRefresh);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/Horarios" element={<Horarios />} />
            <Route
              path="/Estudiantes"
              element={
                <MultiRoleRoute allowedRoles={[1, 2]}>
                  <Persona />
                </MultiRoleRoute>
              }
            />
            <Route
              path="/Encargado"
              element={
                <MultiRoleRoute allowedRoles={[1, 2]}>
                  <Encargado />
                </MultiRoleRoute>
              }
            />
            <Route
              path="/Enfermedades"
              element={
                <MultiRoleRoute allowedRoles={[1, 2]}>
                  <Enfermedades />
                </MultiRoleRoute>
              }
            />
            <Route
              path="/Escolaridad"
              element={
                isAuthenticated ? (
                  <Escolaridad />
                ) : (
                  <Navigate to="/Enfermedades" replace />
                )
              }
            />
            <Route
              path="/Adecuacion"
              element={
                isAuthenticated ? (
                  <Adecuacion />
                ) : (
                  <Navigate to="/Adecuacion" replace />
                )
              }
            />
            <Route
              path="/Ocupacion"
              element={
                isAuthenticated ? (
                  <Ocupacion />
                ) : (
                  <Navigate to="/Ocupacion" replace />
                )
              }
            />
            <Route
              path="/LugarResidencia"
              element={
                isAuthenticated ? (
                  <LugarResidencia />
                ) : (
                  <Navigate to="/LugarResidencia" replace />
                )
              }
            />
            <Route
              path="/Grado"
              element={
                isAuthenticated ? <Grado /> : <Navigate to="/Grado" replace />
              }
            />
            <Route
              path="/Matricula"
              element={
                isAuthenticated ? (
                  <Matricula />
                ) : (
                  <Navigate to="/Matricula" replace />
                )
              }
            />
            <Route
              path="/Profesores"
              element={
                isAuthenticated ? (
                  <Profesores />
                ) : (
                  <Navigate to="/Profesores" replace />
                )
              }
            />
            <Route
              path="/Usuarios"
              element={
                <AdminRoute>
                  <Usuarios />
                </AdminRoute>
              }
            />
            <Route
              path="/Roles"
              element={
                <AdminRoute>
                  <Roles />
                </AdminRoute>
              }
            />
            <Route
              path="/Noticias"
              element={
                <AdminRoute>
                  <Noticias />
                </AdminRoute>
              }
            />
            <Route
              path="/NotasEstudiante"
              element={
                isAuthenticated ? (
                  <NotasEstudiante />
                ) : (
                  <Navigate to="/NotasEstudiante" replace />
                )
              }
            />
            <Route
              path="/Parentesco"
              element={
                isAuthenticated ? (
                  <Parentesco />
                ) : (
                  <Navigate to="/Parentesco" replace />
                )
              }
            />
            <Route
              path="/Materias"
              element={
                isAuthenticated ? (
                  <Materias />
                ) : (
                  <Navigate to="/Materias" replace />
                )
              }
            />
            <Route
              path="/Examen"
              element={
                isAuthenticated ? <Examen /> : <Navigate to="/Examen" replace />
              }
            />
            <Route
              path="/Tareas"
              element={
                isAuthenticated ? <Tareas /> : <Navigate to="/Tareas" replace />
              }
            />
            <Route
              path="/Cotidiano"
              element={
                isAuthenticated ? (
                  <Cotidiano />
                ) : (
                  <Navigate to="/Cotidiano" replace />
                )
              }
            />
            <Route
              path="/Asistencia"
              element={
                isAuthenticated ? (
                  <Asistencia />
                ) : (
                  <Navigate to="/Asistencia" replace />
                )
              }
            />
            <Route
              path="/Justificacion"
              element={
                isAuthenticated ? (
                  <Justificacion />
                ) : (
                  <Navigate to="/Justificacion" replace />
                )
              }
            />
            <Route
              path="/AdminDashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/ProfesorDashboard"
              element={
                <ProfesorRoute>
                  <ProfesorDashboard />
                </ProfesorRoute>
              }
            />
            <Route
              path="/PasarLista"
              element={
                <ProfesorRoute>
                  <PasarLista />
                </ProfesorRoute>
              }
            />
            <Route
              path="/ConfiguracionPorcentajes"
              element={
                <ProfesorRoute>
                  <ConfiguracionPorcentajes />
                </ProfesorRoute>
              }
            />
            <Route
              path="/EstudianteDashboard"
              element={
                <EstudianteRoute>
                  <EstudianteDashboard />
                </EstudianteRoute>
              }
            />
            <Route
              path="/Notas"
              element={
                isAuthenticated ? <Notas /> : <Navigate to="/Notas" replace />
              }
            />
            <Route
              path="/NotasFinales"
              element={
                isAuthenticated ? (
                  <NotasFinales />
                ) : (
                  <Navigate to="/NotasFinales" replace />
                )
              }
            />
            <Route
              path="/JustificacionProfesor"
              element={
                isAuthenticated ? (
                  <JustificacionProfesor />
                ) : (
                  <Navigate to="/JustificacionProfesor" replace />
                )
              }
            />
          </Routes>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
