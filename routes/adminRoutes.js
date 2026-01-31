import express from "express";
import { isAdminUser } from "../middleware/admin-middleware.js";
import { getAllUsers, adminDashboard } from "../controllers/adminControllers.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const adminRoutes = express.Router()

adminRoutes.get("/dashboard", authMiddleware, isAdminUser, adminDashboard)

adminRoutes.get("/get-all-users", authMiddleware, isAdminUser, getAllUsers)