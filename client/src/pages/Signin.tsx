import React from "react";
import AuthLayout from "../components/AuthLayout";

const Signin: React.FC = () => {
  return (
    <AuthLayout title="Sign In">
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          placeholder="OTP"
          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          type="button"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
        >
          Login with Google
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signin;
