import redisClient from "../config/redis.js";
import bcrypt from "bcrypt"

export const saveOTP = async (email, otp) => {
    const key = `otp:${email}`

    const hashedOtp = await bcrypt.hash(String(otp), 10)

    // expires in 5 minutes

    await redisClient.set(key, hashedOtp, {
        EX: 300
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