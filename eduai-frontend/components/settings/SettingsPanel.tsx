"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const authBaseUrl = process.env.NEXT_PUBLIC_AUTH_URL!;

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { user, token, refreshUser } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<"main" | "changePassword" | "setup2fa" | "disable2fa">("main");

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 2FA state — lido diretamente de user.totp_enabled (sempre atualizado via /me)
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpMsg, setTotpMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [totpLoading, setTotpLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword)
      return setPasswordMsg({ type: "error", text: "Preencha todos os campos." });
    if (newPassword !== confirmPassword)
      return setPasswordMsg({ type: "error", text: "As senhas não coincidem." });

    setPasswordLoading(true);
    setPasswordMsg(null);

    try {
      const res = await fetch(`${authBaseUrl}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao alterar senha.");
      setPasswordMsg({ type: "success", text: "Senha alterada com sucesso!" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    setTotpLoading(true);
    setTotpMsg(null);
    try {
      const res = await fetch(`${authBaseUrl}/2fa/setup`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao configurar 2FA.");
      setQrCode(data.qrCode);
      setView("setup2fa");
    } catch (err: any) {
      setTotpMsg({ type: "error", text: err.message });
    } finally {
      setTotpLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setTotpLoading(true);
    setTotpMsg(null);
    try {
      const res = await fetch(`${authBaseUrl}/2fa/enable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Código inválido.");
      await refreshUser(); // atualiza user.totp_enabled no contexto
      setTotpMsg({ type: "success", text: "2FA ativado com sucesso!" });
      setTotpCode("");
      setTimeout(() => { setView("main"); setTotpMsg(null); }, 1500);
    } catch (err: any) {
      setTotpMsg({ type: "error", text: err.message });
    } finally {
      setTotpLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setTotpLoading(true);
    setTotpMsg(null);
    try {
      const res = await fetch(`${authBaseUrl}/2fa/disable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Código inválido.");
      await refreshUser(); // atualiza user.totp_enabled no contexto
      setTotpMsg({ type: "success", text: "2FA desativado com sucesso!" });
      setTotpCode("");
      setTimeout(() => { setView("main"); setTotpMsg(null); }, 1500);
    } catch (err: any) {
      setTotpMsg({ type: "error", text: err.message });
    } finally {
      setTotpLoading(false);
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-4 top-16 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Main view */}
      {view === "main" && (
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-800 text-base">{user?.username}</p>
          </div>

          <hr className="border-gray-100 mb-4" />

          <div className="space-y-2">
            <button
              onClick={() => { setView("changePassword"); setPasswordMsg(null); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Alterar senha
              </div>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">Autenticação de dois fatores</p>
                  <p className={`text-xs font-medium ${user?.totp_enabled ? "text-green-500" : "text-gray-400"}`}>
                    {user?.totp_enabled ? "Ativado" : "Desativado"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTotpMsg(null);
                  setTotpCode("");
                  if (user?.totp_enabled) setView("disable2fa");
                  else handleSetup2FA();
                }}
                disabled={totpLoading}
                className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${
                  user?.totp_enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  user?.totp_enabled ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

            {totpMsg && view === "main" && (
              <p className={`text-xs px-4 ${totpMsg.type === "error" ? "text-red-500" : "text-green-500"}`}>
                {totpMsg.text}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Change Password view */}
      {view === "changePassword" && (
        <div className="p-6">
          <button onClick={() => setView("main")} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h3 className="font-semibold text-gray-800 mb-4">Alterar senha</h3>
          <div className="space-y-3">
            <input type="password" placeholder="Senha atual" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400" />
            <input type="password" placeholder="Nova senha" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400" />
            <input type="password" placeholder="Confirmar nova senha" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400" />
            {passwordMsg && (
              <p className={`text-xs ${passwordMsg.type === "error" ? "text-red-500" : "text-green-500"}`}>{passwordMsg.text}</p>
            )}
            <button onClick={handleChangePassword} disabled={passwordLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {passwordLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}

      {/* Setup 2FA view */}
      {view === "setup2fa" && (
        <div className="p-6">
          <button onClick={() => setView("main")} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h3 className="font-semibold text-gray-800 mb-2">Ativar 2FA</h3>
          <p className="text-xs text-gray-500 mb-4">Escaneie o QR code com o Google Authenticator e insira o código gerado para confirmar.</p>
          {qrCode && (
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="QR Code 2FA" className="w-40 h-40 rounded-xl border border-gray-100" />
            </div>
          )}
          <input type="text" placeholder="Código de 6 dígitos" value={totpCode} maxLength={6}
            onChange={(e) => setTotpCode(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 mb-3" />
          {totpMsg && <p className={`text-xs mb-3 ${totpMsg.type === "error" ? "text-red-500" : "text-green-500"}`}>{totpMsg.text}</p>}
          <button onClick={handleEnable2FA} disabled={totpLoading || totpCode.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {totpLoading ? "Verificando..." : "Confirmar e ativar"}
          </button>
        </div>
      )}

      {/* Disable 2FA view */}
      {view === "disable2fa" && (
        <div className="p-6">
          <button onClick={() => setView("main")} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h3 className="font-semibold text-gray-800 mb-2">Desativar 2FA</h3>
          <p className="text-xs text-gray-500 mb-4">Insira o código do seu autenticador para confirmar a desativação.</p>
          <input type="text" placeholder="Código de 6 dígitos" value={totpCode} maxLength={6}
            onChange={(e) => setTotpCode(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 mb-3" />
          {totpMsg && <p className={`text-xs mb-3 ${totpMsg.type === "error" ? "text-red-500" : "text-green-500"}`}>{totpMsg.text}</p>}
          <button onClick={handleDisable2FA} disabled={totpLoading || totpCode.length !== 6}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {totpLoading ? "Verificando..." : "Confirmar e desativar"}
          </button>
        </div>
      )}
    </div>
  );
}