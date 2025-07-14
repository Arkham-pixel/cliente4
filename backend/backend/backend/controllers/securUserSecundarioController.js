import SecurUserSecundario from "../models/SecurUserSecundario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Si usas bcrypt

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

    // Genera el token JWT
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
    res.status(500).json({ mensaje: "Error en el login", error: error.message });
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
