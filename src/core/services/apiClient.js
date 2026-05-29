const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Cliente HTTP unificado para interactuar con la API de PHP.
 * 
 * @param {string} endpoint Ruta relativa del endpoint (e.g. '/api/asistencias')
 * @param {RequestInit} options Opciones estándar de fetch
 * @returns {Promise<any>} Respuesta procesada
 */
export async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('asistencia_token');
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
