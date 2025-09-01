import { useState } from "react";
import axiosClient from "../utils/api";
import OtpForm from "../components/otpForm";
import AuthLayout from "../components/AuthLayout";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import { validateEmail } from "../utils/validation";

import { useEffect } from "react";
// ...existing code...

export default function Signin() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    showToast("Please wait 40 seconds for the server to start rendering.", "info");
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors[emailError.field] = emailError.message;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) {
      showToast("Please enter a valid email", "error");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/auth/login/email", { email });
      setStep("otp");
      showToast("OTP sent to your email!", "success");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Error sending OTP";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* HD Logo/Brand */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-sm">HD</span>
        </div>
        <span className="text-gray-600 text-sm font-medium">Note Taker(wait 40secs for render) </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
      <p className="text-gray-500 text-sm mb-8">Please login to your account</p>
      
      {step === "form" ? (
        <>
          <div className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="jonas.khairwald@gmail.com"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="OTP"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Keep me logged in
                </label>
              </div>
              <div className="text-sm">
                <button 
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request OTP
                </button>
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <LoadingSpinner size="small" color="white" />}
              {loading ? "Sending..." : "Sign in"}
            </button>
          </div>

          {/* Google Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            <div className="mt-4">
              <GoogleLoginButton />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Need an account?{" "}
            <a href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
              Create one
            </a>
          </p>
        </>
      ) : (
        <OtpForm email={email} mode="signin" />
      )}
    </AuthLayout>
  );
}
