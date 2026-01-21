export const isAdminUser = (req, res, next) => {
    if (req.userInfo.role !== "admin") {
        res.status(403).json({
            message: "Access denied, Admin right denied"
        })
    }

    next()
}