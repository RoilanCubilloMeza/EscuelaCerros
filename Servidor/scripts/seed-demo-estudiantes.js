const dotenv = require("dotenv");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

dotenv.config();

const { connection } = require("../config");

const DEFAULT_COUNT = 100;
const DEFAULT_PASSWORD = "Demo12345!";

const FIRST_NAMES = [
  "Ana", "Luis", "Mariana", "Carlos", "Sofía", "Daniel", "Valeria", "José", "Camila", "Andrés",
  "Lucía", "David", "Gabriela", "Diego", "Paula", "Miguel", "Elena", "Jorge", "Natalia", "Kevin",
];

const LAST_NAMES = [
  "Mora", "Ramírez", "Vargas", "Solano", "Rojas", "Fernández", "Castro", "Araya", "Quesada", "Cordero",
  "Soto", "Murillo", "Chaves", "Salas", "Herrera", "Pérez", "Navarro", "Gutiérrez", "León", "Campos",
];

function parseArgs(argv) {
  const options = {
    cantidad: DEFAULT_COUNT,
    password: DEFAULT_PASSWORD,
    prefijo: `demo${Date.now().toString().slice(-8)}`,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--cantidad") {
      options.cantidad = Number.parseInt(argv[index + 1], 10);
      index += 1;
      continue;
    }

    if (arg === "--password") {
      options.password = argv[index + 1] || DEFAULT_PASSWORD;
      index += 1;
      continue;
    }

    if (arg === "--prefijo") {
      options.prefijo = argv[index + 1] || options.prefijo;
      index += 1;
    }
  }

  if (!Number.isInteger(options.cantidad) || options.cantidad <= 0) {
    throw new Error("La opción --cantidad debe ser un número entero mayor que 0.");
  }

  if (!options.prefijo || !/^[a-z0-9_-]+$/i.test(options.prefijo)) {
    throw new Error("La opción --prefijo solo puede contener letras, números, guiones o guion bajo.");
  }

  return options;
}

function findColumn(columns, candidates) {
  const normalizedCandidates = candidates.map((candidate) => candidate.toLowerCase());

  return columns.find((column) => normalizedCandidates.includes(column.toLowerCase())) || null;
}

function buildInsertSql(tableName, data) {
  const columns = Object.keys(data).filter((column) => data[column] !== undefined);
  const escapedColumns = columns.map((column) => mysql.escapeId(column));
  const placeholders = columns.map(() => "?");
  const values = columns.map((column) => data[column]);

  return {
    sql: `INSERT INTO ${mysql.escapeId(tableName)} (${escapedColumns.join(", ")}) VALUES (${placeholders.join(", ")})`,
    values,
  };
}

async function getTableColumns(db, tableName) {
  const [rows] = await db.query(`SHOW COLUMNS FROM ${mysql.escapeId(tableName)}`);
  return rows.map((row) => row.Field);
}

async function getReferenceRows(db, query) {
  const [rows] = await db.query(query);
  return rows;
}

async function resolveReferences(db) {
  const estudianteColumns = await getTableColumns(db, "Estudiantes");
  const usuarioColumns = await getTableColumns(db, "Usuarios");
  const personaColumns = await getTableColumns(db, "Personas");
  const residenteColumns = await getTableColumns(db, "Residente");

  const residenciaIdColumn = findColumn(residenteColumns, ["Residencia_Id", "Residencia_ID"]);

  if (!residenciaIdColumn) {
    throw new Error("No se encontró la columna de ID en la tabla Residente.");
  }

  const [grados, profesores, encargados, adecuaciones, enfermedades, residentes, roles] = await Promise.all([
    getReferenceRows(db, "SELECT Grado_Id, Grado_Nombre, Grado_Aula FROM Grado ORDER BY Grado_Id ASC"),
    getReferenceRows(db, "SELECT Profesor_Id FROM Profesores ORDER BY Profesor_Id ASC"),
    getReferenceRows(db, "SELECT Encargados_Id FROM Encargados ORDER BY Encargados_Id ASC"),
    getReferenceRows(db, "SELECT Adecuacion_Id FROM Adecuacion ORDER BY Adecuacion_Id ASC"),
    getReferenceRows(db, "SELECT Enfermedades_Id FROM Enfermedades ORDER BY Enfermedades_Id ASC"),
    getReferenceRows(db, `SELECT ${mysql.escapeId(residenciaIdColumn)} AS ResidenciaRefId FROM Residente ORDER BY ${mysql.escapeId(residenciaIdColumn)} ASC`),
    getReferenceRows(db, "SELECT Roles_Id, Roles_Nombre FROM Roles ORDER BY Roles_Id ASC"),
  ]);

  if (!grados.length) {
    throw new Error("No hay grados registrados. Crea al menos un grado antes de ejecutar el seed.");
  }

  if (!encargados.length || !adecuaciones.length || !enfermedades.length || !residentes.length) {
    throw new Error("Faltan datos base en Encargados, Adecuacion, Enfermedades o Residente para crear matrículas.");
  }

  if (!roles.length) {
    throw new Error("No hay roles registrados. Crea el rol de estudiante antes de ejecutar el seed.");
  }

  const studentRole =
    roles.find((role) => String(role.Roles_Id) === "3") ||
    roles.find((role) => String(role.Roles_Nombre || "").toLowerCase().includes("estud")) ||
    roles[0];

  return {
    estudianteColumns,
    usuarioColumns,
    personaColumns,
    grados,
    profesores,
    encargados,
    adecuaciones,
    enfermedades,
    residentes,
    studentRoleId: studentRole.Roles_Id,
  };
}

