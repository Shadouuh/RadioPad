import React, { useState, useEffect } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import './ProgramSelectionModal.css';

const ProgramSelectionModal = ({ 
  isOpen, 
  onClose, 
  programs, 
  selectedPrograms, 
  onProgramSelect, 
  onProgramDeselect,
  onConfirm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Filtrar programas basado en el término de búsqueda
      const filtered = programs.filter(program =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  }, [searchTerm, programs, isOpen]);

  const handleProgramToggle = (programId, event) => {
    // Prevenir que el evento se propague si se hace clic en el checkbox directamente
    if (event && event.target.type === 'checkbox') {
      event.stopPropagation();
    }
    
    if (selectedPrograms.includes(programId)) {
      onProgramDeselect(programId);
    } else {
      onProgramSelect(programId);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="program-modal-overlay" onClick={onClose}>
      <div className="program-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="program-modal-header">
          <h3>Seleccionar Programas</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="program-modal-search">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Buscar programas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="program-search-input"
            />
            <FiSearch className="search-icon" size={24} />
          </div>
        </div>

        <div className="program-modal-content">
          {filteredPrograms.length === 0 ? (
            <div className="no-programs-message">
              {searchTerm ? 'No se encontraron programas' : 'No hay programas disponibles'}
            </div>
          ) : (
            <div className="programs-grid">
              {filteredPrograms.map(program => (
                <div
                  key={program.id}
                  className={`program-item ${selectedPrograms.includes(program.id) ? 'selected' : ''}`}
                  onClick={(e) => handleProgramToggle(program.id, e)}
                >
                  <div className="program-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPrograms.includes(program.id)}
                      onChange={(e) => handleProgramToggle(program.id, e)}
                    />
                  </div>
                  <div className={`program-info ${selectedPrograms.includes(program.id) ? 'selected' : ''}`}>
                    <h4>{program.name}</h4>
                    <p>{program.description || 'Sin descripción'}</p>
                    <span className={`program-status ${program.status.toLowerCase()}`}>
                      {program.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="program-modal-footer">
          <div className="selected-count">
            {selectedPrograms.length} programa{selectedPrograms.length !== 1 ? 's' : ''} seleccionado{selectedPrograms.length !== 1 ? 's' : ''}
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-confirm" onClick={handleConfirm}>
              Confirmar Selección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramSelectionModal;