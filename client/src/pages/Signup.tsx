import { useState } from "react";
import axiosClient from "../utils/api";
import OtpForm from "../components/otpForm";
import AuthLayout from "../components/AuthLayout";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Signup() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSendOtp = async () => {
    try {
      await axiosClient.post("/auth/signup/email", { name, dob, email });
      setStep("otp");
    } catch (err: any) {
      alert(err.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {step === "form" ? (
        <>
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full rounded-md mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 w-full rounded-md mb-3"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
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
        <OtpForm email={email} mode="signup" name={name} dob={dob} />
      )}
    </AuthLayout>
  );
}
