// config/sequelize.js
import { Sequelize } from "sequelize";

const cfg = {
  host:     process.env.MYSQL_HOST     || process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || "3306", 10),
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME     || "edumochila",
  username: process.env.MYSQL_USER     || process.env.DB_USER     || "root",
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASS     || "",
  dialect:  process.env.DB_DIALECT     || "mysql",
  ssl:      String(process.env.MYSQL_SSL || process.env.DB_SSL || "false")
              .toLowerCase() === "true",
};

// Combina opciones del dialecto
const dialectOptions = {
  // Necesario para ejecutar varias sentencias en una sola query (SET; CALL; SELECT)
  multipleStatements: true,
};
if (cfg.ssl) {
  dialectOptions.ssl = { require: true, rejectUnauthorized: true };
}

export const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, {
  host: cfg.host,
  port: cfg.port,
  dialect: cfg.dialect,
  logging: false,
  define: { freezeTableName: true, timestamps: false },
  pool: { max: 10, min: 0, idle: 10000, acquire: 60000 },
  dialectOptions,
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión a MySQL OK (${cfg.host}:${cfg.port}/${cfg.database})`);
  } catch (err) {
    console.error("❌ Error de conexión MySQL:", err?.message || err);
    process.exit(1);
  }
}
