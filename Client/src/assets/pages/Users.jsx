import { useState, useEffect } from 'react';
import './styles/users.css';
import UserModal from '../components/UserModal';
import useUsers from '../../hooks/useUsers';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const {
    users,
    loading,
    error,
    successMessage,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    fetchUsers,
    setError,
    setSuccessMessage
  } = useUsers();

  // Cargar usuarios desde Firestore cuando el componente se monta
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentUser(null);
  };
  
  const handleEditUser = async (userId) => {
    try {
      const userData = await getUserById(userId);
      if (userData) {
        setCurrentUser(userData);
        setIsEditing(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario para editar:', error);
      setError('Error al cargar datos del usuario');
    }
  };
  
  const handleDeleteUser = (userId, userName) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar al usuario ${userName}?`,
      buttons: [
        {
          label: 'Sí, eliminar',
          onClick: async () => {
            try {
              const result = await deleteUser(userId);
              if (result.success) {
                setSuccessMessage('Usuario eliminado correctamente');
              }
            } catch (error) {
              console.error('Error al eliminar usuario:', error);
              setError('Error al eliminar usuario');
            }
          }
        },
        {
          label: 'Cancelar',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <div className="users-title">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios y sus permisos</p>
        </div>
        <button className="add-user-btn" onClick={handleOpenModal}>
           Añadir Usuario
        </button>
      </div>

      <div className="users-content">
        <div className="users-subtitle">
          <h2><span className="user-icon"></span> Usuarios</h2>
          <p>Gestiona los usuarios y sus roles en la emisora</p>
        </div>

        {loading ? (
          <p className="loading-message">Cargando usuarios...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Programas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre}</td>
                    <td>{user.rol}</td>
                    <td>{user.programas}</td>
                    <td className="actions-cell">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEditUser(user.id)}
                      >
                        editar
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteUser(user.id, user.nombre)}
                      >
                        borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Componente Modal separado */}
      <UserModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        createUser={createUser}
        updateUser={updateUser}
        currentUser={currentUser}
        isEditing={isEditing}
        loading={loading}
        error={error}
        successMessage={successMessage}
        setError={setError}
        setSuccessMessage={setSuccessMessage}
      />
    </div>
  );
};

export default Users;