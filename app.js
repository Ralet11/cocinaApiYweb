// server.js
import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./database.js";
import { initializeSocket } from "./socket.js";

// Rutas
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
// ... etc

dotenv.config(); // Carga las variables de .env

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "10mb" }));

// Rutas
app.get("/", (req, res) => {
  res.send("Petición aceptada");
});
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
// ... etc

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("→ [GLOBAL ERROR HANDLER]", err);
  res.status(500).json({ error: "Algo salió mal en el servidor." });
});

// Sincronizar con Sequelize
const FORCE_SYNC = process.env.FORCE_SYNC === "true"; // "true" o "false" en .env
sequelize.sync({ force: FORCE_SYNC })
  .then(() => {
    console.log("Base de datos sincronizada");
    startServer(app);
  })
  .catch((error) => {
    console.error("Unable to synchronize the models:", error);
  });

/**
 * startServer: decide si levantar HTTP o HTTPS
 */
function startServer(app) {
  const isProduction = process.env.NODE_ENV === "production";
  const port = process.env.PORT || 3000;

  let server;

  if (isProduction) {
    // Lee certificados de las rutas definidas en .env
    const keyPath = process.env.SSL_KEY_PATH;
    const certPath = process.env.SSL_CERT_PATH;
    const caPath = process.env.SSL_CA_PATH;

    const privateKey = fs.readFileSync(keyPath, "utf8");
    const certificate = fs.readFileSync(certPath, "utf8");
    const ca = fs.readFileSync(caPath, "utf8");

    const credentials = { key: privateKey, cert: certificate, ca };

    // Servidor HTTPS
    server = https.createServer(credentials, app);
    server.listen(443, () => {
      console.log("Servidor HTTPS escuchando en el puerto 443");
      initializeSocket(server);
    });
  } else {
    // Servidor HTTP
    server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Servidor HTTP escuchando en el puerto ${port}`);
      initializeSocket(server);
    });
  }
}
