import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true

    },
    role: {
        type: String,
        enum: ["customer", "admin", "staff"],
        default: "customer"
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6
    },
    phoneNo: {
        type: String,
        unique: true,
        trim: true,
        minlength: 10
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User