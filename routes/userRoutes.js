import express from "express";
import { registerUserCon } from "../controllers/userController.js";

export const userRouter = express.Router()

userRouter.post("/register", registerUserCon)