import "dotenv/config"
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { validateRegisterUserSchema, validateLoginUser } from "../validators/userValidator.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { generateOtp } from "../utils/generatorOtp.js";

export async function startRegister(req, res) {
    logger.info("Beginning of registration started.")
    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    } else {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered.",
                success: false
            })
        } else {
            // generate otp
            const otp = generateOtp()
            const hashed = await bcrypt.hash(otp, 10)

            await OTP
        }
    }
}

export async function registerUserCon(req, res) {
    logger.info("Register user endpoint hitted")
    try {
        const { error } = validateRegisterUserSchema(req.body)
        if (error) {
            logger.warn("Valiidation error", error.message)
            res.status(400).json({
                success: false,
                message: error.details?.[0]?.message || error.message
            })
        } else {

            const { firstName, lastName, username, email, password, role, phoneNo } = req.body

            let user = await User.findOne({ $or: [{ email }, { phoneNo }, { username }] })

            if (user) {
                logger.warn("User already exist")
                res.status(400).json({
                    success: false,
                    message: "User already exist."
                })
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashed = await bcrypt.hash(password, salt)
                user = new User({
                    firstName,
                    lastName,
                    username,
                    email,
                    password: hashed,
                    role: role || "customer",
                    phoneNo
                })

                await user.save()

                if (user) {
                    res.status(201).json({
                        message: `User created successfully`,
                        success: true
                    })
                } else {
                    res.status(400).json({
                        message: "Unable to register users, please try again",
                        success: false
                    })
                }
            }
        }

    }
    catch (err) {
        logger.error("Error", err)
        res.status(500).json({
            message: err,
            success: false
        })
    }
}

export async function loginUserCon(req, res) {
    logger.info("Login user endpoint reached")
    try {
        const { error } = validateLoginUser(req.body)
        if (error) {
            logger.warn("Validation error", error)
            res.status(400).json({
                success: false,
                message: error.details?.[0]?.message || error.message
            })
        } else {
            const { email, password } = req.body
            let user = await User.findOne({ email })
            if (!user) {
                logger.warn("User not found.")
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            } else {
                const isValidPassword = await bcrypt.compare(password, user.password)
                if (!isValidPassword) {
                    logger.warn("Invalid password.")
                    res.status(404).json({
                        sucess: false,
                        message: "Invalid password."
                    })
                }
                else {
                    const accessToken = jwt.sign({
                        userId: user.id,
                        username: user.username,
                        role: user.role
                    }, process.env.JWT_SECRET_KEY, { expiresIn: "20m" })
                    res.status(200).json({
                        message: `Logged in successfully`,
                        success: true,
                        accessToken
                    })
                }
            }
        }
    }
    catch (err) {
        logger.error("Server error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function changePasswordCon(req, res) {
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

export async function sendOtpForFogottenPasswordCon(req, res) {
    logger.info("Send otp for user forgotten password endpoint is hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}

export async function sendOtpForRegisterCon(req, res) {
    logger.info("Send otp for after registering endpoint is hitted.")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}

export async function userDashBoardCon(req, res) {
    logger.info("User dashboard endpoint hitted.")
    try { }
    catch (err) {
        logger.error("server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function orderPageCon(req, res) {
    logger.info("User Order endpint hitted.")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error"
        })
    }
}

export async function userUploadProfileCon(req, res) {
    logger.info("User upload image endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error"
        })
    }
}

export async function changeProfilepictureCon(req, res) {
    logger.info("User change profile picture endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: `Server internal error.`
        })
    }
}


export async function forgottenPasswordCon(req, res) {
    logger.info("User forgotten password endpoint is hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: `Server internal error.`
        })
    }
}