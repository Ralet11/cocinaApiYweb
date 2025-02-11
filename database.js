import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Usa las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME || "CocinaDB", // Nombre de la base de datos
  process.env.DB_USER || "postgres", // Usuario
  process.env.DB_PASSWORD || "Cocina1234#$%", // Contraseña
  {
    host: process.env.DB_HOST || "cocina-1.czskgk2i4k4w.us-east-1.rds.amazonaws.com", // Host
    dialect: process.env.DB_DIALECT, // Dialecto
    logging: false,
  }
);

export default sequelize;
