import { useState } from "react";
import axiosClient from "../utils/api";
import OtpForm from "../components/otpForm";
import AuthLayout from "../components/AuthLayout";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Signin() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");

  const handleSendOtp = async () => {
    try {
      await axiosClient.post("/auth/login/email", { email });
      setStep("otp");
    } catch (err: any) {
      alert(err.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      {step === "form" ? (
        <>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full rounded-md mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Send OTP
          </button>
          <div className="mt-4">
            <GoogleLoginButton />
          </div>
        </>
      ) : (
        <OtpForm email={email} mode="signin" />
      )}
    </AuthLayout>
  );
}
