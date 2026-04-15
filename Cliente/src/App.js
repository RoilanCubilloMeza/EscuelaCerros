import React from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import MisCalificaciones from "./Pages/MisCalificaciones";
import SecuritySettings from "./Pages/SecuritySettings";
import ErrorBoundary from "./components/ErrorBoundary";

// Componente wrapper para forzar re-render en cambios de ruta
function AppRoutes() {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/Horarios" element={<Horarios />} />

            {/* Dashboards por rol */}
            <Route path="/AdminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/ProfesorDashboard" element={<ProfesorRoute><ProfesorDashboard /></ProfesorRoute>} />
            <Route path="/EstudianteDashboard" element={<EstudianteRoute><EstudianteDashboard /></EstudianteRoute>} />

            {/* Solo Admin */}
            <Route path="/Usuarios" element={<AdminRoute><Usuarios /></AdminRoute>} />
            <Route path="/Roles" element={<AdminRoute><Roles /></AdminRoute>} />
            <Route path="/Noticias" element={<AdminRoute><Noticias /></AdminRoute>} />

            {/* Admin y Profesor */}
            <Route path="/Estudiantes" element={<MultiRoleRoute allowedRoles={[1, 2]}><Persona /></MultiRoleRoute>} />
            <Route path="/Encargado" element={<MultiRoleRoute allowedRoles={[1, 2]}><Encargado /></MultiRoleRoute>} />
            <Route path="/Enfermedades" element={<MultiRoleRoute allowedRoles={[1, 2]}><Enfermedades /></MultiRoleRoute>} />
            <Route path="/Escolaridad" element={<MultiRoleRoute allowedRoles={[1, 2]}><Escolaridad /></MultiRoleRoute>} />
            <Route path="/Adecuacion" element={<MultiRoleRoute allowedRoles={[1, 2]}><Adecuacion /></MultiRoleRoute>} />
            <Route path="/Ocupacion" element={<MultiRoleRoute allowedRoles={[1, 2]}><Ocupacion /></MultiRoleRoute>} />
            <Route path="/LugarResidencia" element={<MultiRoleRoute allowedRoles={[1, 2]}><LugarResidencia /></MultiRoleRoute>} />
            <Route path="/Parentesco" element={<MultiRoleRoute allowedRoles={[1, 2]}><Parentesco /></MultiRoleRoute>} />
            <Route path="/Grado" element={<MultiRoleRoute allowedRoles={[1, 2]}><Grado /></MultiRoleRoute>} />
            <Route path="/Matricula" element={<MultiRoleRoute allowedRoles={[1, 2]}><Matricula /></MultiRoleRoute>} />
            <Route path="/Profesores" element={<MultiRoleRoute allowedRoles={[1, 2]}><Profesores /></MultiRoleRoute>} />
            <Route path="/Materias" element={<MultiRoleRoute allowedRoles={[1, 2]}><Materias /></MultiRoleRoute>} />
            <Route path="/Residente" element={<MultiRoleRoute allowedRoles={[1, 2]}><LugarResidencia /></MultiRoleRoute>} />

            {/* Profesor */}
            <Route path="/PasarLista" element={<MultiRoleRoute allowedRoles={[1, 2]}><PasarLista /></MultiRoleRoute>} />
            <Route path="/ConfiguracionPorcentajes" element={<ProfesorRoute><ConfiguracionPorcentajes /></ProfesorRoute>} />
            <Route path="/Notas" element={<MultiRoleRoute allowedRoles={[1, 2]}><Notas /></MultiRoleRoute>} />
            <Route path="/NotasFinales" element={<MultiRoleRoute allowedRoles={[1, 2]}><NotasFinales /></MultiRoleRoute>} />
            <Route path="/NotasEstudiante" element={<MultiRoleRoute allowedRoles={[1, 2, 3]}><NotasEstudiante /></MultiRoleRoute>} />
            <Route path="/JustificacionProfesor" element={<ProfesorRoute><JustificacionProfesor /></ProfesorRoute>} />
            <Route path="/Examen" element={<MultiRoleRoute allowedRoles={[1, 2]}><Examen /></MultiRoleRoute>} />
            <Route path="/Tareas" element={<MultiRoleRoute allowedRoles={[1, 2]}><Tareas /></MultiRoleRoute>} />
            <Route path="/Cotidiano" element={<MultiRoleRoute allowedRoles={[1, 2]}><Cotidiano /></MultiRoleRoute>} />
            <Route path="/Asistencia" element={<MultiRoleRoute allowedRoles={[1, 2]}><Asistencia /></MultiRoleRoute>} />

            {/* Estudiante */}
            <Route path="/MisCalificaciones" element={<EstudianteRoute><MisCalificaciones /></EstudianteRoute>} />
            <Route path="/Justificacion" element={<EstudianteRoute><Justificacion /></EstudianteRoute>} />

            {/* Seguridad */}
            <Route path="/SecuritySettings" element={<MultiRoleRoute allowedRoles={[1, 2, 3]}><SecuritySettings /></MultiRoleRoute>} />

            {/* Ruta comodín */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <UserProvider>
        <ThemeProvider>
          <Navbar />
          <AppRoutes />
        </ThemeProvider>
      </UserProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
