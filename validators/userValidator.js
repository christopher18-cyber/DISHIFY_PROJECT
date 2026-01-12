import joi from "joi"

export const registerUserSchema = joi.object({
    firstName: joi.string()
        .min(2)
        .max(50)
        .required(),

    lastName: joi.string()
        .min(2)
        .max(50)
        .required(),

    email: joi.string()
        .email({ tlds: { allow: ["com", "org", "edu", "ng"] } })
        .required()
        .messages({
            "string-message": "Please provide a valid email address"
        }),

    password: joi.string()
        .min(8)
        .required(),

    username: joi.string()
        .min(6)
        .max(50)
        .required()
})


export const loginUser = joi.object({
    email: joi.string()
        .email()
        .required()
        .messages({
            "string-message": "Please provide a valid email address"
        }),

    password: joi.string()
        .min(8)
        .required()
})