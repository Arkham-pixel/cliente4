import express from "express";
import { obtenerSecurUsers } from "../controllers/securUserSecundarioController.js";

const router = express.Router();

router.get("/secur-users-secundarios", obtenerSecurUsers);

export default router;
