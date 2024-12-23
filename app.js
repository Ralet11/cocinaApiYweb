import express from "express";
import morgan from "morgan";
import cors from "cors";
import sequelize from "./database.js";

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

//hoy
import reviewRouter from "./routes/reviewRoutes.js";



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

//hoy
app.use("/api/review", reviewRouter)


// Configurar servidor
const PORT = 3000;

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error("Unable to synchronize the models:", error);
    });
