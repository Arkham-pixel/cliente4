import SecurUserSecundario from "../models/SecurUserSecundario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Si usas bcrypt
import nodemailer from "nodemailer";

export const obtenerSecurUsers = async (req, res) => {
  try {
    const users = await SecurUserSecundario.find();
    res.json(users);
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios secundarios", error: error.message });
  }
};

export const loginSecurUser = async (req, res) => {
  const { login, pswd } = req.body;
  try {
    // Busca el usuario por login
    const user = await SecurUserSecundario.findOne({ login });
    if (!user) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }
    // Aquí deberías comparar el password (pswd) correctamente
    // Si está hasheado, usa bcrypt.compare
    if (user.pswd !== pswd) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }
    // Generar código 2FA
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFACode = code;
    user.twoFACodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    await user.save();
    // Enviar código por correo
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Código de verificación 2FA',
      text: `Tu código de verificación es: ${code}`
    });
    return res.json({ twoFARequired: true, email: user.email });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el login 2FA", error: error.message });
  }
};

// Validar código 2FA y devolver token
export const validarCodigo2FA = async (req, res) => {
  const { login, code } = req.body;
  try {
    const user = await SecurUserSecundario.findOne({ login });
    if (!user || !user.twoFACode || !user.twoFACodeExpires) {
      return res.status(400).json({ mensaje: "Código no solicitado o usuario inválido" });
    }
    if (user.twoFACode !== code) {
      return res.status(401).json({ mensaje: "Código incorrecto" });
    }
    if (user.twoFACodeExpires < new Date()) {
      return res.status(401).json({ mensaje: "Código expirado" });
    }
    // Limpiar el código después de usarlo
    user.twoFACode = undefined;
    user.twoFACodeExpires = undefined;
    await user.save();
    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, login: user.login, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      mensaje: "Login exitoso",
      token,
      user: {
        id: user._id,
        login: user.login,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en la verificación 2FA", error: error.message });
  }
};

export const obtenerPerfilSecurUser = async (req, res) => {
  try {
    // El id viene del token JWT
    const userId = req.usuario.id;
    const user = await SecurUserSecundario.findById(userId).select("-pswd");
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfil", error: error.message });
  }
};

export const actualizarPerfilSecurUser = async (req, res) => {
  try {
    const userId = req.usuario.id;
    const { passwordConfirm, ...update } = req.body;

    const user = await SecurUserSecundario.findById(userId);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verifica la contraseña
    // Si la contraseña está hasheada:
    const isMatch = await bcrypt.compare(passwordConfirm, user.pswd);
    // Si la contraseña está en texto plano (no recomendado):
    // const isMatch = passwordConfirm === user.pswd;

    if (!isMatch) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta. No se guardaron los cambios." });
    }

    // Actualiza los datos
    const updatedUser = await SecurUserSecundario.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar perfil", error: error.message });
  }
};
