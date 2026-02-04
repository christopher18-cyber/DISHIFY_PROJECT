import redisClient from "./redis.js"
import { generateToken } from "../utils/token.js"
const INVITE_TIME = 60 * 60 * 12

export const storeStaffInviteToken = async (staffId) => {

    const token = generateToken()
    const key = `staff:invite:${token}`

    await redisClient.set(key, staffId.toString(), { EX: INVITE_TIME })

    return {
        success: true,
        token
    }
}

export const getStaffIdFromToken = async (token) => {
    const key = `staff:invite:${token}`
    const staffId = await redisClient.get(key)

    if (!staffId) {
        return {
            message: "Invite expired or invalid.",
            success: false
        }
    }

    return {
        staffId,
        success: true
    }
}

export const deleteStaffInviteToken = async (token) => {
    const key = `staff:invite:${token}`

    await redisClient.del(key)
}