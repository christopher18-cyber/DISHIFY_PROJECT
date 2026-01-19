import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [
        {
            dish: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Dish"
            },
            quantity: Number
        }
    ],

    status: {
        type: String,
        enum: ["pending", "preparing", "comoleted"],
        default: "pending"
    },

    totalNumber: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })


const order = mongoose.model("Order", orderSchema)

export default order