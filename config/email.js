import transporter from "../utils/mail.js";

export const sendOTPEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `DISHIFY: <process.env.EMAIL_USER>`,
        to: email,
        subject: "Your OTP Code for sign up",
        html: `
            <h2>Dishify OTP Verification for sign up</h2>
            <p>Your Otp Code is: </p>
            <h1>${otp}</h1>
            <p>This code expires in 5 minutes.</p>
        `
    })
}


export const sendOtpForFogottenPassword = async (email, otp) => {
    await transporter.sendMail({
        from: `DISHIFY: <process.env.EMAIL_USER>`,
        to: email,
        subject: "Your OTP Code for forgotten password",
        html: `
            <h2>Dishify OTP Verification for Forgotten password</h2>
            <p> Your Otp code is </p>
            <h1>${otp}</h1>
            <p>This code expires in 5 minutes</p>
        `

    })
}


export const sendResetLinkForForgottenPassword = async (email, resetToken) => {
    await transporter.sendMail({
        from: `DISHIFY: <process.env.EMAIL_USER>`,
        to: email,
        subject: "Reset Your Password",
        html: `
            <p>You requested to reset your password.</p>
            <p>Click the link below to reset it: </p>
            <a href=${resetToken}">${resetToken}</a>
            <p>This link expires in 10 minutes</p>
        `
    })
}