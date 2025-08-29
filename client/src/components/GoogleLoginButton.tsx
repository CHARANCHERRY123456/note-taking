export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
      const response = await fetch(`${apiUrl}/auth/google/login`);
      
      if (!response.ok) {
        throw new Error('Failed to get Google auth URL');
      }
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No Google auth URL received');
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Failed to initiate Google login. Please try again.");
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
