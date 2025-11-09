import { config } from "dotenv";
import type { Knex } from "knex";
import path from "path";
import { fileURLToPath } from "url";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";
const BASE_PATH = isProd
  ? path.join(__dirname, "src", "database")
  : path.join(process.cwd(), "src", "database");

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT || "mysql2",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "marstech_hr_dev",
    },
    migrations: {
      directory: path.join(BASE_PATH, "migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.join(BASE_PATH, "seeds"),
      extension: "ts",
    },
  },

  production: {
    client: process.env.DB_CLIENT || "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    } as Knex.ConnectionConfig,

    migrations: {
      directory: path.join(BASE_PATH, "migrations"),
      extension: "js",
    },
    seeds: {
      directory: path.join(BASE_PATH, "seeds"),
      extension: "js",
    },
  },
};

export default knexConfig;
