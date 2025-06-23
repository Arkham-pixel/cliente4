import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import complexRoutes from './routes/complex.routes.js';
import userRoutes from './routes/user.routes.js';
import { verificarToken } from './middlewares/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Lista de orígenes permitidos
const allowedOrigins = [
  'https://grupo-proser-1741991464708.web.app',
  'http://localhost:3000'
];

// ✅ Middleware manual para preflight (debe ir primero)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(200);
});

// ✅ Middleware CORS (después de .options)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body parser
app.use(express.json());

// ✅ Rutas públicas
app.use('/api/complex', complexRoutes);
app.use('/api/auth', userRoutes);

// ✅ Ruta protegida de ejemplo
app.get('/api/usuarios/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: 'Este es tu perfil', usuario: req.usuario });
});

// ✅ Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err);
    setTimeout(() => process.exit(1), 10000);
  });
