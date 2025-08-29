import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import { type ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getToken();
  return token ? children : <Navigate to="/signin" />;
}