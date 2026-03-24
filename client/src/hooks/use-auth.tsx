import { useState, useEffect, ReactNode } from "react";

type User = { username: string; isPro?: boolean; createdAt?: string };

const USER_KEY = "edgejournal_user";
const SESSION_USER_KEY = "edgejournal_user_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY) || sessionStorage.getItem(SESSION_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isRegisterPending, setIsRegisterPending] = useState(false);
  const [isLogoutPending, setIsLogoutPending] = useState(false);

  // Simulate login
  const login = (username: string, password: string, remember = true) => {
    setIsLoading(true);
    setIsLoginPending(true);
    setTimeout(() => {
      const newUser = { username, isPro: false, createdAt: new Date().toISOString() };
      if (remember) {
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        sessionStorage.removeItem(SESSION_USER_KEY);
      } else {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUser));
        localStorage.removeItem(USER_KEY);
      }
      setUser(newUser);
      setIsLoading(false);
      setIsLoginPending(false);
    }, 500); // Simulate async
  };

  // Simulate registration
  const register = (username: string, password: string) => {
    setIsLoading(true);
    setIsRegisterPending(true);
    setTimeout(() => {
      const newUser = { username, isPro: false, createdAt: new Date().toISOString() };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      sessionStorage.removeItem(SESSION_USER_KEY);
      setUser(newUser);
      setIsLoading(false);
      setIsRegisterPending(false);
    }, 700); // Simulate async
  };

  // Logout
  const logout = () => {
    setIsLogoutPending(true);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    setUser(null);
    setIsLogoutPending(false);
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

  return {
    user,
    isLoading,
    isLoginPending,
    isRegisterPending,
    isLogoutPending,
    login,
    register,
    logout,
    logoutMutation: {
      isPending: isLogoutPending,
      mutate: () => logout(),
    },
  };
}
