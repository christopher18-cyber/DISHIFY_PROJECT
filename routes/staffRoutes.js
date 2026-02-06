import express from "express";
import { isStaffUser } from "../middleware/staff-middleware.js";
import { forgottenPasswordConForStaff, postDishes, staffChangePassword, staffChangePicture, staffDashboard, staffProperSignUp, staffUploadProfileCon, verifyOTPForStaffForgottenPassword, sendOtpForStaff, getAllReviewsFromAllUsers, getAllOrders } from "../controllers/staffControllers.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { uploadMiddleware } from "../middleware/upload-middleware.js";

export const staffRoutes = express.Router()

staffRoutes.post("/dashboard", authMiddleware, isStaffUser, staffDashboard)

staffRoutes.post("/post-dishes", authMiddleware, isStaffUser, uploadMiddleware.single("image"), postDishes)

staffRoutes.post("/signup", staffProperSignUp)

staffRoutes.post("/send-otp-forgotten-password", sendOtpForStaff)

staffRoutes.post("/verify-otp-forgotten-password", verifyOTPForStaffForgottenPassword)

staffRoutes.post("/reset-password", forgottenPasswordConForStaff)

staffRoutes.post("/change-password", authMiddleware, isStaffUser, staffChangePassword)

staffRoutes.get("/get-reviews", authMiddleware, isStaffUser, getAllReviewsFromAllUsers)

staffRoutes.get("/get-orders", authMiddleware, isStaffUser, getAllOrders)