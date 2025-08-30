import { useState } from "react";
import axiosClient from "../utils/api";
import OtpForm from "../components/otpForm";
import AuthLayout from "../components/AuthLayout";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import { validateEmail, validateName, validateDateOfBirth } from "../utils/validation";

export default function Signup() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const nameError = validateName(name);
    if (nameError) newErrors[nameError.field] = nameError.message;
    
    const emailError = validateEmail(email);
    if (emailError) newErrors[emailError.field] = emailError.message;
    
    const dobError = validateDateOfBirth(dob);
    if (dobError) newErrors[dobError.field] = dobError.message;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/auth/signup/email", { name, dob, email });
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
        <span className="text-gray-600 text-sm font-medium">Note Taker</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign up</h2>
      <p className="text-gray-500 text-sm mb-8">Sign up to access our features of HD</p>
      
      {step === "form" ? (
        <>
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Jonas Khairwald"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                }}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="date"
                placeholder="11 December 1997"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dob ? 'border-red-500' : 'border-gray-200'}`}
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (errors.dob) setErrors(prev => ({ ...prev, dob: "" }));
                }}
              />
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
            </div>

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

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <LoadingSpinner size="small" color="white" />}
              {loading ? "Sending..." : "Get OTP"}
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
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:text-blue-600 font-medium">
              Sign in
            </a>
          </p>
        </>
      ) : (
        <OtpForm email={email} mode="signup" name={name} dob={dob} />
      )}
    </AuthLayout>
  );
}
