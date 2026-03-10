"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

const authBaseUrl = process.env.NEXT_PUBLIC_AUTH_URL!;

export default function Verify2FAPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!userId) router.push("/login");
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // só números

    const newCode = [...code];
    newCode[index] = value.slice(-1); // apenas 1 dígito por campo
    setCode(newCode);

    // Avança para o próximo campo automaticamente
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Digite os 6 dígitos do código.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${authBaseUrl}/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Código inválido.");
        setCode(Array(6).fill(""));
        inputsRef.current[0]?.focus();
        return;
      }

      const decoded: any = jwtDecode(data.token);
      login(data.token, decoded.id);
      router.push("/chat");

    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)" }}>
      <div className="bg-white/60 p-8 rounded-xl shadow w-96 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Verificação 2FA</h2>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
        </div>

        {/* Description */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">
            Insira o código de 6 dígitos do seu aplicativo autenticador.
          </p>
        </div>

        {/* Code inputs */}
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-11 h-12 text-center text-lg font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-colors ${
                digit ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
              }`}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleVerify}
          disabled={loading || code.join("").length !== 6}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );
}