import express from "express";
import { obtenerSecurUsers, loginSecurUser } from "../controllers/securUserSecundarioController.js";

const router = express.Router();

router.get("/secur-users-secundarios", obtenerSecurUsers);
router.post("/secur-users/login", loginSecurUser);

export default router;
