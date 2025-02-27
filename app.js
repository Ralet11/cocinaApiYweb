import express from "express";
import morgan from "morgan";
import cors from "cors";
import sequelize from "./database.js";
import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();


// Importar rutas
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import partnerRouter from "./routes/partnerRoutes.js";
import categoryProductsRouter from "./routes/category_productsRoutes.js";
import orderProductsRouter from "./routes/order_productsRoutes.js";
import partnerProductsRouter from "./routes/partner_productsRoutes.js";
import ingredientRouter from "./routes/ingredientsRoutes.js"
import paymentRouter from "./routes/paymentRoutes.js"
import reviewRouter from "./routes/reviewRoutes.js";
import http from "http";
import { initializeSocket } from "./socket.js";
import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const { Preference,MercadoPagoConfig } = require('mercadopago');
const mercado_client = new MercadoPagoConfig(accessToken: process.env.ACCESS_TOKEN);
const app = express();


// Middlewares
app.use(morgan("dev"));

const corsOptions = {
    origin: "http://localhost:5173",

};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

// Ruta base de prueba
app.get("/", (req, res) => {
    res.send("Petición aceptada");
    console.log("Petición aceptada en server");
});

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });

  app.post("/create_preference", async (req, res)=> {

    try {
      const body={
        items: req.body.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
        })),
        //crear por las nuestras en frontend
        back_url:{
          success: "",
          failure: "",
          pending: "",
        },
        auto_return:'approved'
      };

      const preference = new Preference(mercado_client);
      const result= await preference.create({body});
      res.json({id:result.id});
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al crear la preferencia");
    }
  });

// Rutas
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/category-products", categoryProductsRouter);
app.use("/api/order-products", orderProductsRouter);
app.use("/api/partner-products", partnerProductsRouter);
app.use("/api/ingredient", ingredientRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/review", reviewRouter)



app.use((err, req, res, next) => {
  console.error("→ [GLOBAL ERROR HANDLER]", err);
  res.status(500).json({ error: "Algo salió mal en el servidor." });
});

//hoy
app.use("/api/review", reviewRouter)


// Configurar servidor

sequelize.sync({ alter: true }).then(() => {
  
    const httpsServer = http.createServer( app);
    httpsServer.listen(3000, () => {
      initializeSocket(httpsServer)
      console.log('Servidor HTTPS está escuchando en el puerto 3000');
    }); 
     
    }).catch(error => {
      console.error('Unable to synchronize the models:', error);
    });  
