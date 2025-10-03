const path = require("path");
const dotenv = require("dotenv");
const db = require("../lib/db");
const { schema, seed } = require("../lib/schema");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

db.exec("PRAGMA foreign_keys = ON;");

const runMigrationBlock = (sql) => {
  if (!sql || sql.trim().length === 0) {
    return;
  }
  db.exec("BEGIN;");
  db.exec(sql);
  db.exec("COMMIT;");
};

try {
  console.log(`Preparing database at ${db.path}`);
  runMigrationBlock(schema);
  runMigrationBlock(seed);
  console.log("Database initialised successfully.");
} catch (error) {
  db.exec("ROLLBACK;");
  console.error("Failed to initialise database:", error.message);
  process.exitCode = 1;
}
