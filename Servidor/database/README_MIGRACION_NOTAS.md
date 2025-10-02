# Corrección del Sistema de Notas

## Problema Identificado

El sistema anterior solo podía almacenar **UNA nota por estudiante y materia** porque la tabla `Matricula` tenía un solo campo `Nota_Id`. Esto impedía guardar notas de los tres periodos (I, II, III).

## Solución Implementada

Se creó una nueva tabla intermedia llamada `Matricula_Notas` que permite:
- ✅ Asociar múltiples notas con una misma matrícula
- ✅ Diferenciar notas por periodo (1, 2, 3)
- ✅ Evitar duplicados (una nota por periodo y materia)
- ✅ Mantener la integridad referencial con claves foráneas

## Estructura de la Nueva Tabla

```sql
Matricula_Notas
├── Matricula_Notas_Id (PK)
├── Matricula_Id (FK → Matricula)
├── Nota_Id (FK → Nota_Final)
├── Nota_Periodo (1, 2, 3)
├── Fecha_Creacion
└── Fecha_Modificacion
```

## Cómo Aplicar los Cambios

### Paso 1: Crear la Tabla en la Base de Datos

**Opción A - Usando el Endpoint (Recomendado):**
1. Asegúrate de que el servidor esté corriendo
2. Haz una petición POST a: `http://localhost:4000/crearTablaMatriculaNotas`
3. Recibirás la confirmación: "Tabla Matricula_Notas creada exitosamente"

**Opción B - Usando MySQL Workbench o phpMyAdmin:**
1. Abre el archivo `Servidor/database/create_matricula_notas.sql`
2. Ejecuta el script SQL en tu base de datos

**Opción C - Desde la terminal:**
```bash
cd C:\Users\roila\Documents\EscuelaCerros\Servidor
mysql -u root -p nombre_de_tu_base_de_datos < database/create_matricula_notas.sql
```

### Paso 2: Reiniciar el Servidor

```bash
cd C:\Users\roila\Documents\EscuelaCerros\Servidor
npm start
```

## Cambios en el Código

### Backend (Notas.js)

1. **Nuevo Endpoint**: `/crearTablaMatriculaNotas`
   - Crea automáticamente la tabla si no existe

2. **Nuevo Endpoint**: `/vincularNotaMatricula`
   - Vincula manualmente una nota con una matrícula

3. **Modificado**: `/agregarNota`
   - Ahora vincula automáticamente la nota con la matrícula usando `Matricula_Notas`
   - Verifica que el estudiante esté matriculado antes de agregar la nota

4. **Modificado**: `/notasPorEstudiante`
   - Ahora usa JOIN con `Matricula_Notas` para traer todas las notas por periodo
   - Incluye detalles de asistencia, cotidiano, tareas y examen

5. **Modificado**: `/notasCDetalladas`
   - Actualizado para usar la nueva tabla de relación

### Frontend (Sin cambios necesarios)

El frontend (Notas.jsx y NotasEstudiante.jsx) **NO requiere cambios** porque:
- Los endpoints mantienen la misma interfaz
- La estructura de datos de respuesta es compatible
- Todo funciona automáticamente después de crear la tabla

## Cómo Funciona Ahora

### Flujo de Agregar Nota:

1. Profesor selecciona estudiante, materia y periodo
2. Ingresa las calificaciones (asistencia, cotidiano, tareas, examen)
3. Sistema calcula la nota total automáticamente
4. Al hacer clic en "Agregar Nota":
   - Se crean registros en las tablas de valores (Valor_asistencia, etc.)
   - Se crea un registro en Nota_Final
   - Se busca la Matricula_Id correspondiente
   - Se crea un registro en Matricula_Notas vinculando todo

### Flujo de Ver Notas del Estudiante:

1. Estudiante inicia sesión
2. Entra a "Mis Notas"
3. Sistema obtiene su username de localStorage
4. Busca el Estudiantes_id
5. Consulta todas las matrículas del estudiante
6. Para cada matrícula, trae TODAS las notas (I, II, III periodo) mediante Matricula_Notas
7. Muestra las notas agrupadas por materia con promedio

## Ventajas del Nuevo Sistema

✅ **Múltiples notas por materia**: Ahora se pueden guardar I, II y III periodo
✅ **Histórico completo**: No se sobrescriben las notas anteriores
✅ **Integridad de datos**: Claves foráneas previenen datos huérfanos
✅ **Sin duplicados**: La restricción UNIQUE previene notas duplicadas por periodo
✅ **Mejor rendimiento**: Índices optimizan las consultas
✅ **Compatible**: El frontend sigue funcionando sin cambios

## Verificación

Para verificar que todo funciona correctamente:

1. Agrega una nota para un estudiante en "I Periodo"
2. Agrega otra nota para el mismo estudiante en "II Periodo"
3. Ve a "Mis Notas" como estudiante
4. Deberías ver ambas notas listadas por materia

## Notas Adicionales

- La tabla `Matricula` conserva el campo `Nota_Id` para compatibilidad con otros módulos
- Las notas antiguas (si existen) NO se migran automáticamente
- Si necesitas migrar datos antiguos, contacta al desarrollador para crear un script de migración
