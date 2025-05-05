import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./db.js";
import userRoutes from "./routes/user_routes.js";
import taskRoutes from "./routes/task_routes.js";

dotenv.config();

connectDB();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet()); // Adds security headers

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/task", taskRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server",
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.DEV_MODE || "Development"} mode on PORT ${PORT}`);
});