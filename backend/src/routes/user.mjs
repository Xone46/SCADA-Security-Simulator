import express from "express";
import UserController from "../controllers/UserController.mjs";

const router = express.Router();

router.post("/register", UserController.register);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUserById);
router.put("/:id/role", UserController.updateRole);
router.delete("/:id", UserController.deleteUserById);
router.put("/:id/status", UserController.updateStatus);

export default router;