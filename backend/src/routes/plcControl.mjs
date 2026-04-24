import express from "express";
import PlcControlController from "../controllers/PlcControlController.mjs";

const router = express.Router();

router.post("/", PlcControlController.addControl);
router.get("/:plc_id", PlcControlController.getControls);
router.delete("/:id", PlcControlController.removeControl);

export default router;