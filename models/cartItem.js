import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dish",
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        priceAtTime: {
            type: Number
        }
    }],
    totalAmount: {
        default: 0,
        type: Number
    }
}, {
    timestamps: true
})

const cartItem = mongoose.model("CartItem", CartSchema)
export default cartItem