function buildStudentProfile(index, prefix, grado) {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const secondName = FIRST_NAMES[(index + 7) % FIRST_NAMES.length];
  const lastName1 = LAST_NAMES[index % LAST_NAMES.length];
  const lastName2 = LAST_NAMES[(index + 11) % LAST_NAMES.length];
  const seq = String(index + 1).padStart(3, "0");
  const username = `${prefix}.est${seq}`.toLowerCase();
  const email = `${username}@escuelacerros.test`;
  const cedula = `9${prefix.replace(/[^0-9]/g, "").padStart(8, "0").slice(-8)}${seq}`;
  const gradeOffset = typeof grado.Grado_Id === "number" ? grado.Grado_Id : index % 6;
  const age = 6 + ((gradeOffset - 1 + 12) % 12);
  const birthYear = new Date().getFullYear() - age;
  const birthDate = `${birthYear}-0${(index % 9) + 1}-1${index % 9}`;

  return {
    username,
    email,
    cedula,
    persona: {
      Persona_Nombre: `${firstName} ${secondName}`,
      Persona_PApellido: lastName1,
      Persona_SApellido: lastName2,
      Persona_Cedula: cedula,
      Persona_Edad: age,
      Persona_Sexo: index % 2 === 0 ? "Masculino" : "Femenino",
      Persona_LuNacimiento: "San José",
      Persona_FNAciomiento: birthDate,
      Persona_Nacionalidad: "Costarricense",
      Persona_Correo: email,
    },
  };
}

async function insertRow(db, tableName, data) {
  const { sql, values } = buildInsertSql(tableName, data);
  const [result] = await db.query(sql, values);
  return result;
}

async function getCounts(db) {
  const [personasRows] = await db.query("SELECT COUNT(*) AS total FROM Personas");
  const [estudiantesRows] = await db.query("SELECT COUNT(*) AS total FROM Estudiantes");
  const [usuariosRows] = await db.query("SELECT COUNT(*) AS total FROM Usuarios");

  return {
    personas: personasRows[0].total,
    estudiantes: estudiantesRows[0].total,
    usuarios: usuariosRows[0].total,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const pool = connection.promise();
  const db = await pool.getConnection();

  try {
    const beforeCounts = await getCounts(db);
    const refs = await resolveReferences(db);
    const hashedPassword = await bcrypt.hash(options.password, 10);
    const createdUsers = [];

    await db.beginTransaction();

    for (let index = 0; index < options.cantidad; index += 1) {
      const grado = refs.grados[index % refs.grados.length];
      const encargado = refs.encargados[index % refs.encargados.length];
      const adecuacion = refs.adecuaciones[index % refs.adecuaciones.length];
      const enfermedad = refs.enfermedades[index % refs.enfermedades.length];
      const residente = refs.residentes[index % refs.residentes.length];
      const profesor = refs.profesores.length > 0 ? refs.profesores[index % refs.profesores.length] : null;
      const profile = buildStudentProfile(index, options.prefijo, grado);

      const personaData = {};
      refs.personaColumns.forEach((column) => {
        if (Object.prototype.hasOwnProperty.call(profile.persona, column)) {
          personaData[column] = profile.persona[column];
        }
      });

      const personaResult = await insertRow(db, "Personas", personaData);
      const personaId = personaResult.insertId;

      const estudianteData = {
        Persona_Id: personaId,
        Estudiantes_Estado: "Matriculado",
        Adecuacion_Id: adecuacion.Adecuacion_Id,
        Residencia_ID: residente.ResidenciaRefId,
        Enfermedades_Id: enfermedad.Enfermedades_Id,
        Estudiantes_Grado: grado.Grado_Nombre,
        Encargados_Id: encargado.Encargados_Id,
        Profesor_Id: profesor ? profesor.Profesor_Id : null,
        Grado_Id: grado.Grado_Id,
      };

      const estudiantePayload = {};
      refs.estudianteColumns.forEach((column) => {
        if (Object.prototype.hasOwnProperty.call(estudianteData, column)) {
          estudiantePayload[column] = estudianteData[column];
        }
      });

      await insertRow(db, "Estudiantes", estudiantePayload);

      const usuarioData = {
        Usuarios_Nombre: profile.username,
        Usuarios_contraseña: hashedPassword,
        Roles_Id: refs.studentRoleId,
        Persona_Id: personaId,
        Pregunta_Seguridad: refs.usuarioColumns.includes("Pregunta_Seguridad")
          ? "Código demo"
          : undefined,
        Respuesta_Seguridad: refs.usuarioColumns.includes("Respuesta_Seguridad")
          ? options.prefijo
          : undefined,
      };

      await insertRow(db, "Usuarios", usuarioData);

      if (createdUsers.length < 10) {
        createdUsers.push({
          username: profile.username,
          grado: `${grado.Grado_Nombre}${grado.Grado_Aula ? ` / ${grado.Grado_Aula}` : ""}`,
        });
      }
    }

    await db.commit();

    const afterCounts = await getCounts(db);

    console.log(`Se insertaron ${options.cantidad} estudiantes demo con usuario.`);
    console.log(`Prefijo utilizado: ${options.prefijo}`);
    console.log(`Contraseña común: ${options.password}`);
    console.log("Conteos antes:", beforeCounts);
    console.log("Conteos después:", afterCounts);
    console.log("Primeros usuarios creados:");
    createdUsers.forEach((user) => {
      console.log(`- ${user.username} (${user.grado})`);
    });
  } catch (error) {
    try {
      await db.rollback();
    } catch (rollbackError) {
      // Ignorar error secundario del rollback
    }

    console.error("Error al sembrar estudiantes demo:", error.message);
    if (error.code) {
      console.error("Código:", error.code);
    }
    process.exitCode = 1;
  } finally {
    db.release();
    await pool.end();
  }
}

main();