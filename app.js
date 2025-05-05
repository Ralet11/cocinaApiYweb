// server.js
import express from "express";
import path from "path";
import http from "http";
import https from "https";
import fs from "fs";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./database.js";
import { initializeSocket } from "./socket.js";

// Importar rutas
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import partnerRouter from "./routes/partnerRoutes.js";
import categoryProductsRouter from "./routes/category_productsRoutes.js";
import orderProductsRouter from "./routes/order_productsRoutes.js";
import partnerProductsRouter from "./routes/partner_productsRoutes.js";
import ingredientRouter from "./routes/ingredientsRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

// Cargar variables de entorno desde .env
dotenv.config();

// Iniciar la app Express
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173" || "*" }));
app.use(express.json({ limit: "10mb" }));

// Para resolver rutas absolutas (con ES Modules)
const __dirname = path.resolve();

// -----------------------------------------------
// Sección para la verificación de dominio
// -----------------------------------------------
// Sirve estáticamente el contenido de la carpeta "certificados"
// en la ruta "/.well-known/pki-validation"
app.use(
  "/.well-known/pki-validation",
  express.static(path.join(__dirname, "certificados"))
);

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Petición aceptada");
});

// Rutas de la API
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/category-products", categoryProductsRouter);
app.use("/api/order-products", orderProductsRouter);
app.use("/api/partner-products", partnerProductsRouter);
app.use("/api/ingredient", ingredientRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/review", reviewRouter);


// Manejador global de errores
app.use((err, req, res, next) => {
  console.error("→ [GLOBAL ERROR HANDLER]", err);
  res.status(500).json({ error: "Algo salió mal en el servidor." });
});

// Sincronizar la base de datos con Sequelize
const FORCE_SYNC = process.env.FORCE_SYNC === "true"; // Define "true" o "false" en tu .env
sequelize
  .sync({ force: FORCE_SYNC })
  .then(() => {
    console.log("Base de datos sincronizada");
    startServer(app);
  })
  .catch((error) => {
    console.error("Unable to synchronize the models:", error);
  });

/**
 * startServer: Levanta el servidor según el entorno (dev/producción).
 *  - En producción: HTTPS usando certificados SSL (variables en .env).
 *  - En desarrollo: HTTP en el puerto indicado.
 */
function startServer(app) {
  const isProduction = false;
  const port = 3000;
  let server;

  if (isProduction) {
    // Lee las rutas de los certificados desde las variables de entorno
    const keyPath = process.env.SSL_KEY_PATH;
    const certPath = process.env.SSL_CERT_PATH;
    const caPath = process.env.SSL_CA_PATH;

    const privateKey = fs.readFileSync(keyPath, "utf8");
    const certificate = fs.readFileSync(certPath, "utf8");
    const ca = fs.readFileSync(caPath, "utf8");

    const credentials = { key: privateKey, cert: certificate, ca };

    // Crear servidor HTTPS
    server = https.createServer(credentials, app);
    server.listen(443, () => {
      console.log("Servidor HTTPS escuchando en el puerto 443");
      initializeSocket(server);
    });
  } else {
    // Crear servidor HTTP para desarrollo
    server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Servidor HTTP escuchando en el puerto ${port}`);
      initializeSocket(server);
    });
  }
}
