import "dotenv/config"
import express from "express"
import { connectToDB } from "./database/db.js"
import { userRouter } from "./routes/userRoutes.js"
import helmet from "helmet"
// import Redis from "ioredis"
// import rateLimit from "express-rate-limit"
import { configCors } from "./middleware/cors.js"
import logger from "./utils/logger.js"
import errorHandler from "./middleware/errorHandler.js"
import { connectRedis } from "./config/redis.js"
const app = express()


const PORT = process.env.PORT || 3000


connectToDB()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(configCors())

await connectRedis()

// const sensitivePoint = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 30,
//     standardHeaders: true,
//     legacyHeaders: true,
//     handler: (req, res) => {
//         logger.warn(`Sensitive endpoint rate limit exceeded for IP, ${req.ip}`)
//         res.status(429).json({
//             success: false,
//             message: "Too many requests."
//         })
//     }
// })

app.use(errorHandler)

app.use("/api/user", userRouter)

app.listen(PORT, () => {
    logger.info(`Server now running on port ${PORT}`)
})