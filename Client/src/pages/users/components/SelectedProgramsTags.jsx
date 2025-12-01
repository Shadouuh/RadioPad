import React from 'react';
import { FiX } from 'react-icons/fi';
import './SelectedProgramsTags.css';

const SelectedProgramsTags = ({ selectedPrograms, programs, onRemoveProgram }) => {
  if (!selectedPrograms || selectedPrograms.length === 0) {
    return (
      <div className="no-programs-selected">
        <span className="no-programs-text">No hay programas seleccionados</span>
      </div>
    );
  }

  return (
    <div className="selected-programs-container">
      <div className="selected-programs-scroll">
        {selectedPrograms.map(programId => {
          const program = programs.find(p => p.id === programId);
          if (!program) return null;
          
          return (
            <div key={programId} className="program-tag">
              <span className="program-tag-name">{program.name}</span>
              <button
                className="program-tag-remove"
                onClick={() => onRemoveProgram(programId)}
                title="Eliminar programa"
              >
                <FiX size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedProgramsTags;