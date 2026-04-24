import express from "express";
import PlcController from "../controllers/PlcController.mjs";

const router = express.Router();

router.post("/", PlcController.create);
router.get("/", PlcController.getAll);
router.get("/:id", PlcController.getById);
router.put("/:id", PlcController.updateById);
router.put("/:id/status", PlcController.updateStatus);
router.delete("/:id", PlcController.deleteById);

export default router;