import { createContext } from "react";

export interface DecodedUser {
  email: string;
  userId: number;
}

export interface AuthContextValue {
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

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
