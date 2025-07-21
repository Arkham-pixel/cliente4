import 'dotenv/config' 
import mongoose from "mongoose";
import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();


const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

// Configuración mejorada de MongoDB (solo opciones soportadas)
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 segundos
  socketTimeoutMS: 45000, // 45 segundos
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: "majority"
};

mongoose
  .connect(MONGO_URI, mongoOptions)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    console.log("Usando MONGO_URI:", MONGO_URI);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    console.error("Detalles del error:", {
      name: err.name,
      message: err.message,
      code: err.code,
      codeName: err.codeName
    });
    
    // No salir del proceso inmediatamente, intentar reconectar
    console.log("🔄 Intentando reconectar en 5 segundos...");
    setTimeout(() => {
      mongoose.connect(MONGO_URI, mongoOptions)
        .then(() => {
          console.log("✅ Reconexión exitosa a MongoDB");
          const PORT = process.env.PORT || 3000;
          app.listen(PORT, () =>
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
          );
        })
        .catch((retryErr) => {
          console.error("❌ Error en reconexión:", retryErr);
          process.exit(1);
        });
    }, 5000);
  });

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Desconectado de MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ Reconectado a MongoDB');
});
