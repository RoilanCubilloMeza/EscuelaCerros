const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2");

const HELP_TEXT = [
  "Uso:",
  "  npm run db:insert -- --tabla Materias --archivo .\\scripts\\ejemplos\\materias.sample.json",
  "",
  "Opciones:",
  "  --tabla <nombre>     Nombre de la tabla destino",
  "  --archivo <ruta>     Ruta del archivo JSON con los registros",
  "  --dry-run            Muestra el SQL generado sin ejecutar el INSERT",
  "  --help               Muestra esta ayuda",
  "",
  "Formato del JSON:",
  "  Puede ser un objeto o un arreglo de objetos.",
  "  Todos los objetos deben tener exactamente las mismas columnas.",
].join("\n");

function parseArgs(argv) {
  const options = {
    dryRun: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--tabla") {
      options.table = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--archivo") {
      options.file = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

function escapeIdentifier(identifier, typeLabel) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
    throw new Error(`El ${typeLabel} \"${identifier}\" no es válido.`);
  }

  return mysql.escapeId(identifier);
}

function normalizeValue(value, rowIndex, columnName) {
  if (value === null || value === undefined) {
    return null;
  }

  if (["string", "number"].includes(typeof value)) {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  throw new Error(
    `El valor de la columna \"${columnName}\" en la fila ${rowIndex + 1} debe ser string, number, boolean o null.`
  );
}

function validateRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("El archivo JSON debe contener al menos un registro.");
  }

  const firstRow = rows[0];

  if (!firstRow || typeof firstRow !== "object" || Array.isArray(firstRow)) {
    throw new Error("Cada registro del archivo JSON debe ser un objeto plano.");
  }

  const columns = Object.keys(firstRow);

  if (columns.length === 0) {
    throw new Error("Los registros deben incluir al menos una columna.");
  }

  rows.forEach((row, rowIndex) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new Error(`La fila ${rowIndex + 1} no es un objeto válido.`);
    }

    const rowColumns = Object.keys(row);
    const hasSameColumns =
      rowColumns.length === columns.length &&
      columns.every((column) => rowColumns.includes(column));

    if (!hasSameColumns) {
      throw new Error(
        `La fila ${rowIndex + 1} no tiene las mismas columnas que la primera fila.`
      );
    }

    columns.forEach((column) => {
      escapeIdentifier(column, "nombre de columna");
      normalizeValue(row[column], rowIndex, column);
    });
  });

  return columns;
}

async function loadRows(filePath) {
  const absoluteFilePath = path.resolve(process.cwd(), filePath);
  const rawContent = await fs.readFile(absoluteFilePath, "utf8");
  const parsedContent = JSON.parse(rawContent);
  const rows = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
  const columns = validateRows(rows);

  return {
    absoluteFilePath,
    rows,
    columns,
  };
}

function buildInsertQuery(tableName, columns, rows) {
  const escapedTableName = escapeIdentifier(tableName, "nombre de tabla");
  const escapedColumns = columns.map((column) => escapeIdentifier(column, "nombre de columna"));
  const placeholders = rows
    .map(() => `(${columns.map(() => "?").join(", ")})`)
    .join(",\n");

  const values = rows.flatMap((row, rowIndex) =>
    columns.map((column) => normalizeValue(row[column], rowIndex, column))
  );

  const sql = [
    `INSERT INTO ${escapedTableName} (${escapedColumns.join(", ")})`,
    `VALUES ${placeholders}`,
  ].join("\n");

  return { sql, values };
}

async function runInsert(sql, values) {
  const { connection } = require("../config");
  const pool = connection.promise();

  try {
    const [result] = await pool.query(sql, values);
    return result;
  } finally {
    await pool.end();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || !options.table || !options.file) {
    console.log(HELP_TEXT);

    if (!options.help && (!options.table || !options.file)) {
      process.exitCode = 1;
    }

    return;
  }

  const { absoluteFilePath, rows, columns } = await loadRows(options.file);
  const { sql, values } = buildInsertQuery(options.table, columns, rows);

  if (options.dryRun) {
    console.log("Archivo:", absoluteFilePath);
    console.log("Tabla:", options.table);
    console.log("Columnas:", columns.join(", "));
    console.log("Registros:", rows.length);
    console.log("SQL generado:\n" + sql);
    console.log("Parámetros:", JSON.stringify(values, null, 2));
    return;
  }

  const result = await runInsert(sql, values);
  console.log(`Registros insertados: ${result.affectedRows}`);

  if (result.insertId) {
    console.log(`Primer ID insertado: ${result.insertId}`);
  }
}

main().catch((error) => {
  console.error("Error al insertar datos:", error.message);

  if (error.code) {
    console.error("Código:", error.code);
  }

  process.exitCode = 1;
});