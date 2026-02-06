import "dotenv/config"
import logger from "../utils/logger.js"
import UserImage from "../models/UserImage.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import redisClient from "../config/redis.js"
import cloudinary from "../config/cloudinary.js"
import fs from "fs"
import * as crypto from "crypto"
import { generateOtp } from "../utils/generatorOtp.js"
import Dish from "../models/Dish.js"
import { deleteStaffInviteToken, getStaffIdFromToken } from "../config/token.js"
import { saveOTP, verifyOTP } from "../config/Otp.js"
import { sendOtpForFogottenPassword, sendResetLinkForForgottenPassword } from "../config/email.js"
import Review from "../models/Review.js"
import order from "../models/Order.js"


export async function staffProperSignUp(req, res) {
    logger.info("Sign for staff endpoint hitted.")
    try {
        const { inviteToken } = req.query
        const { password } = req.body

        if (!inviteToken) {
            res.status(400).json({
                success: false,
                message: "Invite link not found or expired."
            })
        } else {
            if (!password) {
                res.status(400).json({
                    success: false,
                    message: "Password field is required."
                })
            } else {
                const invite = await getStaffIdFromToken(inviteToken)

                if (!invite.success) {
                    return res.status(400).json(invite)
                } else {
                    const staff = await User.findById(invite.staffId)
                    if (!staff || staff.isActive) {
                        res.status(400).json({
                            success: false,
                            message: "Staff already exist activated or invalid"
                        })
                    } else {
                        staff.password = password
                        staff.isActive = true

                        await staff.save()

                        await deleteStaffInviteToken(inviteToken)

                        res.status(200).json({
                            success: true,
                            message: "Staff accont successfully activated."
                        })
                    }
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


export async function postDishes(req, res) {
    try {
        const { name, price, description } = req.body

        if (!name || !price || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        } else {
            let imageData = {}

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "dishes"
                })

                imageData = {
                    url: result.secure_url,
                    publicId: result.public_id
                }
            }

            const dish = await Dish.create({
                name,
                price,
                description,
                createdBy: req.userInfo._id,
                status: "pending",
                image: imageData
            })

            res.status(201).json({
                success: true,
                message: "Dish created successfully.",
                dish
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


export async function getAllDishes(req, res) {
    logger.info("Staff, get all dishes endpoint hitted")
    try {
        const getAllDishes = await Dish.find()
        if (!getAllDishes) {
            res.status(400).json({
                success: false,
                message: "No dish is found."
            })
        } else {
            res.status(200).json({
                success: true,
                message: "All Dishes in the cart.",
                getAllDishes
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


export async function staffUploadProfileCon(req, res) {
    logger.info("staff upload profile picture endpoint hitted")
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required, please upload an image."
            })
        } else {
            const { url, publicId } = await uploadToCloudinary(req.file.path)

            // store in database

            const newlyUploadedImage = new UserImage({
                url,
                publicId,
                uploadedBy: req.userInfo.userId
            })

            await newlyUploadedImage.save()

            try {
                fs.unlinkSync(req.file.path)
            } catch (err) {
                logger.error("Failed to delete local file.", err)
            }

            res.status(201).json({
                success: true,
                message: "Image successfully uploaded.",
                image: newlyUploadedImage
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


export async function staffChangePicture(req, res) {
    logger.info("staff change picture endpoint hitted")
    try {
        const userId = req.userInfo.userId

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "Profile Image is required"
            })
        } else {
            const existingimage = await UserImage.findOne({ uploadedBy: userId })

            if (existingimage) {
                await cloudinary.uploader.destroy(existingimage.publicId)

                await UserImage.deleteOne({ _id: existingimage._id })
            } else {
                const { url, publicId } = await uploadToCloudinary(req.file.path)

                const newProfileImage = new UserImage({
                    url,
                    publicId,
                    uploadedBy: userId
                })

                await newProfileImage.save()

                try {
                    fs.unlinkSync(req.file.path)
                } catch (err) {
                    logger.warn("Failed to delete local file", err)
                }

                res.status(200).json({
                    success: true,
                    message: "Profile picture changed successfully.",
                    profileIimage: {
                        url: newProfileImage.url,
                        publicId: newProfileImage.publicId
                    }
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


export async function staffDashboard(req, res) {
    logger.info("Staff dashboard endpoint hitted.")
    try {
        const userId = req.userInfo.userId

        const staff = await User.findById(userId).select("-password")

        if (!staff) {
            return res.status(400).json({
                success: false,
                message: "Not authorized or invalid user"
            })
        } else {

            // fetch one profile image
            const profileImage = await UserImage.findOne({ uploadedBy: userId })
                .select("url publicId createdAt")

            res.status(200).json({
                success: true,
                message: "User dashboard data",
                data: {
                    username: staff.username,
                    email: staff.email,
                    createdAt: staff.createdAt
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


export async function staffChangePassword(req, res) {
    logger.info("Change password endpoint is hitted")
    try {
        // get the req.userInfo from the middleware
        const userId = req.userInfo.userId
        // extract old and new password

        const { oldpassword, newpassword } = req.body
        // find the logged user

        const user = await User.findById(userId)

        if (!user) {
            res.status(400).json({
                success: false,
                message: `User not found.`
            })
        } else {

            const isMatchPassword = await bcrypt.compare(oldpassword, user.password)
            if (!isMatchPassword) {
                res.status(400).json({
                    success: false,
                    message: `Password is not correct, please try again.`
                })
            } else {
                const salt = await bcrypt.genSalt(10)
                const newHashedPassword = await bcrypt.hash(newpassword, salt)


                user.password = newHashedPassword
                await user.save()

                res.status(200).json({
                    success: true,
                    message: `Password changed successfully.`
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

export async function sendOtpForStaff(req, res) {
    logger.info("Send otp for user forgotten password endpoint is hitted")
    try {

        const { email } = req.body || {}

        if (!email) {
            res.status(404).json({
                success: false,
                message: "Pls email is required."
            })
        } else {

            const user = await User.findOne({ email })

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            } else {

                const otp = generateOtp()

                await saveOTP(email, otp)

                await sendOtpForFogottenPassword(email, otp)

                await redisClient.set(`forgot-otp:${otp}`, email, { EX: 300 })
                res.status(200).json({
                    success: true,
                    message: "OTP sent to the email."
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


export async function verifyOTPForStaffForgottenPassword(req, res) {
    logger.info("Send otp for after registering endpoint is hitted.")
    try {
        const { otp } = req.body

        if (!otp) {
            return res.status(400).json({
                message: "OTP is required.",
                success: false
            })
        } else {

            const email = await redisClient.get(`forgot-otp:${otp}`)

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "OTP is invalid or expired."
                })
            } else {


                const result = await verifyOTP(email, otp)

                if (!result.success) {
                    res.status(400).json({
                        message: "OTP is not valid",
                        success: false
                    })
                } else {

                    const resetToken = crypto.randomBytes(32).toString("hex")

                    await redisClient.set(`reset:${resetToken}`, email, { EX: 600 })

                    const resetLink = `${process.env.FRONTEND_URL}/api/staff/reset-password?resetToken=${resetToken}`

                    await sendResetLinkForForgottenPassword(email, resetLink)
                    return res.status(200).json({
                        message: "OTP verified",
                        success: true,
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


export async function forgottenPasswordConForStaff(req, res) {
    logger.info("User forgotten password endpoint is hitted")
    try {
        const { resetToken } = req.query
        const { newpassword } = req.body

        if (!resetToken || !newpassword) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password are required."
            })
        } else {
            const email = await redisClient.get(`reset:${resetToken}`)
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Reset token is invalid or expired"
                })
            } else {
                const user = await User.findOne({ email })

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found."
                    })
                } else {
                    const hashedPassword = await bcrypt.hash(newpassword, 10)

                    user.password = hashedPassword

                    await user.save()

                    await redisClient.del(`reset:${resetToken}`)

                    return res.status(200).json({
                        success: true,
                        message: "Password has been reset successfully."
                    })
                }
            }
        }
    }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: `Server internal error.`
        })
    }
}


export async function getAllReviewsFromAllUsers(req, res) {
    logger.info("Staff, get all reviews from users")
    try {
        const allReviews = await Review.find()

        if (!allReviews) {
            res.status(200).json({
                success: true,
                message: "No post is found."
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




export async function manageOrder(req, res) {
    logger.info("Staff manage order endpoint hitted.")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllOrders(req, res) {
    logger.info("Staff get all orders endpoint hitted.")
    try {
        const orders = await order.find({})
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


export async function updateDishCon(req, res) {
    logger.info("Staff, update dish endpoint hitted")
    try {
        const { dishId } = req.params
        const { name, price, description } = req.body

        const dish = await Dish.findById(dishId)

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found"
            })
        } else {
            if (name) dish.name = name
            if (price) dish.price = price
            if (description) dish.description = description

            if (req.file) {
                if (dish.image && dish.publicId) {
                    await cloudinary.uploader.destroy(dish.publicId)
                }

                const { secure_url, public_id } = await cloudinary.uploader.upload(req.file)
                dish.image = secure_url

                dish.publicId = public_id

                fs.unlinkSync(req.file.path)
            }

            await dish.save()
        }
        res.status(200).json({
            success: true,
            message: "Dish updated successfully"
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