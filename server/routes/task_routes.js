import express from "express";
import { getAllTasksController, createTaskController, updateTaskController, getTaskByIdController, deleteTaskController, userTaskController } from "../controllers/task_controller.js";
const router = express.Router();

router.get("/all-task", getAllTasksController);
router.post("/create-task", createTaskController);
router.put("/update-task/:id", updateTaskController);
router.get("/get-task/:id", getTaskByIdController);
router.delete("/delete-task/:id", deleteTaskController);
router.get("/user-task/:id", userTaskController);

export default router;
