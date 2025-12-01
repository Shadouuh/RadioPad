import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import ProgramSelector from '../components/ProgramSelector';
import './UserModal.css';

const UserModal = ({ isOpen, onClose, user = null, programs = [], onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    program_ids: [] // Cambiado de program_id a program_ids
  });

  const availableRoles = ['Jefe de Operadores', 'Productor', 'Operador'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProgramsChange = (programIds) => {
    setFormData(prev => ({
      ...prev,
      program_ids: programIds
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado al menos un programa
    if (formData.program_ids.length === 0) {
      alert('Por favor selecciona al menos un programa');
      return;
    }

    const dataToSend = { ...formData };

    onSave(dataToSend);
    onClose();
  };

  // Sincronizar el formulario cuando cambia el usuario seleccionado o se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || availableRoles[0],
        program_ids: user.programs ? user.programs.map(p => p.id) : []
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: availableRoles[0],
        program_ids: []
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Completa los datos para {user ? 'editar el' : 'crear un nuevo'} usuario en el sistema.
          </p>

          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="usuario@radiopad.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Rol</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Nuevo selector de múltiples programas */}
            <div className="form-group">
              <ProgramSelector
                programs={programs}
                selectedPrograms={formData.program_ids}
                onProgramsChange={handleProgramsChange}
                label="Programas Asignados"
              />
            </div>

            <div className="form-group">
              <small className="form-help">
                La constraseña por defecto es "1234"
              </small>
            </div>

            <button type="submit" className="submit-btn">
              {user ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;