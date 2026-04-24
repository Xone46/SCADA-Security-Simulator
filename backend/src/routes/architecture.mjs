import express from "express";
import ArchitectureController from "../controllers/ArchitectureController.mjs";

const router = express.Router();

router.post("/plans", ArchitectureController.addPlan);
router.get("/plans", ArchitectureController.listPlans);
router.get("/plans/:id", ArchitectureController.getPlan);
router.delete("/plans/:id", ArchitectureController.removePlan);

router.post("/nodes", ArchitectureController.addNode);
router.get("/nodes/:planId", ArchitectureController.listNodes);
router.put("/nodes/:id/position", ArchitectureController.moveNode);
router.delete("/nodes/:id", ArchitectureController.removeNode);

router.post("/edges", ArchitectureController.addEdge);
router.get("/edges/:planId", ArchitectureController.listEdges);
router.delete("/edges/:id", ArchitectureController.removeEdge);

export default router;