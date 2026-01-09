import "dotenv/config"
import express from "express"
import logger from "./utils/logger.js"
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    logger.info(`Server now running on port ${PORT}`)
})