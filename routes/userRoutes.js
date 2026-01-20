import express from "express";
import { registerUserCon, loginUserCon } from "../controllers/userController.js";

export const userRouter = express.Router()

userRouter.post("/register", registerUserCon)

userRouter.post("/login", loginUserCon)