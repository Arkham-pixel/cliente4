// routes/user.routes.js
import express from "express";
import { verificarToken } from "../middleware/verificarToken.js";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// 👉 1. Asegúrate de que exista la carpeta uploads/
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 👉 2. Configura multer para guardar en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Usamos el id del solicitante o cualquier identificador único:
    cb(null, `${req.usuario.id}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Ruta protegida: solo admin o soporte pueden crear usuarios
// Ahora acepta un campo "foto" en multipart/form-data
router.post(
  "/crear",
  verificarToken,
  upload.single("foto"),
  async (req, res) => {
    const rolSolicitante = req.usuario.rol;

    if (rolSolicitante !== "admin" && rolSolicitante !== "soporte") {
      return res
        .status(403)
        .json({ message: "Acceso denegado: solo admin o soporte puede crear cuentas" });
    }

    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    try {
      // Verifica que no exista antes
      const usuarioExistente = await Usuario.findOne({ correo });
      if (usuarioExistente) {
        return res
          .status(409)
          .json({ message: "El correo ya está registrado" });
      }

      // Hashea la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea el usuario en memoria
      const nuevoUsuario = new Usuario({
        nombre,
        correo,
        password: hashedPassword,
        rol,
      });

      // Si llegó un archivo, asigna la URL relativa al campo foto
      if (req.file) {
        nuevoUsuario.foto = `/uploads/${req.file.filename}`;
      }

      // Guarda en MongoDB
      await nuevoUsuario.save();

      return res
        .status(201)
        .json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res
        .status(500)
        .json({ message: "Error interno del servidor" });
    }
  }
);

export default router;
