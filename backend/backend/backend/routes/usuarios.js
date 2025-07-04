const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const multer = require('multer');

// configuración básica de multer para guardar imágenes (puedes mejorarla luego)
const storage = multer.memoryStorage(); // o diskStorage si usas sistema de archivos
const upload = multer({ storage });

router.post('/crear', upload.single('foto'), async (req, res) => {
  try {
    const {
      nombre,
      correo,
      celular,
      cedula,
      fechaNacimiento,
      rol // este viene del formulario
    } = req.body;

    // Guardar la foto si la estás usando
    let fotoUrl = null;
    if (req.file) {
      // Aquí podrías subirla a Cloudinary, S3 o guardarla en disco
      fotoUrl = `uploads/${req.file.originalname}`; // ejemplo simple
    }

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      celular,
      cedula,
      fechaNacimiento,
      rol,
      foto: fotoUrl
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
});

module.exports = router;
