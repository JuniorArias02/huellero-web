import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, RotateCcw, Calendar } from 'lucide-react';

/**
 * Componente para filtrar y buscar asistencias de forma controlada mediante un botón.
 */
export function FiltrosBusqueda({ filtros, onCambiarFiltro, onRecargar, excelUrl }) {
  const [valoresLocales, setValoresLocales] = useState({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    busqueda: filtros.busqueda
  });

  // Mantener los valores locales sincronizados cuando los filtros globales cambian externamente
  useEffect(() => {
    setValoresLocales({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      busqueda: filtros.busqueda
    });
  }, [filtros]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValoresLocales((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (e) => {
    try {
      e.target.showPicker();
    } catch (err) {
      // Fallback si el navegador no soporta showPicker programático
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCambiarFiltro(valoresLocales);
  };

  return (
    <form onSubmit={handleSubmit} className="filters-container">
      <div className="search-group">
        <div className="input-with-icon">
          <Search className="input-icon" size={18} />
          <input
            type="text"
            name="busqueda"
            placeholder="Buscar por nombre o ID..."
            value={valoresLocales.busqueda}
            onChange={handleInputChange}
            className="filter-input filter-search"
          />
        </div>
      </div>

      <div className="dates-group">
        <div className="date-field">
          <label>Desde:</label>
          <div className="input-with-icon date-input-wrapper">
            <Calendar className="input-icon" size={16} />
            <input
              type="date"
              name="fechaInicio"
              value={valoresLocales.fechaInicio}
              onChange={handleInputChange}
              onClick={handleDateClick}
              className="filter-input filter-date filter-date-input"
            />
          </div>
        </div>

        <div className="date-field">
          <label>Hasta:</label>
          <div className="input-with-icon date-input-wrapper">
            <Calendar className="input-icon" size={16} />
            <input
              type="date"
              name="fechaFin"
              value={valoresLocales.fechaFin}
              onChange={handleInputChange}
              onClick={handleDateClick}
              className="filter-input filter-date filter-date-input"
            />
          </div>
        </div>
      </div>

      <div className="actions-group">
        <button
          type="submit"
          className="btn btn-primary btn-with-icon"
          title="Buscar asistencias"
        >
          <Search size={18} />
          <span>Buscar</span>
        </button>

        <button
          type="button"
          onClick={onRecargar}
          className="btn btn-secondary btn-icon-only"
          title="Actualizar tabla"
        >
          <RotateCcw size={18} />
        </button>

        <a
          href={excelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success btn-with-icon"
        >
          <FileSpreadsheet size={18} />
          <span>Exportar Excel</span>
        </a>
      </div>
    </form>
  );
}
