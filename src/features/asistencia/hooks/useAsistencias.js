import { useState, useEffect, useCallback, useMemo } from 'react';
import { asistenciaApi } from '../services/asistenciaApi';

/**
 * Hook personalizado para manejar el estado y la lógica de asistencias.
 */
export function useAsistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Rango de fechas por defecto correspondiente al dataset de Mayo 2026
  const [filtros, setFiltros] = useState({
    fechaInicio: '2026-05-01',
    fechaFin: '2026-05-31',
    busqueda: ''
  });

  /**
   * Carga los registros de asistencia aplicando los filtros actuales.
   */
  const cargarAsistencias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await asistenciaApi.buscarAsistencias(filtros);
      setAsistencias(data);
    } catch (err) {
      setError(err.message || 'Error al obtener los registros.');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Cargar datos cada vez que los filtros cambian (incluye carga inicial)
  useEffect(() => {
    cargarAsistencias();
  }, [cargarAsistencias]);

  /**
   * Actualiza los filtros de búsqueda.
   */
  const actualizarFiltros = useCallback((nuevosFiltros) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
  }, []);

  /**
   * Ejecuta la sincronización con el biométrico.
   */
  const sincronizar = useCallback(async (rangoSync) => {
    setSyncing(true);
    setError(null);
    try {
      const res = await asistenciaApi.sincronizar(rangoSync);
      // Recargar la tabla tras la sincronización
      await cargarAsistencias();
      return res;
    } catch (err) {
      setError(err.message || 'Error en la sincronización con el biométrico.');
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [cargarAsistencias]);

  /**
   * Calcula métricas agregadas en tiempo real a partir del set de datos filtrado.
   */
  const metricas = useMemo(() => {
    const total = asistencias.length;
    
    // Obtener número de empleados únicos
    const empleadosUnicos = new Set(asistencias.map(a => a.employeeNo).filter(Boolean)).size;

    // Conteo de modos de verificación
    let huellas = 0;
    let rostros = 0;
    let tarjetas = 0;
    let otros = 0;

    asistencias.forEach((a) => {
      const modo = (a.modoVerificacion || '').toLowerCase();
      if (modo.includes('fp') || modo.includes('huella')) {
        huellas++;
      } else if (modo.includes('face') || modo.includes('rostro')) {
        rostros++;
      } else if (modo.includes('card') || modo.includes('tarjeta')) {
        tarjetas++;
      } else {
        otros++;
      }
    });

    return {
      total,
      empleadosUnicos,
      modos: {
        huellas,
        rostros,
        tarjetas,
        otros
      }
    };
  }, [asistencias]);

  /**
   * Obtiene la URL completa del endpoint de exportación Excel con filtros actuales.
   */
  const excelUrl = useMemo(() => {
    return asistenciaApi.obtenerExcelUrl(filtros);
  }, [filtros]);

  return {
    asistencias,
    loading,
    error,
    syncing,
    filtros,
    metricas,
    excelUrl,
    cargarAsistencias,
    actualizarFiltros,
    sincronizar
  };
}
