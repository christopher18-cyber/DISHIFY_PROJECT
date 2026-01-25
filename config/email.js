import transporter from "../utils/mail.js";

export const sendOTPEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `DISHIFY: <process.env.EMAIL_USER>`,
        to: email,
        subject: "Your OTP Code",
        html: `
            <h2>Dishify OTP Verification</h2>
            <p>Your Otp Code is: </p>
            <h1>${otp}</h1>
            <p>This code expires in 5 minutes.</p>
        `
    })
}