import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../utils/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      // Store token and redirect to dashboard
      setToken(token);
      navigate("/dashboard", { replace: true });
    } else if (error) {
      // Handle error
      alert("Google authentication failed. Please try again.");
      navigate("/signin", { replace: true });
    } else {
      // No token or error, redirect to signin
      navigate("/signin", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Google sign-in...</p>
      </div>
    </div>
  );
}
