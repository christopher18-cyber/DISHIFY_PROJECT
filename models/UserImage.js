import mongoose from "mongoose";

const UserImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const UserImage = mongoose.model("UserImage", UserImageSchema)

export default UserImage