import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaTimes, FaHeadphones, FaAd, FaPowerOff } from 'react-icons/fa';
import { MdMusicNote } from 'react-icons/md';
import ProgramModal from './modals/ProgramModal.jsx';
import SoundModal from './modals/SoundModal.jsx';
import './styles/programs.css';
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';
import { useMultiAudioPlayer } from '../../shared/contexts/MultiAudioPlayerContext.jsx';
import { UserContext } from '../../shared/contexts/UserContext.jsx';
import ProgramService from '../../shared/services/ProgramService.js';
import useNotification from '../../shared/hooks/useNotification';
import usePermisos from '../../shared/hooks/usePermisos.js';

const ProgramsContent = () => {
  const { isCollapsed } = useSidebar();
  const { playSound, players } = useMultiAudioPlayer();
  const { user, loading: userLoading } = useContext(UserContext);
  const { hasFullAccess } = usePermisos();
  const notify = useNotification();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programSounds, setProgramSounds] = useState({});
  const [loadingSounds, setLoadingSounds] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);

  const canEditProgram = (program) => {
    const result = hasFullAccess();
    if (result) return true;
    if (user?.role === 'Operador') {
      const programMatch = user?.program_id === program.id;
      return programMatch;
    }
    return false;
  };

  const canEditSound = () => {
    const result = hasFullAccess();
    if (result) return true;
    if (user?.role === 'Operador' && selectedProgram) {
      const programMatch = user?.program_id === selectedProgram.id;
      return programMatch;
    }
    return false;
  };

  const canCreateProgram = () => {
    const result = hasFullAccess();
    return result;
  };

  const canToggleProgramStatus = () => {
    const result = hasFullAccess();
    return result;
  };

  const canAddSound = () => {
    const result = hasFullAccess();
    if (result) return true;
    if (user?.role === 'Operador' && selectedProgram) {
      const programMatch = user?.program_id === selectedProgram.id;
      return programMatch;
    }
    return false;
  };

  // Cargar programas al montar el componente
  useEffect(() => {
    if (user) {
      loadPrograms();
    }
  }, [user]);

  // Cargar sonidos cuando se selecciona un programa
  useEffect(() => {
    if (selectedProgram && selectedProgram.id) {
      loadProgramSounds(selectedProgram.id);
    }
  }, [selectedProgram]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const response = await ProgramService.getUserPrograms();
      if (response.success) {
        if(hasFullAccess()) setPrograms(response.data);
        else {
          console.log(user?.program_id);
          setPrograms(response.data.filter(program => program.id == user?.program_id));
        }
      } else {
        notify('Error al cargar programas', 'error');
      }
    } catch (error) {
      console.error('Error loading programs:', error);
      notify(error?.response?.data?.message || 'Error al cargar programas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProgramSounds = async (programId) => {
    try {
      setLoadingSounds(true);
      const response = await ProgramService.getProgramSounds(programId);
      if (response.success) {
        setProgramSounds(prev => ({
          ...prev,
          [programId]: response.data
        }));
      } else {
        notify('Error al cargar sonidos del programa', 'error');
      }
    } catch (error) {
      console.error('Error loading program sounds:', error);
      notify(error?.response?.data?.message || 'Error al cargar sonidos del programa', 'error');
    } finally {
      setLoadingSounds(false);
    }
  };

  const handleCreateProgram = () => {
    if (!canCreateProgram()) {
      notify('No tienes permisos para crear programas', 'error');
      return;
    }
    setEditingProgram(null);
    setIsProgramModalOpen(true);
  };

  const handleEditProgram = (program) => {
    if (!canEditProgram(program)) {
      notify('No tienes permisos para editar este programa', 'error');
      return;
    }
    setEditingProgram(program);
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = async (programData) => {
    try {
      let response;
      if (editingProgram) {
        // Verificar permisos antes de actualizar
        if (!canEditProgram(editingProgram)) {
          notify('No tienes permisos para actualizar este programa', 'error');
          return;
        }
        response = await ProgramService.updateProgram(editingProgram.id, programData);
      } else {
        // Verificar permisos antes de crear
        if (!canCreateProgram()) {
          notify('No tienes permisos para crear programas', 'error');
          return;
        }
        response = await ProgramService.createProgram(programData);
      }

      if (response.success) {
        notify(editingProgram ? 'Programa actualizado exitosamente' : 'Programa creado exitosamente', 'success');
        setIsProgramModalOpen(false);
        setEditingProgram(null);
        loadPrograms(); // Recargar la lista
      } else {
        notify('Error al guardar programa', 'error');
      }
    } catch (error) {
      console.error('Error saving program:', error);
      notify(error?.response?.data?.message || 'Error al guardar programa', 'error');
    }
  };

  const toggleProgramStatus = async (status, programId) => {
    if (!canToggleProgramStatus()) {
      notify('No tienes permisos para cambiar el estado de programas', 'error');
      return;
    }
    if (window.confirm(status === 'active' ? '¿Estás seguro de que deseas desactivar este programa?' : '¿Estás seguro de que deseas activar este programa?')) {
      try {
        const response = await ProgramService.toggleProgramStatus(programId);
        if (response.success) {
          notify(status === 'active' ? 'Programa desactivado exitosamente' : 'Programa activado exitosamente', 'success');
          loadPrograms(); // Recargar la lista
          if (selectedProgram && selectedProgram.id === programId) {
            setSelectedProgram(null);
          }
        } else {
          notify(status === 'active' ? 'Error al desactivar programa' : 'Error al activar programa', 'error');
        }
      } catch (error) {
        console.error('Error toggling program status:', error);
        notify(error?.response?.data?.message || status === 'active' ? 'Error al desactivar programa' : 'Error al activar programa', 'error');
      }
    }
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
  };

  const handleAddSound = () => {
    if (!canAddSound()) {
      notify('No tienes permisos para agregar sonidos a este programa', 'error');
      return;
    }
    setIsSoundModalOpen(true);
  };

  const handleSaveSound = async (soundData) => {
    try {
      // Verificar permisos antes de guardar
      if (!canAddSound()) {
        notify('No tienes permisos para guardar sonidos en este programa', 'error');
        return;
      }

      let response;
      if (soundData.id) {
        // Actualizar sonido existente
        response = await ProgramService.updateProgramSound(soundData.id, soundData);
      } else {
        // Crear nuevo sonido
        if (soundData.file) {
          const formData = new FormData();
          formData.append('file', soundData.file);
          formData.append('sound_name', soundData.name || soundData.file?.name || 'audio');
          formData.append('description', soundData.description || '');
          formData.append('is_institutional', soundData.category === 'Institucional' ? 'true' : 'false');

          const uploadRes = await ProgramService.uploadSound(formData);

          const uploaded = uploadRes?.data || uploadRes;
          const url = uploaded?.url || uploaded?.secure_url || uploaded?.file_path;
          const durationAuto = uploaded?.duration || uploaded?.duration_seconds;

          const payload = {
            name: soundData.name,
            description: soundData.description || '',
            duration: durationAuto ?? soundData.duration ?? '',
            category: soundData.category,
            file_url: url || ''
          };

          response = await ProgramService.createProgramSound(selectedProgram.id, payload);
        } else {
          response = await ProgramService.createProgramSound(selectedProgram.id, soundData);
        }
      }

      if (response.success) {
        notify(soundData.id ? 'Sonido actualizado exitosamente' : 'Sonido agregado exitosamente', 'success');
        setIsSoundModalOpen(false);
        loadProgramSounds(selectedProgram.id); // Recargar sonidos del programa
      } else {
        notify('Error al guardar sonido', 'error');
      }
    } catch (error) {
      console.error('Error saving sound:', error);
      notify(error?.response?.data?.message || 'Error al guardar sonido', 'error');
    }
  };

  const handleDeleteSound = async (soundId) => {
    if (!canEditSound({ id: soundId })) {
      notify('No tienes permisos para eliminar este sonido', 'error');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas eliminar este sonido?')) {
      try {
        const response = await ProgramService.deleteProgramSound(soundId);
        if (response.success) {
          notify('Sonido eliminado exitosamente', 'success');
          loadProgramSounds(selectedProgram.id); // Recargar sonidos del programa
          programs[selectedProgram.id].effects--;
        } else {
          notify('Error al eliminar sonido', 'error');
        }
      } catch (error) {
        console.error('Error deleting sound:', error);
        notify(error?.response?.data?.message || 'Error al eliminar sonido', 'error');
      }
    }
  };

  const handleEditSound = (sound) => {
    if (!canEditSound(sound)) {
      notify('No tienes permisos para editar este sonido', 'error');
      return;
    }
    setSelectedSound(sound);
    setIsSoundModalOpen(true);
  };

  // Función para reproducir un sonido usando el reproductor global
  const handlePlaySound = (sound) => {
    // Preparar el objeto de sonido para el reproductor global
    const soundData = {
      sound_id: sound.id,
      sound_name: sound.name,
      description: sound.description || sound.category || 'Efecto de sonido',
      file_path: sound.file_url || sound.url || sound.file_path || sound.audio_url,
      duration_seconds: sound.duration
    };

    playSound(soundData);
  };

  // Función auxiliar para verificar si un sonido está siendo reproducido
  const isSoundPlaying = (soundId) => {
    return Array.from(players.values()).some(player =>
      player.currentSound && player.currentSound.sound_id === soundId && player.isPlaying
    );
  };

  // Mostrar estado de carga mientras se obtiene el usuario
  if (userLoading || !user) {
    return (
      <div className={`programs-container ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="programs-header">
          <div className="header-content">
            <h1>Gestión de Programas</h1>
            <p>Cargando información del usuario...</p>
          </div>
        </div>
        <div className="programs-content">
          <div className="loading-state">
            <p>Verificando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Verificar que el usuario tenga un rol válido
  const validRoles = ['Jefe de Operadores', 'Operador', 'Productor'];
  if (!validRoles.includes(user.role)) {
    return (
      <div className={`programs-container ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="programs-header">
          <div className="header-content">
            <h1>Gestión de Programas</h1>
            <p>Acceso no autorizado</p>
          </div>
        </div>
        <div className="programs-content">
          <div className="no-program-selected">
            <div className="no-program-icon">🚫</div>
            <h3>Acceso Denegado</h3>
            <p>No tienes los permisos necesarios para acceder a esta sección</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`programs-container ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="programs-header">
        <div className="header-content">
          <h1>Gestión de Programas</h1>
          <p>Crea y administra programas con sus efectos de sonido</p>
        </div>
        {canCreateProgram() && (
          <button className="new-program-btn" onClick={handleCreateProgram}>
            <FaPlus /> Nuevo Programa
          </button>
        )}
      </div>

      <div className="programs-content">
        {/* Lista de Programas */}
        <div className="programs-sidebar">
          <div className="programs-list-header">
            <h3><MdMusicNote /> Programas</h3>
            <p>Selecciona un programa para ver sus efectos</p>
          </div>

          <div className="programs-list">
            {loading ? (
              <div className="loading-state">
                <p>Cargando programas...</p>
              </div>
            ) : programs && programs.length === 0 ? (
              <div className="empty-state">
                <p>
                  {user?.role === 'Operador' || user?.role === 'Productor'
                    ? 'No tienes programas asignados'
                    : 'No hay programas registrados'}
                </p>
              </div>
            ) : (
              programs && programs.map(program => (
                <div
                  key={program.id}
                  className={`program-item ${selectedProgram?.id === program.id ? 'selected' : ''}`}
                  onClick={() => handleSelectProgram(program)}
                >
                  <div className="program-info">
                    <h4>{program.name}</h4>
                    <p>{program.effects} Efecto/s</p>
                  </div>
                  <div className="program-actions">
                    <span className={`status-badge ${program.status?.toLowerCase()}`}>
                      {program.status === 'Active' ? 'Activo' : 'Inactivo'}
                    </span>
                    {canEditProgram(program) && (
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProgram(program);
                        }}
                      >
                        <FaEdit />
                      </button>
                    )}
                    {canToggleProgramStatus() && (
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProgramStatus(program.status.toLowerCase(), program.id);
                        }}
                      >
                        <FaPowerOff />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de Efectos */}
        <div className="effects-panel">
          {selectedProgram ? (
            <>
              <div className="effects-header">
                <div className="program-details">
                  <h2><FaHeadphones /> {selectedProgram.name}</h2>
                  <p>Efectos de sonido {selectedProgram.status === 'Active' ? 'activos' : 'inactivos'} predefinidos</p>
                </div>
                <span className={`status-badge ${selectedProgram.status.toLowerCase()}`}>
                  {selectedProgram.status === 'Active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="effects-grid">
                {loadingSounds ? (
                  <div className="loading-sounds">
                    <p>Cargando sonidos...</p>
                  </div>
                ) : !programSounds[selectedProgram.id] || programSounds[selectedProgram.id].length === 0 ? (
                  <div className="no-sounds">
                    <p>No hay sonidos en este programa</p>
                  </div>
                ) : (
                  programSounds[selectedProgram.id].map(sound => (
                    <div key={sound.id} className="sound-card">
                      <div className="sound-header">
                        <div className="sound-info">
                          <h4>{sound.name}</h4>
                          <span className="sound-duration">{sound.duration || 'N/A'}</span>
                        </div>
                        <div className="sound-actions">
                          <button
                            className={`btn-icon play ${isSoundPlaying(sound.id) ? 'playing' : ''
                              }`}
                            onClick={() => handlePlaySound(sound)}
                            title={
                              isSoundPlaying(sound.id)
                                ? 'Reproduciendo...'
                                : 'Reproducir'
                            }
                          >
                            <FaPlay />
                          </button>
                          {canEditSound(sound) && (
                            <button
                              className="btn-icon edit"
                              onClick={() => handleEditSound(sound)}
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                          )}
                          {canEditSound(sound) && (
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDeleteSound(sound.id)}
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="sound-category">{sound.category}</p>
                      {sound.description && (
                        <p className="sound-description">{sound.description}</p>
                      )}
                    </div>
                  ))
                )}

                {/* Botón para agregar nuevo sonido */}
                {canAddSound() && (
                  <div className="sound-card add-sound-card" onClick={handleAddSound}>
                    <div className="add-sound-content">
                      <div className="add-icon"><FaPlus /></div>
                      <p>Cargar Nuevo Sonido</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-program-selected">
              <div className="no-program-icon">🎵</div>
              <h3>Selecciona un programa</h3>
              <p>Elige un programa de la lista para ver y editar sus efectos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ProgramModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        program={editingProgram}
        onSave={handleSaveProgram}
      />

      <SoundModal
        isOpen={isSoundModalOpen}
        onClose={() => {
          setIsSoundModalOpen(false);
          setSelectedSound(null);
        }}
        onSave={handleSaveSound}
        sound={selectedSound}
      />

    </div>
  );
};

// Componente principal
const Programs = () => {
  return <ProgramsContent />;
};

export default Programs;