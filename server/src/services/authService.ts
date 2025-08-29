import { User, IUser } from "../models/User";
import {storeOTP , getOTP , deleteOTP} from '../utils/otpRedis'
import { sendOtpEmail } from "../utils/mailer";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";

const OTP_TTL_SECONDS = 300; // 5 minutes
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
  console.warn("Google OAuth env variables not fully set. Google redirect flow may not work.");
}

const oauth2Client = new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);

function makeOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpService(name: string, dob: string, email: string) {
  if (!email || !name || !dob) throw new Error("name, dob and email are required");

  const otp = makeOtp();
  await storeOTP(email, otp, OTP_TTL_SECONDS);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    throw new Error("Failed to send OTP email. Check email configuration.");
  }
  return { message: "OTP sent to email", email };
}

export async function verifyOtpService(email: string, otp: string, name?: string, dob?: string) {
  if (!email || !otp) throw new Error("email and otp required");

  const stored = await getOTP(email);
  if (!stored) throw new Error("OTP expired or not found");
  if (stored !== otp) throw new Error("Invalid OTP");

  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    if (!name || !dob) throw new Error("name and dob are required to create new user");
    user = await User.create({
      name,
      dob: new Date(dob),
      email: email.toLowerCase(),
      authType: "email",
    } as Partial<IUser>);
  } else if (user.authType !== "email") {
    throw new Error("This email is registered via Google. Please login with Google.");
  }


  const token = generateToken({ id: user.id.toString(), email: user.email });
  await deleteOTP(email);
  return { token, user };
}

export async function resendOtpService(email: string) {
  if (!email) throw new Error("email required");
  const otp = makeOtp();
  await storeOTP(email, otp, OTP_TTL_SECONDS);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to resend OTP:", err);
    throw new Error("Failed to send OTP email. Check email configuration.");
  }

  return { message: "OTP resent to email" };
}

export async function loginEmailService(email: string) {
  if (!email) throw new Error("email required");
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("No account found with this email");
  if (user.authType !== "email") throw new Error("Please login using Google");

  const otp = makeOtp();
  await storeOTP(email, otp, OTP_TTL_SECONDS);
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to send OTP for login:", err);
    throw new Error("Failed to send OTP email. Check email configuration.");
  }
  return { message: "OTP sent to email for login" };
}

export async function googleTokenLoginService(idToken: string) {
  if (!idToken) throw new Error("idToken required");

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if(!payload) throw new Error("Invalid Google token payload");
  if (!payload.email || !payload.name) throw new Error("Google token payload incomplete");

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email,
      authType: "google",
    } as Partial<IUser>);
  } else if (user.authType !== "google") {
    throw new Error("Email already registered via email OTP. Use email login.");
  }

  const token = generateToken({ id: user.id.toString(), email: user.email });
  return { token, user };
}

export function getGoogleAuthUrl() {
  const scopes = ["openid", "email", "profile"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  return url;
}

export async function handleGoogleCallback(code: string) {
  if (!code) throw new Error("code required");
  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens || !tokens.id_token) throw new Error("No id_token returned from Google");

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.name) throw new Error("Google profile incomplete not getting name or email from google");

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: payload.name,
      email,
      authType: "google",
    } as Partial<IUser>);
  } else if (user.authType !== "google") {
    throw new Error("Email already registered via email OTP. Use email login.");
  }

  const token = generateToken({ id: user.id.toString(), email: user.email });
  return { token, user, tokens };
}
