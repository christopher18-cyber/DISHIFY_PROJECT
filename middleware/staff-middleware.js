export const isStaffUser = (req, res, next) => {

    if (!req.userInfo) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });

    } if (req.userInfo.role != "staff") {
        res.status(403).json({
            success: false,
            message: "Access denied, staff right only reserved."
        })
    }

    next()
}