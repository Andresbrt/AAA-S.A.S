"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle
} from "lucide-react";

import { login, verifyMfa } from "@/lib/api";

// Dynamically import subtle 3D background with SSR disabled
const Admin3DCanvas = dynamic(
  () => import("@/components/admin/Admin3DCanvas"),
  { ssr: false }
);

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [tempToken, setTempToken] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const data = await login(email, password);
      if (data.mfaRequired) {
        setTempToken(data.mfaToken);
        setStep(2);
      } else {
        const token = data.accessToken || data.token;
        if (token) {
          localStorage.setItem("admin_token", token);
          if (rememberMe) {
            localStorage.setItem("admin_remembered_email", email);
          } else {
            localStorage.removeItem("admin_remembered_email");
          }
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          window.location.href = "/admin";
        } else {
          throw new Error("No se recibió token de autenticación válido.");
        }
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || "Credenciales incorrectas. Verifica tu correo corporativo y contraseña."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = mfaCode.join("");
    if (code.length < 6) {
      setErrorMsg("Ingresa los 6 dígitos del código de seguridad.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const data = await verifyMfa(tempToken, code);
      const token = data.accessToken || data.token;
      if (token) {
        localStorage.setItem("admin_token", token);
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        window.location.href = "/admin";
      } else {
        throw new Error("Error validando el código de seguridad.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Código MFA inválido o expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal && value !== "") return;

    const newCode = [...mfaCode];
    newCode[index] = cleanVal.slice(-1);
    setMfaCode(newCode);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleMfaKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !mfaCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleMfaPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (pastedData.length >= 6) {
      const digits = pastedData.slice(0, 6).split("");
      setMfaCode(digits);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F9F8F6] text-gray-900 flex flex-col justify-between selection:bg-[var(--color-caribbean-blue)] selection:text-white font-sans overflow-x-hidden">
      
      {/* Subtle, Minimalist 3D Ocean Breeze Background */}
      <Admin3DCanvas />

      {/* Minimalist Top Header */}
      <header className="relative z-20 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="group flex items-center gap-3 text-gray-600 hover:text-[var(--color-caribbean-dark)] transition-colors"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/80 border border-gray-200/80 shadow-sm flex items-center justify-center group-hover:border-[var(--color-caribbean-blue)] transition-all duration-200">
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-caribbean-dark)] group-hover:-translate-x-0.5 transition-all" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400 group-hover:text-gray-600">
              Volver al sitio
            </span>
            <span className="text-sm font-light tracking-widest uppercase text-[var(--color-caribbean-dark)]">
              Grupo <span className="font-bold">AAA</span>
            </span>
          </div>
        </Link>

        {/* Minimalist Security Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-gray-200/70 text-xs font-medium text-gray-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Acceso Seguro · SSL 256-Bit</span>
        </div>
      </header>

      {/* Main Centered Minimalist Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Minimalist Glass Card */}
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-8 sm:p-10 shadow-[0_15px_45px_0_rgba(55,111,135,0.08)] ring-1 ring-gray-900/5">
            
            {/* Elegant Golden Accent Line */}
            <div className="w-12 h-1 bg-[var(--color-gold-accent)] rounded-full mx-auto mb-6" />

            {/* Header / Brand Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-[var(--color-caribbean-dark)] tracking-tight">
                Portal Asesores
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-normal leading-relaxed">
                Acceso exclusivo para el equipo comercial y administrativo de Corales del Viento
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {step === 1 ? (
              /* STEP 1: CREDENTIALS */
              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                    Correo Electrónico Corporativo
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-caribbean-dark)] transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="asesor@grupoaaa.com"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-caribbean-blue)] focus:ring-2 focus:ring-[var(--color-caribbean-blue)]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Contraseña de Acceso
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSupportModal(true)}
                      className="text-xs text-[var(--color-caribbean-dark)] hover:text-[var(--color-caribbean-blue)] font-medium transition-colors hover:underline"
                    >
                      ¿Olvidaste tu clave?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-caribbean-dark)] transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-caribbean-blue)] focus:ring-2 focus:ring-[var(--color-caribbean-blue)]/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[var(--color-caribbean-dark)] focus:ring-[var(--color-caribbean-blue)] cursor-pointer accent-[var(--color-caribbean-dark)]"
                    />
                    <span className="text-xs text-gray-600 font-medium">Recordar en este equipo</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowSupportModal(true)}
                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Mesa de Ayuda TI
                  </button>
                </div>

                {/* Primary Button matching Main Page (.btn-primary-glow) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-4 px-6 rounded-xl font-semibold text-sm text-white bg-[var(--color-caribbean-dark)] hover:bg-[#2b596d] shadow-[0_4px_20px_rgba(55,111,135,0.28)] hover:shadow-[0_8px_25px_rgba(55,111,135,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Validando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: 2-FACTOR AUTHENTICATION */
              <form onSubmit={handleMfaSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-caribbean-dark)]/10 text-[var(--color-caribbean-dark)] mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[var(--color-caribbean-dark)]">
                    Verificación de Seguridad
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Hemos enviado un código a tu dispositivo autenticador. Ingresa los 6 dígitos:
                  </p>
                </div>

                {/* 6 Clean Digit Inputs */}
                <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                  {mfaCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleMfaChange(index, e.target.value)}
                      onKeyDown={(e) => handleMfaKeyDown(index, e)}
                      onPaste={handleMfaPaste}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-caribbean-dark)] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-caribbean-dark)]/20 transition-all shadow-sm"
                    />
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || mfaCode.some((d) => d === "")}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-sm text-white bg-[var(--color-caribbean-dark)] hover:bg-[#2b596d] shadow-[0_4px_20px_rgba(55,111,135,0.28)] hover:shadow-[0_8px_25px_rgba(55,111,135,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verificando código...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Verificar y Acceder</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMsg("");
                    }}
                    className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Volver al formulario de inicio
                  </button>
                </div>
              </form>
            )}

            {/* Card Sub-footer */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-accent)]" />
                Grupo AAA Inmobiliaria
              </span>
              <span>Corales del Viento</span>
            </div>

          </div>

          {/* Helper Note */}
          <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
            ¿Problemas con tus credenciales? Escríbenos a{" "}
            <a 
              href="mailto:soporte@grupoaaa.com" 
              className="text-[var(--color-caribbean-dark)] font-semibold hover:underline"
            >
              soporte@grupoaaa.com
            </a>
          </p>

        </div>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-20 py-6 px-6 text-center text-xs text-gray-400 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-gray-200/60">
        <span>© {new Date().getFullYear()} Grupo Inmobiliario AAA S.A.S. Todos los derechos reservados.</span>
        <div className="flex gap-4">
          <Link href="/legal/terminos" className="hover:text-gray-600 transition-colors">Términos</Link>
          <Link href="/legal/politica-de-privacidad" className="hover:text-gray-600 transition-colors">Privacidad</Link>
        </div>
      </footer>

      {/* Minimalist Light Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-gray-100 p-6 shadow-2xl relative">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-caribbean-dark)]/10 text-[var(--color-caribbean-dark)] flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900">Soporte y Restablecimiento</h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Por políticas de seguridad corporativa, el restablecimiento de contraseñas y llaves de acceso MFA es gestionado por la Dirección de Tecnología.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs text-gray-700">
              <p><strong className="text-gray-900">Canal TI:</strong> soporte@grupoaaa.com</p>
              <p><strong className="text-gray-900">Atención:</strong> Lunes a Sábado 8:00am - 6:00pm</p>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="mt-5 w-full py-3 rounded-xl bg-[var(--color-caribbean-dark)] hover:bg-[#2b596d] text-white text-xs font-semibold transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
