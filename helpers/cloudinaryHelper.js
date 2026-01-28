import cloudinary from "../config/cloudinary.js";
import logger from "../utils/logger.js";

export async function uploadToCloudinary(filepath) {
    try {
        const result = await cloudinary.uploader.upload(filepath)

        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    }
    catch (err) {
        logger.error("Error while uploading to cloudinary", err)
        throw new Error("Error while uplaoding to the cloudinary")
    }
}