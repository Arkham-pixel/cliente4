import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.routes.js";
import securUserSecundarioRoutes from "./routes/securUserSecundario.routes.js";
import siniestroRoutes from "./routes/siniestroRoutes.js";
import ciudadRoutes from './routes/ciudadRoutes.js';
import clientesRoutes from './routes/clientes.js';
import funcionarioAseguradoraRoutes from './routes/funcionarioAseguradora.routes.js';
import responsableRoutes from './routes/responsable.routes.js';
import estadoRoutes from './routes/estado.routes.js';
import complexRoutes from './routes/complex.routes.js';
import tareasRoutes from './routes/tareas.routes.js';
import comunicadosRoutes from './routes/comunicados.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import casosRoutes from './routes/casos.js';

const app = express();

// 1️ Middlewares globales - CORS configurado para desarrollo y producción
const allowedOrigins = [
  'https://aplicacion.grupoproser.com.co',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requests sin Origin (como Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS bloqueado para origen:', origin);
      return callback(new Error('No permitido por CORS'));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// 2️ Asegúrate de que exista la carpeta uploads/
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta 'uploads/' creada.");
}

// 3️ Sirve los archivos subidos de forma estática
app.use("/uploads", express.static(uploadsDir));

// 4️ Monta aquí tus rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api", securUserSecundarioRoutes);
app.use("/api/siniestros", siniestroRoutes);
app.use('/api', ciudadRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/funcionarios-aseguradora', funcionarioAseguradoraRoutes);
app.use('/api/responsables', responsableRoutes);
app.use('/api/estados', estadoRoutes);
app.use('/api/complex', complexRoutes);
app.use('/api/casos', complexRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/comunicados', comunicadosRoutes);
app.use('/api/usuarios', usuariosRoutes);

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NO DEFINIDO');
console.log('🚀 CORS configurado para orígenes:', allowedOrigins);

export default app; 