import { useState, useEffect } from 'react';
import '../pages/styles/users.css';

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
    programas: ''
  });

  // Cargar datos del usuario si estamos en modo edición o resetear el formulario cuando se cierra el modal
  useEffect(() => {
    if (!showModal) {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol: '',
        programas: ''
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
        programas: currentUser.programas || ''
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
          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar rol</option>
              <option value="Productor">Productor</option>
              <option value="Operador">Operador</option>
              <option value="Operador Jefe">Operador jefe</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="programas">Programas Asignados</label>
            <select
              id="programas"
              name="programas"
              value={formData.programas}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar programas</option>
              <option value="Morning Show">Morning Show</option>
              <option value="Afternoon Drive">Afternoon Drive</option>
              <option value="Evening Show">Evening Show</option>
              <option value="All Programs">All Programs</option>
            </select>
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