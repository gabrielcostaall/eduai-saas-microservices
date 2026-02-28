"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const registerUrl = process.env.NEXT_PUBLIC_REGISTER_URL!;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

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
      login(data.token, data.user);
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Criar Conta
        </h2>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full border p-3 rounded text-black"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded text-black"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
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