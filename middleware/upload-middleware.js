import multer from "multer";
import path from "path"

// set our multer storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

// set file filter, whether jpg, png or jpeg

const checkFileFilter = (req, file, cb) => {
    const allowed = ["image/jpg", "image/jpeg", "image/png"]

    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only images are allowed."), false)
    }
}


const upload = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 //10MB
    }
})

export const uploadMiddleware = upload