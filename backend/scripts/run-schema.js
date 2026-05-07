import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import "../src/env.js";
import { projectRoot } from "../src/env.js";

const requiredVariables = ["DB_HOST", "DB_USER", "DB_NAME"];

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    console.error(`Missing required environment variable: ${variableName}`);
    process.exit(1);
  }
}

const schemaPath = path.join(projectRoot, "database", "schema.sql");

if (!fs.existsSync(schemaPath)) {
  console.error(`Schema file not found: ${schemaPath}`);
  process.exit(1);
}

const escapeIdentifier = (value) => `\`${String(value).replace(/`/g, "``")}\``;

const applySchema = async () => {
  const rawSchema = fs.readFileSync(schemaPath, "utf8");
  const resolvedSchema = rawSchema.replaceAll(
    "{{DB_NAME}}",
    escapeIdentifier(process.env.DB_NAME)
  );

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    port: Number(process.env.DB_PORT || 3306),
    multipleStatements: true,
  });

  try {
    await connection.query(resolvedSchema);
    console.log(`Database schema applied successfully to ${process.env.DB_NAME}`);
  } finally {
    await connection.end();
  }
};

applySchema().catch((error) => {
  console.error("Failed to apply schema:", error.message);
  process.exit(1);
});
