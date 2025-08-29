import { User } from "../models/User";
import { getOTP , storeOTP , deleteOTP  } from "../utils/otpStore";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const sendOtpService = async (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await storeOTP(email, otp);
    // need to send mail using nodemon
    console.log(`OTP sent to ${email}: ${otp}`);
    return {message : `Otp Sent successfully please check your mail ${email}`}
}

export const verifyOtpService = async (email: string, otp: string) => {
    const storedOtp = await getOTP(email);
    if (!storedOtp) {
        throw new Error("OTP not found or expired");
    }
    if (storedOtp !== otp) {
        throw new Error("Invalid OTP Please provide correct otp");
    }
    await deleteOTP(email);
    let user = await User.findOne({ email });
    if (!user)  user = await User.create({ email });
    const token = generateToken({ email });
    return { message: "OTP verified successfully", token };
};
