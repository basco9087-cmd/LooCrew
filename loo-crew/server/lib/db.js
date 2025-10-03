const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const resolveDatabasePath = () => {
  const configured = process.env.DATABASE_PATH;
  if (configured && configured.trim().length > 0) {
    return path.resolve(configured);
  }
  return path.join(__dirname, "..", "data", "loo-crew.db");
};

const databasePath = resolveDatabasePath();
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const connection = new Database(databasePath);
connection.pragma("journal_mode = WAL");

const run = (sql, params = {}) => connection.prepare(sql).run(params);
const get = (sql, params = {}) => connection.prepare(sql).get(params);
const all = (sql, params = {}) => connection.prepare(sql).all(params);
const exec = (sql) => connection.exec(sql);

module.exports = {
  connection,
  run,
  get,
  all,
  exec,
  path: databasePath
};
