import "dotenv/config"
import logger from "../utils/logger.js"
import UserImage from "../models/UserImage.js"
import User from "../models/User.js"
import Dish from "../models/Dish.js"
import redisClient from "../config/redis.js"

export async function adminLogin(req, res) {
    logger.info("Admin login endpoint hitted.")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}

export async function createStaff(req, res) {
    logger.info("Admin, create staff endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function deleteStaff(req, res) {
    logger.info("Admin, delete staff endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllStaffs(req, res) {
    logger.info("Admin, get all staffs endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllUsers(req, res) {
    logger.info("Admin, get all users endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllProducts(req, res) {
    logger.info("Admin, get all products endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}


export async function getAllReviewsFromAllUsers(req, res) {
    logger.info("Admin, get all review from the users endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error", err)
        res.status(500).json({
            success: false,
            message: "Server internal error."
        })
    }
}

