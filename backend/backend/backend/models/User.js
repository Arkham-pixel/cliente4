import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  contrasena: String,
  // agrega más campos si necesitas
});

export default mongoose.model("User", userSchema);