"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL!;
const recruiterUsername = process.env.NEXT_PUBLIC_RECRUITER_USERNAME!;
const recruiterPassword = process.env.NEXT_PUBLIC_RECRUITER_PASSWORD!;

export default function LandingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleRecruiterLogin = async () => {
    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: recruiterUsername, password: recruiterPassword }),
      });
      if (!res.ok) throw new Error("Erro ao logar como recrutador");

      const data = await res.json();
      const decoded: any = jwtDecode(data.token);
      const user = decoded.id;

      login(data.token, user);
      router.push("/recruiter-chat");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600 opacity-[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500 opacity-[0.05] blur-[80px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-8">

        {/* Badge */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-white/50 tracking-widest uppercase font-medium">Assistente de Aprendizado</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1
            className="text-6xl sm:text-7xl font-bold tracking-tight text-white leading-none"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
          >
            Bem-vindo ao
          </h1>
          <h1
            className="text-6xl sm:text-7xl font-bold tracking-tight leading-none"
            style={{
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EduAI
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white/40 text-lg max-w-md leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
          O seu assistente inteligente para aprender, criar e evoluir.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 hover: cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover: cursor-pointer"
          >
            Registre-se
          </button>
        </div>
      </div>
      {/* Recruiter footer */}
      <div className="absolute bottom-[19%] z-10 flex items-center gap-2">
        <span className="text-white/25 text-base" style={{ fontFamily: "'Georgia', serif" }}>
          É um(a) recrutador(a)?
        </span>
        <button
          onClick={handleRecruiterLogin}
          className="text-sm text-blue-400/70 hover:text-blue-400 underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-400 transition-all duration-200 hover:cursor-pointer"
        >
          Clique aqui
        </button>
      </div>

      {/* About */}
      <div className="absolute bottom-0 z-10 flex items-center gap-2 max-w-screen-xl px-6">
        <span className="text-white/25 text-sm text-center" style={{ fontFamily: "'Georgia', serif" }}>
          O EduAI é uma demonstração de um sistema de microserviços com inteligência artificial, e foi desenvolvido para mostrar as possibilidades de integração entre IA e arquitetura de software moderna. Seu objetivo é explicar conceitos da forma mais simplificada possível.
        </span>
      </div>
    </main>
  );
}