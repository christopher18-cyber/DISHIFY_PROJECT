import mongoose from "mongoose";

const ReviewSchema = new mongoose.model({
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    messages: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true })

const Review = mongoose.model("Review", ReviewSchema)

export default Review 
