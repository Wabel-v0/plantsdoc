"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  auth,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  signInWithGoogle,
  logOut,
  subscribeToAuthChanges,
} from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: string | null }>;
  signup: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: string | null }>;
  googleSignIn: () => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<{ success: boolean; error: string | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ user: null, error: "Not implemented" }),
  signup: async () => ({ user: null, error: "Not implemented" }),
  googleSignIn: async () => ({ user: null, error: "Not implemented" }),
  logout: async () => ({ success: false, error: "Not implemented" }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return await loginWithEmailAndPassword(email, password);
  };

  const signup = async (email: string, password: string) => {
    return await registerWithEmailAndPassword(email, password);
  };

  const googleSignIn = async () => {
    return await signInWithGoogle();
  };

  const logout = async () => {
    return await logOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, googleSignIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
