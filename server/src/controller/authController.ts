import { Request, Response, NextFunction } from "express";
import {
    sendOtpService,
    verifyOtpService,
    resendOtpService,
    loginEmailService,
    googleTokenLoginService,
    getGoogleAuthUrl,
    handleGoogleCallback,
} from "../services/authService";

/**
 * POST /api/auth/signup/email
 * Body: { name, dob, email }
 */
export async function signupWithEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, dob, email } = req.body;
        const result = await sendOtpService(name, dob, email);
        return res.json(result);
    } catch (err) {
        console.error("signupWithEmail error:", err);
        next(err);
    }
}

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp, name, dob } 
 * name/dob required if new user creation
 */
export async function verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, otp, name, dob } = req.body;
        const result = await verifyOtpService(email, otp, name, dob);
        return res.json(result);
    } catch (err) {
        console.error("verifyOTP error:", err);
        next(err);
    }
}

/**
 * POST /api/auth/resend-otp
 * Body: { email }
 */
export async function resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        const result = await resendOtpService(email);
        return res.json(result);
    } catch (err) {
        console.error("resendOTP error:", err);
        next(err);
    }
}

/**
 * POST /api/auth/login/email
 * Body: { email }
 */
export async function loginWithEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        const result = await loginEmailService(email);
        return res.json(result);
    } catch (err) {
        console.error("loginWithEmail error:", err);
        next(err);
    }
}

/**
 * POST /api/auth/google/token-login
 * Body: { idToken, dob? }
 * If first time using google, frontend must also send dob
 */
export async function googleTokenLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { idToken, dob } = req.body;
        const result = await googleTokenLoginService(idToken);
        return res.json(result);
    } catch (err) {
        console.error("googleTokenLogin error:", err);
        next(err);
    }
}

/**
 * GET /api/auth/google/login
 * Returns redirect URL for frontend to redirect user
 */
export async function googleLoginRedirect(req: Request, res: Response, next: NextFunction) {
    try {
        const url = getGoogleAuthUrl();
        return res.json({ url });
    } catch (err) {
        console.error("googleLoginRedirect error:", err);
        next(err);
    }
}

/**
 * GET /api/auth/google/callback
 * Query: code, optional dob param if first time (could be posted from client)
 * We'll accept dob as query param for simplicity, but for production you'd
 * capture dob from a UI step after callback.
 */
export async function googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const code = req.query.code as string;
        const result = await handleGoogleCallback(code);
        // Send token in response. In traditional redirect flow you might
        // redirect to frontend with the token in query/hash.
        return res.json(result);
    } catch (err) {
        console.error("googleCallback error:", err);
        next(err);
    }
}
