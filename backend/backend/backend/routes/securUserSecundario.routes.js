import express from "express";
import { obtenerSecurUsers, loginSecurUser, obtenerPerfilSecurUser } from "../controllers/securUserSecundarioController.js";
import { verificarToken } from "../middleware/auth.js"; // O el middleware que uses


const router = express.Router();

router.get("/secur-users-secundarios", obtenerSecurUsers);
router.post("/secur-users/login", loginSecurUser);
router.get("/secur-users/perfil", verificarToken, obtenerPerfilSecurUser);

export default router;
