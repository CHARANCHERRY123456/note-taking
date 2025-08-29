import  { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/auth-bg.jpg')" }}
      />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 dark:bg-gray-900">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
