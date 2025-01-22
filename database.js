import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Usa las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST, // Host
    dialect: process.env.DB_DIALECT, // Dialecto
    logging: false,
  }
);

export default sequelize;
