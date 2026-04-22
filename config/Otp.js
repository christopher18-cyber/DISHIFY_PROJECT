import redisClient from "../config/redis.js";
import bcrypt from "bcrypt"
import * as crypto from "crypto"


export const saveOTP = async (email, otp) => {
    const key = `otp:${email}`

    const hashedOtp = await bcrypt.hash(String(otp), 10)

    // expires in 5 minutes

    await redisClient.set(key, hashedOtp, {
        ex: 300
    })
}


export const verifyOTP = async (email, otp) => {
    const key = `otp:${email}`

    const storedOtp = await redisClient.get(key)

    if (!storedOtp) {
        return {
            success: false,
            message: "OTP expired or not found."
        }
    } else {
        const isValidOtp = await bcrypt.compare(String(otp), storedOtp)
        if (!isValidOtp) {
            return {
                success: false,
                message: "Invalid OTP."
            }
        } else {
            await redisClient.del(key)
            return {
                success: true,
                message: "OTP verified successfully."
            }
        }
    }
}


export const sendInviteLinkStaffSignup = async (staff) => {
    const inviteToken = crypto.randomBytes(32).toString("hex")
    const redisKey = `staff:invite:${inviteToken}`

    await redisClient.set(redisKey, staff._id.toString(), { ex: 6000 })
}