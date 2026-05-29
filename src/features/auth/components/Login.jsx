import React, { useState } from 'react';
import { User, Lock, Fingerprint, Sparkles, LogIn, AlertCircle, Eye, EyeOff, ShieldCheck, Activity } from 'lucide-react';
import { request } from '../../../core/services/apiClient';

/**
 * Componente de Login Premium Split-Screen para el Panel de Asistencia.
 * Diseño moderno 2026 (Mitad Branding / Mitad Formulario).
 */
export function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await request('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      localStorage.setItem('asistencia_token', data.token);
      localStorage.setItem('asistencia_user', data.username);
      
      onLoginSuccess(data.username);
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas o fallo de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder-slate-400";

  return (
    <div className="flex w-screen h-screen bg-white dark:bg-[#050914] overflow-hidden font-sans">
      
      {/* =========================================
          LADO IZQUIERDO: Branding & Visuals
      ========================================= */}
      <div className="hidden lg:flex relative w-1/2 bg-[#0a0f1d] overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Fingerprint size={24} className="text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-widest uppercase">IPS Clinical</span>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-lg">
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
              <Sparkles size={14} />
              <span>Plataforma Empresarial</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
              <span>SEDE PRINCIPAL</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight mb-6 tracking-tight">
            Gestión Asistencial Inteligente.
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Centraliza los registros biométricos, automatiza el cálculo de inasistencias y obtén métricas precisas del rendimiento de tu personal en tiempo real.
          </p>
          
          <div className="mt-12 flex gap-6">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
              <ShieldCheck className="text-emerald-400" size={20} /> Seguridad ISAPI
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
              <Activity className="text-blue-400" size={20} /> Datos en Tiempo Real
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 text-sm text-slate-500 font-medium">
          © 2026 IPS Clinical House. Todos los derechos reservados.
        </div>
      </div>

      {/* =========================================
          LADO DERECHO: Formulario de Login
      ========================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 bg-[#050914]">
           <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[80px]" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-[420px] relative z-10">
          
          <div className="lg:hidden mb-10 flex items-center gap-3 justify-center">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Fingerprint size={28} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-widest uppercase">IPS Clinical</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Bienvenido de nuevo</h2>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Por favor, ingresa tus credenciales de administrador para acceder al panel.</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 px-5 py-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-2xl mb-8 animate-fade-in">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2 ml-1">Usuario</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Ej. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={inputClass}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-extrabold text-base transition-all duration-300 mt-4 border ${
                loading 
                  ? 'bg-slate-100 dark:bg-indigo-600/50 border-transparent dark:border-indigo-500/20 text-slate-400 dark:text-indigo-200 cursor-not-allowed'
                  : 'bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-blue-600 hover:bg-slate-800 text-white dark:border-indigo-500/50 hover:-translate-y-1 hover:shadow-xl dark:shadow-[0_0_20px_rgba(79,70,229,0.2)] dark:hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] cursor-pointer'
              }`}
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Autenticando...</>
              ) : (
                <><LogIn size={20} /> Ingresar al Sistema</>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
