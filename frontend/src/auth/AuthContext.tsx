import { useCallback, useMemo, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import { clearToken, getToken, setToken } from "../api/client";
import { AuthContext, type DecodedUser } from "./context";

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
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
