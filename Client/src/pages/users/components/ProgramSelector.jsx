import React, { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import ProgramSelectionModal from '../modals/ProgramSelectionModal';
import SelectedProgramsTags from '../components/SelectedProgramsTags';
import '../styles/ProgramSelector.css';

const ProgramSelector = ({ programs, selectedPrograms, onProgramsChange, label = "Programas Asignados" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProgramSelect = (programIds) => {
    onProgramsChange(programIds);
  };

  const handleRemoveProgram = (programId) => {
    const newSelectedPrograms = selectedPrograms.filter(id => id !== programId);
    onProgramsChange(newSelectedPrograms);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="program-selector-container">
      <label className="program-selector-label">
        {label}
        <span className="program-selector-required">*</span>
      </label>
      
      <div className="program-selector-content">
        <SelectedProgramsTags
          selectedPrograms={selectedPrograms}
          programs={programs}
          onRemoveProgram={handleRemoveProgram}
        />
        
        <button
          type="button"
          className="program-selector-button"
          onClick={handleOpenModal}
        >
          <FiPlus size={16} />
          <span>{selectedPrograms.length > 0 ? 'Agregar más programas' : 'Seleccionar programas'}</span>
        </button>
      </div>

      <ProgramSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        programs={programs}
        selectedPrograms={selectedPrograms}
        onProgramSelect={(programId) => {
          const newSelectedPrograms = [...selectedPrograms, programId];
          onProgramsChange(newSelectedPrograms);
        }}
        onProgramDeselect={(programId) => {
          const newSelectedPrograms = selectedPrograms.filter(id => id !== programId);
          onProgramsChange(newSelectedPrograms);
        }}
        onConfirm={handleCloseModal}
      />
    </div>
  );
};

export default ProgramSelector;