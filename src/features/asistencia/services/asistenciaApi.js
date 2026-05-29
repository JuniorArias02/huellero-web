import { request } from '../../../core/services/apiClient';

/**
 * Servicios de comunicación específicos para el feature de Asistencia.
 */
export const asistenciaApi = {
  /**
   * Obtiene la lista de asistencias filtrada.
   */
  obtenerAsistencias: (filtros = {}) => {
    const query = new URLSearchParams();
    if (filtros.fechaInicio) query.append('fecha_inicio', filtros.fechaInicio);
    if (filtros.fechaFin) query.append('fecha_fin', filtros.fechaFin);
    if (filtros.busqueda) query.append('busqueda', filtros.busqueda);

    return request(`/api/asistencias?${query.toString()}`);
  },

  /**
   * Busca las asistencias en la base de datos usando el caso de uso de búsqueda.
   */
  buscarAsistencias: (filtros = {}) => {
    const query = new URLSearchParams();
    if (filtros.fechaInicio) query.append('fecha_inicio', filtros.fechaInicio);
    if (filtros.fechaFin) query.append('fecha_fin', filtros.fechaFin);
    if (filtros.busqueda) query.append('busqueda', filtros.busqueda);

    return request(`/api/asistencias/buscar?${query.toString()}`);
  },

  /**
   * Sincroniza datos desde el biométrico en un rango de fechas.
   */
  sincronizar: (filtros = {}) => {
    return request('/api/sincronizar', {
      method: 'POST',
      body: JSON.stringify({
        fecha_inicio: filtros.fechaInicio,
        fecha_fin: filtros.fechaFin
      })
    });
  },

  /**
   * Obtiene la configuración general y la lista de horarios de empleados.
   */
  obtenerConfiguracion: () => {
    return request('/api/configuracion');
  },

  /**
   * Guarda la configuración de la empresa y empleados.
   */
  guardarConfiguracion: (config) => {
    return request('/api/configuracion', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  },

  obtenerExcelUrl: (filtros = {}) => {
    const query = new URLSearchParams();
    if (filtros.fechaInicio) query.append('fecha_inicio', filtros.fechaInicio);
    if (filtros.fechaFin) query.append('fecha_fin', filtros.fechaFin);
    if (filtros.busqueda) query.append('busqueda', filtros.busqueda);
    
    // Adjuntar el token para permitir la descarga directa desde el navegador
    const token = localStorage.getItem('asistencia_token');
    if (token) {
      query.append('token', token);
    }
    
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    return `${baseUrl}/api/exportar?${query.toString()}`;
  }
};
