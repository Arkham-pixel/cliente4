import express from "express";
import { verificarToken } from "../middleware/verificarToken.js";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Ruta protegida: solo admin o soporte pueden crear usuarios
router.post("/crear", verificarToken, async (req, res) => {
  const rolSolicitante = req.usuario.rol;

  if (rolSolicitante !== "admin" && rolSolicitante !== "soporte") {
    return res.status(403).json({ message: "Acceso denegado: solo admin o soporte puede crear cuentas" });
  }

  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      password: hashedPassword,
      rol,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
