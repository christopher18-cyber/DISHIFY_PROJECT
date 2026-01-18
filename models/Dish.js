import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        url: String,
        publicId: String
    },
    createdAt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["draft", "pending", "approved", "rejected", "archived"],
        default: "draft"
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    approvedAt: Date
},
    { timestamps: true })

const dish = mongoose.model("Dish", dishSchema)

export default dish