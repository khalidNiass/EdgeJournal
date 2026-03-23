import { useState, useEffect, ReactNode } from "react";

type User = { username: string };

const USER_KEY = "edgejournal_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Simulate login
  const login = (username: string, password: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser = { username };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setIsLoading(false);
    }, 500); // Simulate async
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  useEffect(() => {
    // Listen for changes in localStorage (multi-tab support)
    const handler = () => {
      const stored = localStorage.getItem(USER_KEY);
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { user, isLoading, login, logout };
}
