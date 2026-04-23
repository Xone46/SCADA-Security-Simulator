import express from "express";
import ScadaController from "../controllers/ScadaController.mjs";

const router = express.Router();

router.get("/poll", ScadaController.pollScada);
router.get("/latest", ScadaController.latestScada);
router.get("/history", ScadaController.historyScada);

export default router;