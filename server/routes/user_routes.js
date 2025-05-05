import express from "express";
import { getAllUsers, registerController, loginController } from "../controllers/user_controller.js";

const router = express.Router();
router.get("/all-users", getAllUsers);
router.post("/register", registerController);
router.post("/login", loginController);

export default router;