"use client";
import { get } from "http";
import { createContext, useState, useEffect, useContext } from "react";

const authMeUrl = process.env.NEXT_PUBLIC_AUTH_URL!;

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string, userId: any, remember: boolean) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: any) {
  const getStoredToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(getStoredToken());

  const fetchMe = async (currentToken: string) => {
    const res = await fetch(`${authMeUrl}/me`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json(); // { id, username, totp_enabled }
  };

  // Ao iniciar, se já há token salvo, busca os dados atualizados do usuário
  useEffect(() => {
    const storedToken = getStoredToken();
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    console.log("useEffect - storedToken:", storedToken);
    if (storedToken) {
      setToken(storedToken);
      fetchMe(storedToken)
        .then((userData) => {
          console.log("useEffect - fetchMe ok:", userData);
          setUser(userData);
          storage.setItem("user", JSON.stringify(userData));
        })
        .catch((err) => {
          // Token inválido ou expirado — limpa tudo
          console.log("useEffect - fetchMe falhou:", err);

          localStorage.clear();
          sessionStorage.clear();
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  const login = async (token: string, _userId: any, remember: boolean = false) => {
  const storage = remember ? localStorage : sessionStorage;
  
  storage.setItem("token", token);
  setToken(token);

  const userData = await fetchMe(token);
  
  storage.setItem("user", JSON.stringify(userData));
  setUser(userData);
  
};

  // Permite atualizar os dados do usuário sem fazer logout (ex: após ativar/desativar 2FA)
  const refreshUser = async () => {
    if (!token) return;
    const userData = await fetchMe(token);
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;