import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.routes.js";
import securUserSecundarioRoutes from "./routes/securUserSecundario.routes.js";

dotenv.config();

const app = express();

// 1️⃣ Middlewares globales
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
  })
);
app.use(express.json());

// 2️⃣ Asegúrate de que exista la carpeta uploads/
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta 'uploads/' creada.");
}

// 3️⃣ Sirve los archivos subidos de forma estática
app.use("/uploads", express.static(uploadsDir));

// 4️⃣ Conexión a MongoDB y arranque de servidor
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

    // 5️⃣ Monta aquí tus rutas (después de que la DB esté arriba)
    app.use("/api/auth", authRoutes);
    app.use("/api/usuarios", userRoutes);
    app.use("/api", securUserSecundarioRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  });
