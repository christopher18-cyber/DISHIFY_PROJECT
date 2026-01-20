import "dotenv/config"
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { validateRegisterUserSchema, validateLoginUser } from "../validators/userValidator.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

