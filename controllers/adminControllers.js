import "dotenv/config"
import logger from "../utils/logger.js"
import UserImage from "../models/UserImage.js"
import User from "../models/User.js"
import Dish from "../models/Dish.js"
import * as crypto from "crypto"
import redisClient from "../config/redis.js"
import { validateLoginUser, validateRegisterUserSchema } from "../validators/userValidator.js"
import { registerStaffSchema } from "../validators/staffValidator.js"
import { sendOTPEmail } from "../config/email.js"
import { sendInviteLinkStaffSignup } from "../config/Otp.js"
import { sendInviteLinkForStaffSignup } from "../config/email.js"
import { storeStaffInviteToken } from "../config/token.js"

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

        const { error } = registerStaffSchema(req.body)
        if (error) {
            logger.error("Validation error", error)
            res.status(400).json({
                success: false,
                message: "Validation error."
            })
        } else {

            const { username, email, firstName, lastName } = req.body

            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Staff already exists"
                })
            } else {

                const staff = await User.create({
                    firstName,
                    lastName,
                    email,
                    username,
                    password: null,
                    role: "staff",
                    isActive: false
                })


                const { token } = await storeStaffInviteToken(staff._id)

                const inviteLink = `${process.env.FRONTEND_URL}/api/staff/signup?inviteToken=${token}`

                await sendInviteLinkForStaffSignup(staff.email, inviteLink)


                res.status(201).json({
                    success: true,
                    email: staff.email,
                    message: "Staff created and Invite link sent to staff successfully."
                })

            }

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

        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email field is required."
            })
        } else {

            const staff = await User.findOne({ email })

            if (!staff) {
                res.status(404).json({
                    success: false,
                    message: "Staff not found."
                })
            } else {

                if (staff.role !== "staff") {
                    return res.status(403).json({
                        success: false,
                        message: "User is not a staff."
                    })
                } else {

                    const deletedStaff = await staff.deleteOne()

                    res.status(200).json({
                        success: true,
                        message: "Staff deleted successfully.",
                        deletedStaff
                    })
                }
            }
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


export async function getAllStaffs(req, res) {
    logger.info("Admin, get all staffs endpoint hitted")
    try {
        const allStaffs = await User.find({ role: "staff" })

        if (!allStaffs) {
            res.status(400).json({
                success: false,
                message: "No staff is found."
            })
        } else {
            res.status(200).json({
                success: true,
                message: "",
                allStaffs
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


export async function getAllUsers(req, res) {
    logger.info("Admin, get all users endpoint hitted")
    try {
        const allUsers = await User.find({ role: "customer" })

        if (!allUsers) {
            res.status(200).json({
                success: false,
                message: "No staff is found."
            })
        } else {
            res.status(200).json({
                success: true,
                message: "All users retrived.",
                allUsers
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


export async function getAllProducts(req, res) {
    logger.info("Admin, get all products endpoint hitted")
    try {
        const getAllDish = await Dish.find()

        if (!getAllDish) {
            res.status(404).json({
                message: "No dish is found",
                success: false
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Found dishes",
                getAllDish
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