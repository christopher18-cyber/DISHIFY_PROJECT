import mongoose from "mongoose";
import logger from "../utils/logger.js";

const uri = process.env.MONGODB_URL

export async function connectToDB() {
    try {
        await mongoose.connect(uri, { dbName: "DISHIFY_DATABASE" })
        logger.info(`MongoDB connected successfully.`)
    }
    catch (err) {
        logger.error(`MongoDB connection failed.`, err)
    }
}