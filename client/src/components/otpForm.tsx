import { useState } from "react";
import axiosClient from "../utils/api";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

interface OtpFormProps {
  email: string;
  mode: "signup" | "signin";
  name?: string;
  dob?: string;
}

export default function OtpForm({ email, mode, name, dob }: OtpFormProps) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const payload = { email, otp };
      
      // Add name and dob for signup mode
      if (mode === "signup" && name && dob) {
        Object.assign(payload, { name, dob });
      }
      
      const res = await axiosClient.post("/auth/verify-otp", payload);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 w-full rounded-md mb-3"
      />
      <button
        onClick={handleVerify}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Verify OTP
      </button>
    </div>
  );
}
