import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import { type JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = getToken();
  return token ? children : <Navigate to="/signin" />;
}