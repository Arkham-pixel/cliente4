import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // contraseña encriptada con bcrypt
  rol: {
    type: String,
    enum: ["admin", "soporte", "usuario"],
    default: "usuario",
  }
}, {
  timestamps: true
});

export default mongoose.model("Usuario", UsuarioSchema);
