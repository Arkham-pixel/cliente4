import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Cargamos la URI desde .env
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    // Rutas y arranque del servidor…
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