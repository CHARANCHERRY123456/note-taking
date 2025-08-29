export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      const backendGoogleUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
      window.location.href = backendGoogleUrl;
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
    >
      Continue with Google
    </button>
  );
}
