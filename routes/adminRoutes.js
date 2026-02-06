import express from "express";
import { isAdminUser } from "../middleware/admin-middleware.js";
import { getAllUsers, adminDashboard, createStaff, getAllStaffs, getAllProducts, deleteStaff, getAllReviewsFromAllUsers, getAllOrders } from "../controllers/adminControllers.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const adminRoutes = express.Router()

adminRoutes.get("/dashboard", authMiddleware, isAdminUser, adminDashboard)

adminRoutes.get("/get-all-users", authMiddleware, isAdminUser, getAllUsers)

adminRoutes.post("/create-staff", authMiddleware, isAdminUser, createStaff)

adminRoutes.get("/get-all-staffs", authMiddleware, isAdminUser, getAllStaffs)

adminRoutes.get("/get-all-dishes", authMiddleware, isAdminUser, getAllProducts)

adminRoutes.delete("/delete-staff", authMiddleware, isAdminUser, deleteStaff)

adminRoutes.get("/get-reviews", authMiddleware, isAdminUser, getAllReviewsFromAllUsers)

adminRoutes.get("/get-orders", authMiddleware, isAdminUser, getAllOrders)