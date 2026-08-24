import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../api/auth";
import { clearToken, getToken, setToken } from "../api/client";

interface DecodedUser {
  email: string;
  userId: number;
}

interface AuthContextValue {
  user: DecodedUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
