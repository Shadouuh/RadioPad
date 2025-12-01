import './styles/programModal.css';
import { useState } from 'react';

const ProgramModal = ({ title, onClose, editing, formData, handleInputChange, handleSubmit, editProgram }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <form onSubmit={editing ? editProgram : handleSubmit} className="formulario-programas">
            <div className="form-div">
              <div className="grupo-form">
                <label htmlFor="name">Nombre del Programa</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form">
                <label htmlFor="image">URL de la Imagen</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form">
                <label htmlFor="operators">Operadores (separados por coma)</label>
                <input
                  type="text"
                  id="operators"
                  name="operators"
                  value={formData.operators}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form">
                <label htmlFor="producers">Productores (separados por coma)</label>
                <input
                  type="text"
                  id="producers"
                  name="producers"
                  value={formData.producers}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-div">
              <div className="grupo-form">
                <label htmlFor="time-init">Hora de Inicio</label>
                <input
                  type="time"
                  id="time-init"
                  name="time-init"
                  value={formData['time-init']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form">
                <label htmlFor="time-final">Hora de Finalización</label>
                <input
                  type="time"
                  id="time-final"
                  name="time-final"
                  value={formData['time-final']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form-btn">
                <button type="submit" className='btn-guardar'>{editing ? 'Actualizar Programa' : 'Guardar Programa'}</button>
                <button type="button" className='btn-cancelar' onClick={onClose}>Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgramModal;