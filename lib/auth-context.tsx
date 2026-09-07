"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type PublicUser = Omit<User, "password">;

type AuthContextValue = {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  login: (
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const AUTHENTICATED_KEY = "isAuthenticated";

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): User[] {
  if (typeof window === "undefined") return [];

  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function toPublicUser(user: User): PublicUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY) || "null",
      ) as PublicUser | null;
      const isAuthenticated =
        localStorage.getItem(AUTHENTICATED_KEY) === "true";
      setUser(isAuthenticated && storedUser ? storedUser : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();

    if (
      users.some(
        (storedUser) => storedUser.email.toLowerCase() === normalizedEmail,
      )
    ) {
      return {
        ok: false as const,
        error: "An account with this email already exists.",
      };
    }

    const newUser: User = {
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };
    const publicUser = toPublicUser(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
    localStorage.setItem(AUTHENTICATED_KEY, "true");
    setUser(publicUser);
    return { ok: true as const };
  };

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchingUser = readUsers().find(
      (storedUser) =>
        storedUser.email.toLowerCase() === normalizedEmail &&
        storedUser.password === password,
    );

    if (!matchingUser)
      return { ok: false as const, error: "Invalid email or password." };

    const publicUser = toPublicUser(matchingUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
    localStorage.setItem(AUTHENTICATED_KEY, "true");
    setUser(publicUser);
    return { ok: true as const };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTHENTICATED_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signup,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
