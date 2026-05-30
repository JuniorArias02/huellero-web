let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// Asegurar que la URL del backend siempre tenga protocolo para evitar rutas relativas en producción
if (API_URL && !API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
  API_URL = `https://${API_URL}`;
}

/**
 * Cliente HTTP unificado para interactuar con la API de PHP.
 * 
 * @param {string} endpoint Ruta relativa del endpoint (e.g. '/api/asistencias')
 * @param {RequestInit} options Opciones estándar de fetch
 * @returns {Promise<any>} Respuesta procesada
 */
export async function request(endpoint, options = {}) {
  let token = localStorage.getItem('asistencia_token');
  
  // Silent Refresh: Si quedan menos de 10 minutos de sesión y el usuario realiza una acción
  if (token && endpoint !== '/api/refresh') {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const diezMinutos = 10 * 60 * 1000;
      
      if (exp - Date.now() < diezMinutos && exp - Date.now() > 0) {
        const refreshUrl = `${API_URL}/api/refresh`;
        const res = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('asistencia_token', data.token);
          token = data.token; // Usar el nuevo token en la petición actual
          window.dispatchEvent(new Event('auth-token-refreshed'));
        }
      }
    } catch (e) {
      console.warn('Error en silent refresh:', e);
    }
  }

  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('asistencia_token');
      localStorage.removeItem('asistencia_user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error del Servidor (HTTP ${response.status})`);
  }

  const contentType = response.headers.get('content-type');
  // Si la respuesta es un archivo binario (Excel), retornamos el Blob
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument')) {
    return response.blob();
  }

  return response.json();
}
