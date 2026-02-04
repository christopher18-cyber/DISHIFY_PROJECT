import express from "express";
import { isStaffUser } from "../middleware/staff-middleware.js";
import { forgottenPasswordConForStaff, postDishes, staffChangePassword, staffChangePicture, staffDashboard, staffProperSignUp, staffUploadProfileCon, verifyOTPForStaffForgottenPassword, sendOtpForStaff } from "../controllers/staffControllers.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { uploadMiddleware } from "../middleware/upload-middleware.js";

export const staffRoutes = express.Router()

staffRoutes.post("/dashboard", authMiddleware, isStaffUser, staffDashboard)

staffRoutes.post("/post-dishes", authMiddleware, isStaffUser, uploadMiddleware.single("image"), postDishes)

staffRoutes.post("/signup", staffProperSignUp)

// staffRoutes.put("/send-otp", sendOtpForStaff)