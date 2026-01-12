import "dotenv/config"
import express from "express"
import { connectToDB } from "./database/db.js"
import logger from "./utils/logger.js"
const app = express()

connectToDB()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    logger.info(`Server now running on port ${PORT}`)
})