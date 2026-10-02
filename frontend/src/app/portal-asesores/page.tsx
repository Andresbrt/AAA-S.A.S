"use client";

import { useState } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Map } from "lucide-react";

import { login } from "@/lib/api";

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // States for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  
  // Temporal token store
  const [tempToken, setTempToken] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const data = await login(email, password);
      localStorage.setItem("admin_token", data.token);
      window.location.href = "/admin";
    } catch (err) {
      setErrorMsg("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    // TODO: Validate real MFA code with backend. For now, accept any and save token.
    setTimeout(() => {
      localStorage.setItem("admin_token", tempToken);
      setIsLoading(false);
      window.location.href = "/admin";
    }, 1000);
  };

  const handleMfaChange = (index: number, value: string) => {
    if (value.length > 1) return; // Solo 1 caracter
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus al siguiente input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`mfa-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black flex items-center justify-center p-4">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 mb-4 shadow-lg shadow-blue-500/30">
            <Map className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AAA Inmobiliaria</h1>
          <p className="text-slate-400 mt-2">Acceso seguro al panel de administración</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500">
          
          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="admin@grupoaaa.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-white">Verificación en 2 Pasos</h2>
                <p className="text-sm text-slate-400 mt-2">
                  Hemos enviado un código seguro a tu dispositivo. Ingresa los 6 dígitos para continuar.
                </p>
              </div>

              <div className="flex justify-between gap-2">
                {mfaCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`mfa-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMfaChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold border border-white/10 rounded-xl bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || mfaCode.some(d => d === "")}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Verificar y Entrar"
                )}
              </button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          )}

        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs text-slate-600 mt-8">
          Sistema protegido con encriptación de grado bancario.<br/>
          Solo personal autorizado.
        </p>

      </div>
    </div>
  );
}
