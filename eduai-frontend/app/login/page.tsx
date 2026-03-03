"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL!;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    setError("");

    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      setError("Credenciais inválidas");
      return;
    }

    const data = await res.json();

    if (!data.token) {
      setError("Credenciais inválidas");
      return;
    }

    const decoded: any = jwtDecode(data.token);
    const user = decoded.id;

    login(data.token, user);
    router.push("/chat");

  } catch (err) {
    console.error(err);
    setError("Erro ao conectar com o servidor");
  }
};

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)" }}>
      <div className="bg-white/60 p-8 rounded-xl shadow w-96 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Login</h2>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-gray-800 hover:cursor-pointer transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Início
          </button>
        </div>

        <input
          className="w-full border p-2 rounded placeholder-gray-400 text-gray-600"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative">
            <input
            type={showPassword ? "text" : "password"}
            className="w-full border p-2 rounded pr-12 placeholder-gray-400 text-gray-600"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleLogin();
            }
          }}
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
                {showPassword ? "Ocultar" : "Mostrar"}
            </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Entrar
        </button>
        {error && (
          <p className="text-red-500 text-sm text-center">
          {error}
          </p>
        )}
        <p className="text-sm text-center text-gray-600 mt-4">
            Não tem conta?{" "}
                <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push("/register")}
                >
                    Registre-se aqui
                </span>
        </p>
      </div>
    </div>
  );
}