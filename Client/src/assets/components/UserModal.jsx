import { useState, useEffect } from 'react';
import usePrograms from '../../hooks/useprograms'
import '../pages/styles/users.css';
import { LuX } from 'react-icons/lu';

const UserModal = ({
  showModal,
  handleCloseModal,
  createUser,
  updateUser,
  currentUser,
  isEditing,
  loading,
  error,
  successMessage,
  setError,
  setSuccessMessage
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    programas: [],
    roles: []
  });
  
  const [showProgramSelector, setShowProgramSelector] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  
  // Lista de roles disponibles
  const availableRoles = [
    { id: 1, name: 'productor' },
    { id: 2, name: 'operador' },
    { id: 3, name: 'jefe de operadores' }
  ];

  const { programs } = usePrograms();

  // Cargar datos del usuario si estamos en modo edición o resetear el formulario cuando se cierra el modal
  useEffect(() => {
    if (!showModal) {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol: '',
        programas: [],
        roles: []
      });
      setError('');
      setSuccessMessage('');
    } else if (isEditing && currentUser) {
      // Cargar los datos del usuario actual en el formulario
      setFormData({
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        email: currentUser.email || '',
        rol: currentUser.rol || '',
        programas: currentUser.programas || [],
        roles: currentUser.roles || []
      });
    }
  }, [showModal, isEditing, currentUser, setError, setSuccessMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Función para manejar la selección de programas
  const handleProgramSelect = (program) => {
    // Verificar si el programa ya está seleccionado
    const isAlreadySelected = formData.programas.some(p => p.id === program.id);
    
    if (isAlreadySelected) {
      // Si ya está seleccionado, lo quitamos
      setFormData({
        ...formData,
        programas: formData.programas.filter(p => p.id !== program.id)
      });
    } else {
      // Si no está seleccionado, lo añadimos
      setFormData({
        ...formData,
        programas: [...formData.programas, { id: program.id, name: program.name }]
      });
    }
  };
  
  // Función para manejar la selección de roles
  const handleRoleSelect = (role) => {
    // Verificar si el rol ya está seleccionado
    const isAlreadySelected = formData.roles.some(r => r.id === role.id);
    
    if (isAlreadySelected) {
      // Si ya está seleccionado, lo quitamos
      setFormData({
        ...formData,
        roles: formData.roles.filter(r => r.id !== role.id)
      });
    } else {
      // Si no está seleccionado, lo añadimos
      setFormData({
        ...formData,
        roles: [...formData.roles, { id: role.id, name: role.name }]
      });
    }
  };
  
  // Función para abrir/cerrar el selector de programas
  const toggleProgramSelector = () => {
    setShowProgramSelector(!showProgramSelector);
    if (showRoleSelector) setShowRoleSelector(false);
  };
  
  // Función para abrir/cerrar el selector de roles
  const toggleRoleSelector = () => {
    setShowRoleSelector(!showRoleSelector);
    if (showProgramSelector) setShowProgramSelector(false);
  };
  
  // Función para cerrar los selectores cuando se hace clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProgramSelector && !event.target.closest('.program-selector-container')) {
        setShowProgramSelector(false);
      }
      if (showRoleSelector && !event.target.closest('.role-selector-container')) {
        setShowRoleSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProgramSelector, showRoleSelector]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    if (isEditing && currentUser) {
      // Llamar a la función updateUser del hook
      result = await updateUser(currentUser.id, formData);
    } else {
      // Llamar a la función createUser del hook
      result = await createUser(formData);
    }

    // Si la operación fue exitosa, cerrar el modal después de un breve retraso
    if (result.success) {
      setTimeout(() => {
        handleCloseModal();
      }, 3000);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</h2>
          <p>{isEditing ? 'Modifica los datos del usuario y sus permisos' : 'Crea una nueva cuenta de usuario y asigna permisos'}</p>
          <button className="close-modal-btn" onClick={handleCloseModal}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" id='row-input'>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group" id='row-input'>
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email@ejemplo.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          {formData.rol !== 'Operador Jefe' && (
            <div className="form-group">
              <label>Programas:</label>
              <div className="program-selector-container">
                <div className="selected-programs-container" onClick={toggleProgramSelector}>
                  {formData.programas.length > 0 ? (
                    <div className="selected-programs">
                      {formData.programas.map((program) => (
                        <div key={program.id} className="selected-program-tag">
                          {program.name}
                          <button 
                            type="button" 
                            className="remove-program-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProgramSelect(program);
                            }}
                          >
                            <LuX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-programs-selected">Seleccionar programas</div>
                  )}
                </div>
                
                {showProgramSelector && (
                  <div className="program-selector-modal">
                    <div className="program-selector-content">
                      <div className="program-selector-header">
                        <h3>Seleccionar Programas</h3>
                      </div>
                      <div className="program-selector-body">
                        <div className="program-columns">
                          <div className="program-column">
                            <h4>Programas elegidos</h4>
                            <div className="program-list">
                              {formData.programas.map((program) => (
                                <div 
                                  key={program.id} 
                                  className="program-item selected"
                                  onClick={() => handleProgramSelect(program)}
                                >
                                  {program.name}
                                  <button className="remove-program-btn">
                                    <LuX size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="program-column">
                            <h4>Programas disponibles</h4>
                            <div className="program-list">
                              {programs
                                .filter(program => !formData.programas.some(p => p.id === program.id))
                                .map((program) => (
                                  <div 
                                    key={program.id} 
                                    className="program-item"
                                    onClick={() => handleProgramSelect(program)}
                                  >
                                    {program.name}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="program-selector-footer">
                        <button 
                          type="button" 
                          className="cancel-selector-btn"
                          onClick={() => setShowProgramSelector(false)}
                        >
                          cancelar
                        </button>
                        <button 
                          type="button" 
                          className="accept-selector-btn"
                          onClick={() => setShowProgramSelector(false)}
                        >
                          aceptar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>Roles:</label>
            <div className="role-selector-container">
              <div className="selected-roles-container" onClick={toggleRoleSelector}>
                {formData.roles.length > 0 ? (
                  <div className="selected-roles">
                    {formData.roles.map((role) => (
                      <div key={role.id} className="selected-role-tag">
                        {role.name}
                        <button 
                          type="button" 
                          className="remove-role-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleSelect(role);
                          }}
                        >
                          <LuX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-roles-selected">Seleccionar roles</div>
                )}
              </div>
              
              {showRoleSelector && (
                <div className="role-selector-modal">
                  <div className="role-selector-content">
                    <div className="role-selector-header">
                      <h3>Seleccionar Roles</h3>
                    </div>
                    <div className="role-selector-body">
                      <div className="role-columns">
                        <div className="role-column">
                          <h4>Roles elegidos</h4>
                          <div className="role-list">
                            {formData.roles.map((role) => (
                              <div 
                                key={role.id} 
                                className="role-item selected"
                                onClick={() => handleRoleSelect(role)}
                              >
                                {role.name}
                                <button className="remove-role-btn">
                                  <LuX size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="role-column">
                          <h4>Roles disponibles</h4>
                          <div className="role-list">
                            {availableRoles
                              .filter(role => !formData.roles.some(r => r.id === role.id))
                              .map((role) => (
                                <div 
                                  key={role.id} 
                                  className="role-item"
                                  onClick={() => handleRoleSelect(role)}
                                >
                                  {role.name}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="role-selector-footer">
                      <button 
                        type="button" 
                        className="cancel-selector-btn"
                        onClick={() => setShowRoleSelector(false)}
                      >
                        cancelar
                      </button>
                      <button 
                        type="button" 
                        className="accept-selector-btn"
                        onClick={() => setShowRoleSelector(false)}
                      >
                        aceptar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {successMessage && <p className="success-message" style={{ color: '#10b981', marginBottom: '10px' }}>{successMessage}</p>}
          <div className="form-actions">
            <button type="submit" className="create-user-btn" disabled={loading}>
              {loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;