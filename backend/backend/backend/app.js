import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.routes.js";
import securUserSecundarioRoutes from "./routes/securUserSecundario.routes.js";
import siniestroRoutes from "./routes/siniestroRoutes.js";
import ciudadRoutes from './routes/ciudadRoutes.js';
import clientesRoutes from './routes/clientes.js';

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

// 4️⃣ Monta aquí tus rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api", securUserSecundarioRoutes);
app.use("/api/siniestros", siniestroRoutes);
app.use('/api', ciudadRoutes);
app.use('/api', clientesRoutes);

export default app; 