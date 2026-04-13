import express from "express";
import ScadaController from "../controllers/ScadaController.mjs";

const router = express.Router();

router.post("/data", ScadaController.sendData);
router.get("/data", ScadaController.getData);

export default router;