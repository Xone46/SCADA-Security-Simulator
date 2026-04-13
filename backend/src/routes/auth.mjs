import express from "express";
import AuthController from "../controllers/AuthController.mjs";

const router = express.Router();

router.post("/login", AuthController.login);
router.get("/status", AuthController.status);
router.get("/logout", AuthController.logout);

export default router;