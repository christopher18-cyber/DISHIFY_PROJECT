import "dotenv/config"
import { Redis } from "@upstash/redis";
import logger from "../utils/logger.js";

console.log("URL:", process.env.UPSTASH_REDIS_REST_URL)
console.log("TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN)

const redisClient = new Redis({
    url : process.env.UPSTASH_REDIS_REST_URL,
    token : process.env.UPSTASH_REDIS_REST_TOKEN
})

// redisClient.on("connect", () => {
//     logger.info({ message: "Redis connected." })
// })

// redisClient.on("error", (err) => {
//     logger.error({
//         message: "Redis error",
//         error: err.message
//     })
// })

// export const connectRedis = async () => {
//     if (!redisClient.isOpen) {
//         await redisClient.connect()
//     }
// }

export async function connectRedis(){
    try{
        redisClient.ping()
        logger.info("Redis connected.")
    }catch(err){
        logger.error({message:"Redis connection failed", error:err.message})
    }
}

export default redisClient