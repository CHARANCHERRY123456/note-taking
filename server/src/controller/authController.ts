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
import { User } from "../models/User";

/**
 * GET /api/auth/me
 * Get current user information
 */
export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId; // Set by auth middleware
        const user = await User.findById(userId).select('-__v');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            authType: user.authType
        });
    } catch (err) {
        console.error("getCurrentUser error:", err);
        next(err);
    }
}

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
        
        // Redirect to frontend with token
        const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const redirectUrl = `${frontendUrl}/auth/callback?token=${result.token}`;
        
        return res.redirect(redirectUrl);
    } catch (err) {
        console.error("googleCallback error:", err);
        const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const errorUrl = `${frontendUrl}/signin?error=google_auth_failed`;
        return res.redirect(errorUrl);
    }
}
