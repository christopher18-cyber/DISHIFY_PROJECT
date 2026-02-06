import "dotenv/config"
import logger from "../utils/logger.js"
import UserImage from "../models/UserImage.js"
import User from "../models/User.js"
import Dish from "../models/Dish.js"
import Review from "../models/Review.js"
import order from "../models/Order.js"
import { registerStaffSchema } from "../validators/staffValidator.js"
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
    try {
        const allReviews = await Review.find()

        if (!allReviews) {
            res.status(200).json({
                success: true,
                message: "No review is found from any user."
            })
        } else {
            res.status(200).json({
                success: true,
                message: "All review gotten.",
                allReviews
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


export async function getAllOrders(req, res) {
    logger.info("admin get all orders endpoint hitted.")
    try {
        const orders = await order.find()
            .populate("customer", "username email firstName")
            .populate("items.dish", "name price image")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "Orders fecthed successfully.",
            totalOrders: orders.length,
            orders
        })
    }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function approveDish(req, res) {
    logger.info("admin, approve dishes endpoint hitted.")
    try {
        const { dishId } = req.params

        const dish = await DishfindById(dishId)

        if (!dish) {
            res.status(404).json({
                success: false,
                message: "Dish not found."
            })
        } else {

            if (dish.status === "approved") {
                return res.status(400).json({
                    success: false,
                    message: "Dish is already approved."
                })
            } else {
                dish.status = "approved"
                await dish.save()

                res.status(200).json({
                    success: true,
                    message: "Dish approved successfully.",
                    dish
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


export async function rejectDish(req, res) {
    logger.info("Admin, reject dishes endpoint hitted")
    try {
        const { dishId } = req.params
        const { reason } = req.body

        const dish = await Dish.findById(dishId)

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found."
            })
        } else {
            if (dish.status === "rejected") {
                res.status(400).json({
                    message: "Dish is already rejected",
                    success: false
                })
            } else {
                dish.status = "rejected"
                dish.reason = reason || "No reason provided."
                await dish.save()

                res.status(200).json({
                    success: true,
                    message: "Dish rejected successfully.",
                    dish
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


export async function getAllPendingDishes(req, res) {
    logger.info("Admin, get all pending dishes endpoint hitted.")
    try {
        const allPendingDishes = await Dish.find({ status: "pending" })

        if (allPendingDishes.length === 0) {
            res.status(200).json({
                success: true,
                message: "No pending dish is found",
                allPendingDishes: []

            })
        } else {
            res.status(200).json({
                success: true,
                message: "Pending dishes retrived successfully.",
                allPendingDishes
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


export async function logoutUser(req, res) {
    try {
        const authHeader = req.headers["authorization"]
        const token = authHeader & authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, cannot logout"
            })
        }

        await redisClient.set(`blacklist:${token}`, true, { EX: 1800 })

        res.status(200).json({
            success: true,
            message: "Logged out successfully."
        })
    }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error"
        })
    }
}