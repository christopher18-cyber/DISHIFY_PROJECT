import "dotenv/config"
import logger from "../utils/logger.js"
import UserImage from "../models/UserImage.js"
import User from "../models/User.js"
import Dish from "../models/Dish.js"
import redisClient from "../config/redis.js"
import { validateLoginUser, validateRegisterUserSchema } from "../validators/userValidator.js"

export async function adminDashboard(req, res) {
    logger.info("Admin dashboard endpoint hitted.")
    try {
        const userId = req.userInfo.userId

        const user = await User.findById(userId).select("-password")

        if (!user) {

        } else {
            const profileImage = await UserImage.findOne({ uploadedBy: userId })
                .select("url publicId createdAt")

            res.status(200).json({
                success: true,
                message: "Admin dashboard data.",
                data: {
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    role: user.role
                },
                profileImage
            })
        }
    }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}

export async function createStaff(req, res) {
    logger.info("Admin, create staff endpoint hitted")
    try {

        const { error } = validateRegisterUserSchema(req.body)
        if (error) {
            logger.error("Validation error", error)
            res.status(400).json({
                success: false,
                message: "Validation error."
            })
        } else {

            const { username, email, firstName, lastName } = req.body

            const tempPassword = crypto.randomBytes(4).toString("hex")

            const staff = await User.create({
                firstName,
                lastName,
                email,
                username,
                password: tempPassword,
                role: "staff"
            })

            res.status(201).json({
                success: false,
                email: staff.email,
                message: "Staff created successfully",
                password: staff.password
            })

        }
    }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function deleteStaff(req, res) {
    logger.info("Admin, delete staff endpoint hitted")
    try {
        const { email } = req.body
        const staff = await User.findOne({ email })
    }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllStaffs(req, res) {
    logger.info("Admin, get all staffs endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllUsers(req, res) {
    logger.info("Admin, get all users endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllProducts(req, res) {
    logger.info("Admin, get all products endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllReviewsFromAllUsers(req, res) {
    logger.info("Admin, get all review from the users endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}

