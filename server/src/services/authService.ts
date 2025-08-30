import { User, IUser } from "../models/User";
import {storeOTP , getOTP , deleteOTP} from '../utils/otpRedis'
import { sendOtpEmail } from "../utils/mailer";
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { ValidationError, NotFoundError, UnauthorizedError, ConflictError } from "../utils/errors";

const OTP_TTL_SECONDS = 300; // 5 minutes
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
  console.warn("Google OAuth env variables not fully set. Google redirect flow may not work.");
}

const oauth2Client = new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);

function makeOtp(): string {
  const otp =  Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp);
  return otp;
}

export async function sendOtpService(name: string, dob: string, email: string) {
  if (!email || !name || !dob) throw new ValidationError("Name, date of birth, and email are required");

  const otp = makeOtp();
  await storeOTP(email, otp, OTP_TTL_SECONDS);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    throw new Error("Unable to send OTP email. Please try again later.");
  }
  return { message: "OTP sent to your email successfully", email };
}

export async function verifyOtpService(email: string, otp: string, name?: string, dob?: string) {
  if (!email || !otp) throw new ValidationError("Email and OTP are required");

  const stored = await getOTP(email);
  if (!stored) throw new ValidationError("OTP has expired or is invalid. Please request a new OTP.");
  if (stored !== otp) throw new ValidationError("Incorrect OTP. Please check and try again.");

  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    if (!name || !dob) throw new ValidationError("Name and date of birth are required to create your account");
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
  if (!email) throw new ValidationError("Email is required");
  const otp = makeOtp();
  await storeOTP(email, otp, OTP_TTL_SECONDS);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to resend OTP:", err);
    throw new Error("Unable to send OTP email. Please try again later.");
  }

  return { message: "OTP sent to your email successfully" };
}

export async function loginEmailService(email: string) {
  if (!email) throw new ValidationError("Email is required");
  
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new NotFoundError("Account not found. Please sign up first to create an account.");
  if (user.authType !== "email") throw new ConflictError("This account was created with Google. Please use 'Continue with Google' to sign in.");

  const otp = makeOtp();
  await storeOTP(email, otp, OTP_TTL_SECONDS);
  
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to send OTP for login:", err);
    throw new Error("Unable to send OTP email. Please try again later.");
  }
  return { message: "OTP sent to your email successfully" };
}

export async function googleTokenLoginService(idToken: string) {
  if (!idToken) throw new ValidationError("Google ID token is required");

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if(!payload) throw new ValidationError("Invalid Google authentication token");
  if (!payload.email || !payload.name) throw new ValidationError("Unable to get your Google account information. Please try again.");

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email,
      authType: "google",
      // DOB is optional for Google users
      dob: undefined,
    } as Partial<IUser>);
  } else if (user.authType !== "google") {
    throw new ConflictError("This email is already registered with email/OTP. Please sign in using email instead.");
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
      // DOB is optional for Google users - set to null or a default
      dob: undefined,
    } as Partial<IUser>);
  } else if (user.authType !== "google") {
    throw new Error("Email already registered via email OTP. Use email login.");
  }

  const token = generateToken({ id: user.id.toString(), email: user.email });
  return { token, user, tokens };
}
