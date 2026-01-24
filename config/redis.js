import "dotenv/config"
import { createClient } from "redis";
import logger from "../utils/logger.js";

const redisClient = createClient({
    url: process.env.REDIS_URL
})


redisClient.on("connect", () => {
    logger.log("Redis connected.")
})

redisClient.on("error", (err) => {
    logger.error(`Redis error`, err)
})

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect()
    }
}

export default redisClient