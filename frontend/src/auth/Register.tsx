import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function Register() {
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("register");
  }, [openAuthModal]);

  return <Navigate to="/" replace />;
}
