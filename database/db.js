import mongoose from "mongoose";
import logger from "../utils/logger.js";

const uri = process.env.MONGODB_URL

export async function connectToDB() {
    try {
        await mongoose.connect(uri)
        logger.info(`MongoDB connected successfully.`, mongoose.connection.name)
    }
    catch (err) {
        logger.error(`MongoDB connection failed.`, err)
    }
}