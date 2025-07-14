import SecurUserSecundario from "../models/SecurUserSecundario.js";

export const obtenerSecurUsers = async (req, res) => {
  try {
    const users = await SecurUserSecundario.find();
    res.json(users);
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios secundarios", error: error.message });
  }
};
