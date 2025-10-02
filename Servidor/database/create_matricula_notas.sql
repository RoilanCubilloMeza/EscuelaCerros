-- Script para crear la tabla Matricula_Notas
-- Esta tabla permite asociar múltiples notas (una por periodo) con cada matrícula

CREATE TABLE IF NOT EXISTS Matricula_Notas (
  Matricula_Notas_Id INT AUTO_INCREMENT PRIMARY KEY,
  Matricula_Id INT NOT NULL,
  Nota_Id INT NOT NULL,
  Nota_Periodo INT NOT NULL,
  Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (Matricula_Id) REFERENCES Matricula(Matricula_Id) ON DELETE CASCADE,
  FOREIGN KEY (Nota_Id) REFERENCES Nota_Final(Nota_Id) ON DELETE CASCADE,
  
  -- Evitar duplicados: una matrícula solo puede tener una nota por periodo
  UNIQUE KEY unique_matricula_periodo (Matricula_Id, Nota_Periodo),
  
  -- Índices para mejorar el rendimiento de las consultas
  INDEX idx_matricula (Matricula_Id),
  INDEX idx_nota (Nota_Id),
  INDEX idx_periodo (Nota_Periodo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentario sobre el propósito de la tabla
ALTER TABLE Matricula_Notas COMMENT = 'Tabla de relación que vincula matrículas con notas por periodo. Permite que un estudiante tenga múltiples notas (I, II, III periodo) para cada materia matriculada.';
