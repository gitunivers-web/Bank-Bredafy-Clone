import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "client" | "admin";

interface User {
  name: string;
  email: string;
  clientNumber: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string): boolean => {
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase() === "admin@vanbreda.be";
    setUser({
      name: isAdmin ? "Sophie Laurent" : "Alexandre Dubois",
      email: email,
      clientNumber: isAdmin ? "ADMIN-001" : "VB-2024-4892",
      role: isAdmin ? "admin" : "client",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.role === "admin", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
