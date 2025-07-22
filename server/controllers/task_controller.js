import mongoose from "mongoose";
import taskModel from "../models/task_model.js";
import userModel from "../models/user_model.js";

export const getAllTasksController = async (req, res) => {
  try {
    const filter = { user: req.userId };
    if (req.query.status === "completed") filter.isCompleted = true;
    if (req.query.status === "pending") filter.isCompleted = false;

    const tasks = await taskModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting tasks",
      error
    });
  }
}

export const createTaskController = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.userId;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Task is required"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = new taskModel({ text, user: userId });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newTask.save({ session });
    user.tasks.push(newTask);
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Task created",
      task: newTask
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error creating task",
      error
    });
  }
}

export const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const task = await taskModel.findOneAndUpdate(
      { _id: id, user: req.userId },
      { text },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated",
      task
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error updating task", error });
  }
}

export const getTaskByIdController = async (req, res) => {
  try {
    const task = await taskModel.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ success: true, task });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const task = await taskModel.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    await userModel.findByIdAndUpdate(req.userId, { $pull: { tasks: task._id } });

    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
}

export const userTaskController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).populate("tasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      tasks: user.tasks
    });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
}

export const toggleCompleteController = async (req, res) => {
  try {
    const task = await taskModel.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status toggled",
      task
    });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
}
