import jwt from "jsonwebtoken"
import logger from "../utils/logger.js"

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    logger.info(authHeader)
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: `Access denied, no token provided, please login to continue`
        })
    } else {

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // logger.info(decodedToken)
            req.userInfo = decodedToken
            logger.info(req.userInfo)
            // logger.info(req.userInfo.email)
            next()
        }
        catch (err) {
            logger.error("Invalid token or expired token", err)
            res.status(401).json({
                success: false,
                message: `Invalid or expired token`,
                err: err.message
            })
        }
    }
}