import express from "express";
import { registerUserCon, loginUserCon, changePasswordCon, sendSignupOtp, verifyOTPForForgottenPasswordCon, verifyOTPCon, sendOtpForFogottenPasswordCon } from "../controllers/userController.js";
import { authMiddleware, attachEmailMiddleware } from "../middleware/auth-middleware.js";

export const userRouter = express.Router()

userRouter.post("/register", registerUserCon)

userRouter.post("/login", loginUserCon)

userRouter.post("/send-otp-forgotten-password", sendOtpForFogottenPasswordCon)

userRouter.post("/send-otp", sendSignupOtp)

userRouter.post("/change-password", authMiddleware, changePasswordCon)

userRouter.post("/verify-signup-otp", verifyOTPCon)

userRouter.post("/verify-otp-forgotten-password", attachEmailMiddleware, verifyOTPForForgottenPasswordCon)