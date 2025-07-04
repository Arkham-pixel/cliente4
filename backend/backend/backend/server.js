import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"; // 👈 agregado
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(express.json());

const MONGO_URI = "mongodb+srv://webmaster:pYve2cYiMaGyxmRP@cluster0.p85rti4.mongodb.net/miapp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes); // 👈 agregado

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
