import React from "react";
import AuthLayout from "../components/AuthLayout";

const Signup: React.FC = () => {
  return (
    <AuthLayout title="Sign Up">
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="date"
          placeholder="Date of Birth"
          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Send OTP
        </button>
        <button
          type="button"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
        >
          Sign up with Google
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
