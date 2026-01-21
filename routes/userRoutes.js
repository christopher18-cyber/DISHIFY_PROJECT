import express from "express";
import { registerUserCon, loginUserCon, changePasswordCon, sendOtpCon } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const userRouter = express.Router()

userRouter.post("/register", registerUserCon)

userRouter.post("/login", loginUserCon)

userRouter.post("/send-otp", sendOtpCon)

userRouter.post("/chahnge-password", authMiddleware, changePasswordCon)

userRouter.get("",)