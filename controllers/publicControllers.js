import logger from "../utils/logger.js"

export async function homeCon(req, res) {
    logger.info("Home page endpoint hitted")
    try { }
    catch (err) {
        logger.error("Server internal error")
        res.status(500).json({
            success: false,
            message: `Server internal error`
        })
    }
}