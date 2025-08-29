import { Router } from "express";
import {
  signupWithEmail,
  verifyOTP,
  resendOTP,
  loginWithEmail,
  googleTokenLogin,
  googleLoginRedirect,
  googleCallback,
} from "../controller/authController";

const authRouter = Router();

// Email OTP signup & login
authRouter.post("/signup/email", signupWithEmail);   // send OTP after collecting name,dob,email
authRouter.post("/verify-otp", verifyOTP);           // verify OTP, create user if needed, return JWT
authRouter.post("/resend-otp", resendOTP);           // resend OTP
authRouter.post("/login/email", loginWithEmail);     // request login OTP

// Google flows
authRouter.post("/google/token-login", googleTokenLogin); // client side sends idToken + dob (if first time)
authRouter.get("/google/login", googleLoginRedirect);     // get redirect url
authRouter.get("/google/callback", googleCallback);       // callback handler (exchange code)

export default authRouter;
