import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const NotasEstudiante = () => {
    const [notas, setNotas] = useState([]);
    const [estudianteInfo, setEstudianteInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { darkMode } = useTheme();

    useEffect(() => {
      if (darkMode) {
        document.body.classList.add("bg-dark");
        document.body.classList.add("text-white");
      } else {
        document.body.classList.remove("bg-dark");
        document.body.classList.remove("text-white");
        document.body.classList.add("bg-light");
        document.body.classList.add("text-dark");
      }
      return () => {
        document.body.classList.remove(
          "bg-dark",
          "text-white",
          "bg-light",
          "text-dark"
        );
      };
    }, [darkMode]);

    const obtenerNotasAutomaticamente = async () => {
        try {
            setLoading(true);
            
            // Obtener username del localStorage
            const username = localStorage.getItem("username");
            
            if (!username) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se encontró información del usuario. Por favor, inicie sesión nuevamente."
                });
                return;
            }

            // Obtener información del estudiante por username
            const estudianteResponse = await Axios.get(`${API_BASE_URL}/estudiantePorUsuario?username=${username}`);
            
            if (!estudianteResponse.data) {
                Swal.fire({
                    icon: "warning",
                    title: "Información no disponible",
                    text: "No se encontró información del estudiante asociada a este usuario."
                });
                setLoading(false);
                return;
            }

            setEstudianteInfo(estudianteResponse.data);

            // Obtener notas del estudiante
            const notasResponse = await Axios.get(`${API_BASE_URL}/notasPorEstudiante?estudianteId=${estudianteResponse.data.Estudiantes_id}`);
            
            // Ordenar las notas por materia y periodo
            const notasOrdenadas = notasResponse.data.sort((a, b) => {
                // Primero ordenar por materia
                const materiaCompare = a.Materias_Nombre.localeCompare(b.Materias_Nombre);
                if (materiaCompare !== 0) return materiaCompare;
                
                // Luego por periodo
                const periodoA = convertirPeriodoANumero(a.Nota_Periodo);
                const periodoB = convertirPeriodoANumero(b.Nota_Periodo);
                return periodoA - periodoB;
            });
            
            setNotas(notasOrdenadas);
            
            if (notasOrdenadas.length === 0) {
                Swal.fire({
                    icon: "info",
                    title: "Sin notas",
                    text: "No hay notas registradas para este estudiante."
                });
            }
            
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || "Hubo un problema al obtener las notas del estudiante."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerNotasAutomaticamente();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const convertirPeriodoANumero = (periodo) => {
        switch (periodo) {
            case "I Periodo":
            case 1:
                return 1;
            case "II Periodo":
            case 2:
                return 2;
            case "III Periodo":
            case 3:
                return 3;
            default:
                return 4;
        }
    };

    // Agrupar notas por materia
    const agruparPorMateria = () => {
        const grupos = {};
        notas.forEach(nota => {
            if (!grupos[nota.Materias_Nombre]) {
                grupos[nota.Materias_Nombre] = [];
            }
            grupos[nota.Materias_Nombre].push(nota);
        });
        return grupos;
    };

    const notasAgrupadas = agruparPorMateria();

    return (
        <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
            <div className="container py-4">
                {/* Header */}
                <div className="noticias-header mb-5">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="title-icon">
                                📊
                            </div>
                            <div>
                                <h1 className="noticias-title mb-1">Mis Calificaciones</h1>
                                {estudianteInfo && (
                                    <p className="noticias-subtitle mb-0">
                                        {estudianteInfo.Persona_Nombre} {estudianteInfo.Persona_PApellido} {estudianteInfo.Persona_SApellido}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Link to="/EstudianteDashboard" className="btn-back">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver
                        </Link>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando tus calificaciones...</p>
                    </div>
                )}

                {/* Results Table Card - Agrupado por Materia con Desglose */}
                {!loading && notas.length > 0 && (
                    <div className="row g-4">
                        {Object.entries(notasAgrupadas).map(([materia, notasMateria]) => {
                            const notasValidas = notasMateria.filter(n => n.Nota_Total);
                            const promedio = notasValidas.length > 0 
                                ? (notasValidas.reduce((sum, n) => sum + n.Nota_Total, 0) / notasValidas.length).toFixed(1)
                                : 'N/A';
                            const aprobado = promedio >= 65;
                            
                            return (
                                <div key={materia} className="col-12">
                                    <div className="card shadow-sm">
                                        <div className="card-header" style={{
                                            background: darkMode 
                                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '1.2rem'
                                        }}>
                                            📚 {materia}
                                            {promedio !== 'N/A' && (
                                                <span className="float-end">
                                                    Promedio: 
                                                    <span className={`badge ms-2 ${aprobado ? 'bg-success' : 'bg-danger'}`} 
                                                        style={{ fontSize: '1rem', padding: '0.5rem 0.75rem' }}>
                                                        {promedio}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                                                    <thead style={{
                                                        background: darkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'
                                                    }}>
                                                        <tr>
                                                            <th style={{ width: '15%' }}>Periodo</th>
                                                            <th className="text-center" style={{ width: '10%' }}>
                                                                <span title="Asistencia (5%)">📋 Asist.</span>
                                                            </th>
                                                            <th className="text-center" style={{ width: '10%' }}>
                                                                <span title="Cotidiano (15%)">📝 Cotid.</span>
                                                            </th>
                                                            <th className="text-center" style={{ width: '10%' }}>
                                                                <span title="Tareas (25%)">📚 Tareas</span>
                                                            </th>
                                                            <th className="text-center" style={{ width: '10%' }}>
                                                                <span title="Examen (60%)">📄 Examen</span>
                                                            </th>
                                                            <th className="text-center" style={{ width: '12%' }}>
                                                                <strong>Total</strong>
                                                            </th>
                                                            <th className="text-center" style={{ width: '15%' }}>
                                                                Estado
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {notasMateria.map((nota, index) => {
                                                            const total = nota.Nota_Total || 0;
                                                            const estado = total >= 70 ? 'Aprobado' : total >= 65 ? 'Aprobado (Mínimo)' : total > 0 ? 'Reprobado' : 'Sin Nota';
                                                            const estadoColor = total >= 70 ? 'success' : total >= 65 ? 'warning' : total > 0 ? 'danger' : 'secondary';
                                                            
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <span className="badge bg-primary" style={{ fontSize: '0.95rem', padding: '0.4rem 0.7rem' }}>
                                                                            {nota.Nota_Periodo || 'N/A'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <span style={{ 
                                                                            fontWeight: '500',
                                                                            color: darkMode ? '#fff' : '#333'
                                                                        }}>
                                                                            {nota.VA_Valor !== null && nota.VA_Valor !== undefined ? nota.VA_Valor : '-'}
                                                                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>/ 5</small>
                                                                        </span>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <span style={{ 
                                                                            fontWeight: '500',
                                                                            color: darkMode ? '#fff' : '#333'
                                                                        }}>
                                                                            {nota.Cotidiano_Puntos !== null && nota.Cotidiano_Puntos !== undefined ? nota.Cotidiano_Puntos : '-'}
                                                                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>/ 15</small>
                                                                        </span>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <span style={{ 
                                                                            fontWeight: '500',
                                                                            color: darkMode ? '#fff' : '#333'
                                                                        }}>
                                                                            {nota.Tareas_Puntos !== null && nota.Tareas_Puntos !== undefined ? nota.Tareas_Puntos : '-'}
                                                                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>/ 25</small>
                                                                        </span>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <span style={{ 
                                                                            fontWeight: '500',
                                                                            color: darkMode ? '#fff' : '#333'
                                                                        }}>
                                                                            {nota.Examen_Puntos !== null && nota.Examen_Puntos !== undefined ? nota.Examen_Puntos : '-'}
                                                                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>/ 60</small>
                                                                        </span>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <span className={`badge bg-${estadoColor}`} 
                                                                            style={{ 
                                                                                fontSize: '1.1rem', 
                                                                                padding: '0.5rem 0.8rem',
                                                                                fontWeight: 'bold'
                                                                            }}>
                                                                            {total || '-'}
                                                                        </span>
                                                                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>/ 100</small>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <span className={`badge bg-${estadoColor}`} 
                                                                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}>
                                                                            {estado}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && notas.length === 0 && (
                    <div className="noticias-form-card text-center py-5">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                        <h3>No hay calificaciones disponibles</h3>
                        <p className="text-muted">Aún no se han registrado notas para este estudiante.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotasEstudiante;
