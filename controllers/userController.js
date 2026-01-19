import User from "../models/User.js";
import logger from "../utils/logger.js";
import { validateRegisterUserSchema, validateLoginUser } from "../validators/userValidator.js";
import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"

export async function registerUserCon(req, res) {
    logger.info("Register user endpoint hitted")
    const { error } = validateRegisterUserSchema(req.body)

    if (error) {
        logger.warn("Valiidation error", error.message)
        res.status(400).json({
            success: false,
            message: error.details?.[0]?.message || error.message
        })
    } else {
        try {
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
                    role: role || "user",
                    phoneNo
                })

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
        catch (err) {
            logger.error("Error", err)
            res.status(500).json({
                message: err,
                success: false
            })
        }
    }
}