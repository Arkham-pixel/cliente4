import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// 1. Middlewares globales
app.use(
  cors({
    origin: ["http://localhost:5173", "https://aplicacion.grupoproser.com.co"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// 2. Sirve los uploads de fotos de perfil
import path from "path";
app.use("/uploads", express.static(path.resolve("uploads")));

// 3. Conexión a MongoDB y arranque de servidor
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    console.log("Usando MONGO_URI:", MONGO_URI);

    // 4. Monta aquí tus rutas (tras DB up)
    app.use("/api/auth", authRoutes);
    app.use("/api/usuarios", userRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  });
