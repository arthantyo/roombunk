import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function Login() {
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("login");
  }, [openAuthModal]);

  return <Navigate to="/" replace />;
}
