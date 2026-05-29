import React, { useState } from 'react';
import { User, Lock, Fingerprint, Sparkles, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { request } from '../../../core/services/apiClient';

/**
 * Componente de Login Premium para el Panel de Asistencia.
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

  return (
    <div className="login-page-container">
      <div className="login-glow-orb-1"></div>
      <div className="login-glow-orb-2"></div>
      
      <div className="login-card">
        <div className="login-card-header">
          <div className="login-logo-ring">
            <Fingerprint size={42} className="login-logo-icon" />
          </div>
          <div className="welcome-badge" style={{ margin: '1rem auto 0.5rem auto' }}>
            <Sparkles size={12} />
            <span>Control de Asistencia</span>
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Ingrese sus credenciales de administrador para continuar</p>
        </div>

        {error && (
          <div className="login-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Nombre de Usuario</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                type="text"
                placeholder="perez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="filter-input filter-search"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label>Contraseña</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="filter-input filter-search password-input"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary btn-block login-btn ${loading ? 'loading' : ''}`}
            style={{ marginTop: '2rem' }}
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Ingresar al Sistema</span>
              </>
            )}
          </button>
        </form>

        <div className="login-card-footer">
          <p></p>
        </div>
      </div>
    </div>
  );
}
