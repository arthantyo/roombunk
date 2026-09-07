import { useCallback, useMemo, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import { clearToken, getToken, setToken } from "../api/client";
import { AuthContext, type DecodedUser } from "./context";
import AuthModal from "./AuthModal";

function decodeToken(token: string): DecodedUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { email: payload.sub, userId: payload.userId };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedUser | null>(() => {
    const token = getToken();
    return token ? decodeToken(token) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login",
  );

  const openAuthModal = useCallback((mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await authApi.login(email, password);
    setToken(token);
    setUser(decodeToken(token));
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const { token } = await authApi.register(username, email, password);
      setToken(token);
      setUser(decodeToken(token));
    },
    [],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
    }),
    [
      user,
      login,
      register,
      logout,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={isAuthModalOpen}
        onClose={closeAuthModal}
        mode={authModalMode}
      />
    </AuthContext.Provider>
  );
}
