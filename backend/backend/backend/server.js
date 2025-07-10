import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; 
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://aplicacion.grupoproser.com.co'],
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
  })
);
// Cargamos la URI desde .env
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}
// Rutas y arranque del servidor…
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    console.log("Usando MONGO_URI:", MONGO_URI);
  
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  });
const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );