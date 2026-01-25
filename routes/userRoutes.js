import express from "express";
import { registerUserCon, loginUserCon, changePasswordCon, sendSignupOtp, verifyOTPCon } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const userRouter = express.Router()

userRouter.post("/register", registerUserCon)

userRouter.post("/login", loginUserCon)

// userRouter.post("/send-otp", s)

userRouter.post("/send-otp", sendSignupOtp)

userRouter.post("/change-password", authMiddleware, changePasswordCon)

userRouter.post("/verify-signup-otp", verifyOTPCon)

// userRouter.get("",)