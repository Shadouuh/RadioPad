import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './UserModal.css';

const UserModal = ({ isOpen, onClose, user = null, programs = [], onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Productor',
    program_id: user?.program_id || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si es edición y no se proporciona contraseña, no la incluimos
    const dataToSend = { ...formData };

    onSave(dataToSend);
    onClose();
  };

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
                <option value="Productor">Productor</option>
                <option value="Operador">Operador</option>
                <option value="Jefe de Operadores">Jefe de Operadores</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="program_id">Programa Asignado</label>
              <select
                id="program_id"
                name="program_id"
                value={formData.program_id}
                onChange={handleInputChange}
              >
                <option value="">Sin programa asignado</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
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