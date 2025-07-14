import SecurUserSecundario from "../models/SecurUserSecundario.js";
import jwt from "jsonwebtoken";

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
