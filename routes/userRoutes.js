import express from "express";
import { registerUserCon, loginUserCon, userDashBoardCon, userSubmitReview, changeProfilepictureCon, userDeleteAccount, userUploadProfileCon, forgottenPasswordCon, changePasswordCon, sendSignupOtp, verifyOTPForForgottenPasswordCon, verifyOTPCon, sendOtpForFogottenPasswordCon, orderPageCon, getAllCarts, addToCart, DecreaseCartFromCart, clearCart, removeItem, logoutUser } from "../controllers/userController.js";
import { authMiddleware, attachEmailMiddleware } from "../middleware/auth-middleware.js";
import { uploadMiddleware } from "../middleware/upload-middleware.js";

export const userRouter = express.Router()

userRouter.post("/register", registerUserCon)

userRouter.post("/login", loginUserCon)

userRouter.post("/send-otp-forgotten-password", sendOtpForFogottenPasswordCon)

userRouter.post("/send-otp", sendSignupOtp)

userRouter.post("/change-password", authMiddleware, changePasswordCon)

userRouter.post("/verify-signup-otp", verifyOTPCon)

userRouter.post("/verify-otp-forgotten-password", verifyOTPForForgottenPasswordCon)

userRouter.get("/reset-password", forgottenPasswordCon)

userRouter.get("/user-dashboard", authMiddleware, userDashBoardCon)

userRouter.post("/upload-profile-picture", authMiddleware, uploadMiddleware.single("image"), userUploadProfileCon)

userRouter.put("/change-profile-picture", authMiddleware, uploadMiddleware.single("image"), changeProfilepictureCon)

userRouter.delete("/delete-account", authMiddleware, userDeleteAccount)

userRouter.post("/submit-review", authMiddleware, userSubmitReview)

userRouter.post("/order-dishes", authMiddleware, orderPageCon)

userRouter.post("/get-all-carts", authMiddleware, getAllCarts)

userRouter.post("/add/cart", authMiddleware, addToCart)

userRouter.post("/decrease/cart", authMiddleware, DecreaseCartFromCart)

userRouter.post("clear/cart", authMiddleware, clearCart)

userRouter.post("/remove/cart", authMiddleware, removeItem)

userRouter.post("/logout", authMiddleware, logoutUser)