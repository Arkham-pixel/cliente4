// routes/usuario.js  (ahora en ESM)
import { Router } from 'express';
import Usuario from '../models/Usuario.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// Guarda en disco en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/usuarios/crear
router.post(
  '/crear',
  upload.single('foto'),
  async (req, res) => {
    try {
      const {
        nombre,
        correo,
        celular,
        cedula,
        fechaNacimiento,
        rol
      } = req.body;

      let fotoUrl = null;
      if (req.file) {
        // serviremos /uploads estático
        fotoUrl = `/uploads/${req.file.filename}`;
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
      res.status(201).json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
  }
);

export default router;
