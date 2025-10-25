import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './UserModal.css';
import programService from '../services/programService';

const UserModal = ({ isOpen, onClose, user = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Usuario',
    selectedPrograms: user?.programs?.map(prog => prog.id) || []
  });
  
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPrograms();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Usuario',
        selectedPrograms: user.programs?.map(prog => prog.id) || []
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Usuario',
        selectedPrograms: []
      });
    }
  }, [user, isOpen]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const programs = await programService.getAll();
      setAvailablePrograms(programs);
    } catch (error) {
      console.error('Error al cargar programas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProgramChange = (e) => {
    const programId = e.target.value;
    
    setFormData(prev => {
      const selectedPrograms = [...prev.selectedPrograms];
      
      if (e.target.checked) {
        selectedPrograms.push(programId);
      } else {
        const index = selectedPrograms.indexOf(programId);
        if (index !== -1) {
          selectedPrograms.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        selectedPrograms
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
                <option value="Usuario">Usuario</option>
                <option value="Operador">Operador</option>
                <option value="Jefe de Operaciones">Jefe de Operaciones</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Programas Asignados</label>
              <div className="programs-selection">
                {loading ? (
                  <p>Cargando programas...</p>
                ) : (
                  availablePrograms.length > 0 ? (
                    <div className="programs-list">
                      {availablePrograms.map(program => (
                        <div key={program.id} className="program-item">
                          <input
                            type="checkbox"
                            id={`program-${program.id}`}
                            value={program.id}
                            checked={formData.selectedPrograms.includes(program.id)}
                            onChange={handleProgramChange}
                          />
                          <label htmlFor={`program-${program.id}`}>
                            {program.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay programas disponibles</p>
                  )
                )}
              </div>
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