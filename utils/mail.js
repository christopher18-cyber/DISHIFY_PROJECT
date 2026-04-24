import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service:"gmail",
	auth:{
		user:process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
	// host: "smtp.resend.com",
	// port: 465,
	// secure: true,
	// auth: {
	// 	user: "resend",
	// 	pass: process.env.RESEND_API_KEY,
	// },
});

export default transporter;
