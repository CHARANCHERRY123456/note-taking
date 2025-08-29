import { useState } from "react";
import axiosClient from "../utils/api";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useToast } from "../context/ToastContext";

interface OtpFormProps {
  email: string;
  mode: "signup" | "signin";
  name?: string;
  dob?: string;
}

export default function OtpForm({ email, mode, name, dob }: OtpFormProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!otp.trim()) {
      showToast("Please enter the OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = { email, otp };
      
      // Add name and dob for signup mode
      if (mode === "signup" && name && dob) {
        Object.assign(payload, { name, dob });
      }
      
      const res = await axiosClient.post("/auth/verify-otp", payload);
      setToken(res.data.token);
      showToast("Successfully logged in!", "success");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "OTP verification failed";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Enter OTP</h3>
      <p className="text-gray-500 text-sm mb-6">
        We've sent a verification code to {email}
      </p>
      
      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
        >
          {loading && <LoadingSpinner size="small" color="white" />}
          {loading ? "Verifying..." : "Sign up"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Didn't receive the code?{" "}
        <button className="text-blue-500 hover:text-blue-600 font-medium">
          Resend
        </button>
      </p>
    </div>
  );
}
