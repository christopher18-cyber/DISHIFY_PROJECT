import joi from "joi"

export function registerStaffSchema(data) {
    const schema = joi.object({
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
                "string-message": "Please provide a valid email"
            }),

        username: joi.string()
            .min(2)
            .max(50)
            .required()
    })

    return schema.validate(data)
}
export const loginStaffSchema = joi.object({
    email: joi.string()
        .email({ tlds: { allow: ["com", "org", "edu", "ng"] } })
        .required(),

    password: joi.string()
        .min(8)
        .max(50)
        .required()
})