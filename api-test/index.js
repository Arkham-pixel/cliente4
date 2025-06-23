import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import complexRoutes from './routes/complex.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use('/api/complex', complexRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err);
  });
