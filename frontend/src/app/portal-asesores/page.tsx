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

// Dynamically import 3D canvas with SSR disabled to prevent any hydration mismatch
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

  // Auto-focus first input on step change
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
          // Set cookie for Next.js middleware protection
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
    // Only numbers
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
    <div className="relative min-h-screen w-full bg-[#040C12] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-[#376F87] selection:text-white font-sans">
      
      {/* 3D WebGL Background Layer */}
      <Admin3DCanvas />

      {/* Top Luxury Header Bar */}
      <header className="relative z-20 w-full px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:border-[#D4AF37]/50 group-hover:bg-[#376F87]/20 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-[#D4AF37] group-hover:-translate-x-0.5 transition-all" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs uppercase tracking-wider text-slate-400 group-hover:text-slate-200">Volver al sitio</span>
            <span className="text-xs font-semibold tracking-widest text-[#D4AF37]">GRUPO AAA S.A.S.</span>
          </div>
        </Link>

        {/* Security Badge Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-[11px] font-medium tracking-wider uppercase text-slate-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Conexión Segura 256-bit SSL
        </div>
      </header>

      {/* Main Centered Luxury Terminal */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Luxury Monogram Brand Emblem */}
          <div className="text-center mb-7">
            <div className="relative inline-flex items-center justify-center mb-4">
              {/* Radial ambient glow around emblem */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#376F87]/40 to-[#D4AF37]/20 rounded-3xl blur-xl opacity-70 animate-pulse pointer-events-none" />
              
              <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-b from-[#132A38] to-[#0A1822] border border-[#D4AF37]/40 p-0.5 shadow-2xl shadow-black/80 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-[#07131B]/90 flex flex-col items-center justify-center border border-white/5">
                  <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EFE6CF] to-[#D4AF37]">
                    AAA
                  </span>
                  <div className="w-4 h-[1.5px] bg-[#D4AF37] mt-0.5 rounded-full" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-wide">
              Portal <span className="font-serif italic font-semibold text-[#D4AF37]">Ejecutivo</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 tracking-wide font-light">
              Grupo Inmobiliario AAA S.A.S. · Corales del Viento
            </p>
          </div>

          {/* Frosted Glassmorphism Card */}
          <div className="relative rounded-3xl bg-[#06141D]/85 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5 p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
            
            {/* Top Gold Horizon Reflection Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/90 to-transparent" />

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {step === 1 ? (
              /* STEP 1: CREDENTIALS */
              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                    Correo Corporativo
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#D4AF37] transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="asesor@grupoaaa.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#051119]/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#376F87] focus:ring-2 focus:ring-[#376F87]/40 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                      Contraseña de Acceso
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSupportModal(true)}
                      className="text-[11px] text-[#D4AF37] hover:text-[#e4c45b] transition-colors hover:underline"
                    >
                      ¿Olvidaste tu clave?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#D4AF37] transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-[#051119]/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#376F87] focus:ring-2 focus:ring-[#376F87]/40 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
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
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#376F87] focus:ring-[#376F87] focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer accent-[#376F87]"
                    />
                    <span className="text-xs text-slate-300">Recordar este dispositivo</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowSupportModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Ayuda TI
                  </button>
                </div>

                {/* Primary Executive Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 relative overflow-hidden py-3.5 px-5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#376F87] via-[#2F6177] to-[#1C4253] hover:from-[#43839E] hover:to-[#27596F] border border-[#68A7C2]/30 shadow-[0_4px_25px_rgba(55,111,135,0.45)] hover:shadow-[0_6px_30px_rgba(55,111,135,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Validando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión Segura</span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: 2-FACTOR AUTHENTICATION */
              <form onSubmit={handleMfaSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#376F87]/20 border border-[#D4AF37]/40 text-[#D4AF37] mb-3 shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white tracking-wide">
                    Autenticación en 2 Pasos
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    Hemos emitido una clave de seguridad a tu dispositivo. Ingresa los 6 dígitos:
                  </p>
                </div>

                {/* 6 Digit Inputs */}
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
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#051119]/90 border border-white/15 focus:border-[#D4AF37] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
                    />
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || mfaCode.some((d) => d === "")}
                    className="w-full py-3.5 px-5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#376F87] to-[#1C4253] hover:from-[#43839E] hover:to-[#27596F] border border-[#68A7C2]/30 shadow-[0_4px_25px_rgba(55,111,135,0.45)] hover:shadow-[0_6px_30px_rgba(55,111,135,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verificando código...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                        <span>Verificar y Entrar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMsg("");
                    }}
                    className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Volver al formulario de inicio
                  </button>
                </div>
              </form>
            )}

            {/* Subtle Caribbean Watermark */}
            <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                Grupo AAA Portal v2.4
              </span>
              <span className="text-slate-500">Exclusivo Asesores VIP</span>
            </div>

          </div>

          {/* IT & Support Helper Pill */}
          <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
            ¿Problemas de acceso con tus credenciales corporativas?<br />
            Contacta a mesa de ayuda en{" "}
            <a 
              href="mailto:soporte@grupoaaa.com" 
              className="text-[#D4AF37] hover:underline"
            >
              soporte@grupoaaa.com
            </a>
          </p>

        </div>
      </main>

      {/* Footer Details */}
      <footer className="relative z-20 py-4 px-6 text-center text-[11px] text-slate-500 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-white/5">
        <span>© {new Date().getFullYear()} Grupo Inmobiliario AAA S.A.S. Todos los derechos reservados.</span>
        <div className="flex gap-4 text-slate-400">
          <Link href="/legal/terminos" className="hover:text-slate-200 transition-colors">Términos</Link>
          <Link href="/legal/politica-de-privacidad" className="hover:text-slate-200 transition-colors">Privacidad</Link>
        </div>
      </footer>

      {/* IT Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#091A25] border border-white/10 p-6 shadow-2xl relative">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Soporte Técnico & Accesos</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              El restablecimiento de contraseña o llaves MFA es gestionado directamente por la Dirección de Tecnología de Grupo AAA S.A.S. por políticas de seguridad bancaria.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-xs text-slate-300">
              <p><strong className="text-white">Email TI:</strong> soporte@grupoaaa.com</p>
              <p><strong className="text-white">Horario:</strong> Lunes a Sábado 8:00am - 6:00pm</p>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
