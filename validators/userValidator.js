import joi from "joi"

export function validateRegisterUserSchema(data) {

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
                "string-message": "Please provide a valid email address"
            }),

        password: joi.string()
            .min(8)
            .required(),

        username: joi.string()
            .min(6)
            .max(50)
            .required(),

        phoneNo: joi.string()
            .min(10)
            .max(14)

    })
    return schema.validate(data)

}

export function validateLoginUser(data) {
    const schema = joi.object({
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

    return schema.validate(data)
}