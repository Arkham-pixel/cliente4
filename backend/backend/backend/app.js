import express from "express";
// import cors from "cors";
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
import riesgosRoutes from './routes/riesgos.routes.js';

const app = express();

// Middleware de logging detallado
app.use((req, res, next) => {
  console.log('🌐 === NUEVA PETICIÓN ===');
  console.log('📡 Método:', req.method);
  console.log('🔗 URL:', req.url);
  console.log('📦 Headers:', req.headers);
  console.log('📄 Content-Type:', req.headers['content-type']);
  console.log('📏 Content-Length:', req.headers['content-length']);
  
  // Capturar el body raw
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    console.log('📥 Chunk recibido:', chunk.toString());
  });
  req.on('end', () => {
    console.log('📄 Body completo:', data);
    console.log('📄 Body length:', data.length);
    console.log('📄 Body type:', typeof data);
    try {
      const parsed = JSON.parse(data);
      console.log('✅ JSON parseado correctamente:', parsed);
    } catch (e) {
      console.log('❌ Error parseando JSON:', e.message);
      console.log('❌ Posición del error:', e.message.match(/position (\d+)/)?.[1]);
    }
    console.log('🌐 === FIN PETICIÓN ===');
  });
  
  next();
});

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
app.use('/api/casos', casosRoutes);
app.use('/api/riesgos', riesgosRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/comunicados', comunicadosRoutes);
app.use('/api/usuarios', usuariosRoutes);

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NO DEFINIDO');
console.log('🔧 CORS manejado por Nginx');

export default app; 