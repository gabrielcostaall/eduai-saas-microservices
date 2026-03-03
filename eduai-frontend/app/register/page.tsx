"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

const registerUrl = process.env.NEXT_PUBLIC_REGISTER_URL!;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const res = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao registrar");
      return;
    }

    if (data.token) {
      const decoded: any = jwtDecode(data.token);
      const user = decoded.id;
      login(data.token, user);
      router.push("/chat");
    } else {
      router.push("/login");
    }
  };

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)" }}>
      <div className="bg-white/60 p-8 rounded-xl shadow w-96 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Registrar</h2>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 hover:cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Início
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <input
          className="w-full border p-3 rounded text-black"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border p-3 rounded text-black"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
                {showPassword ? "Ocultar" : "Mostrar"}
            </button>
        </div>
        <div className="space-y-1">
          <input
            type={showPassword ? "text" : "password"}
            className={`w-full border p-3 rounded text-black transition-colors ${
              passwordMismatch ? "border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400" : ""
            }`}
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleRegister();
              }
            }}
          />
          {passwordMismatch && (
            <p className="text-red-500 text-xs px-1">As senhas não coincidem.</p>
          )}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white p-3 rounded hover:cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={passwordMismatch}
        >
          Registrar
        </button>

        <p className="text-sm text-center text-gray-600">
          Já tem conta?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Fazer login
          </span>
        </p>
      </div>
    </div>
  );
}