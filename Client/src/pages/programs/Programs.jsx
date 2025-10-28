import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaTimes, FaHeadphones } from 'react-icons/fa';
import { MdMusicNote } from 'react-icons/md';
import ProgramModal from './modals/ProgramModal.jsx';
import SoundModal from './modals/SoundModal.jsx';
import './styles/programs.css';
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';
import ProgramService from '../../shared/services/ProgramService.js';
import useNotification from '../../shared/hooks/useNotification';

const Programs = () => {
  const { isCollapsed } = useSidebar();
  const notify = useNotification();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [playProgress, setPlayProgress] = useState({});
  const [programSounds, setProgramSounds] = useState({});
  const [loadingSounds, setLoadingSounds] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);

  // Cargar programas al montar el componente
  useEffect(() => {
    loadPrograms();
  }, []);

  // Cargar sonidos cuando se selecciona un programa
  useEffect(() => {
    if (selectedProgram && selectedProgram.id) {
      loadProgramSounds(selectedProgram.id);
    }
  }, [selectedProgram]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const response = await ProgramService.getAllPrograms();
      if (response.success) {
        setPrograms(response.data);
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
    setEditingProgram(null);
    setIsProgramModalOpen(true);
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = async (programData) => {
    try {
      let response;
      if (editingProgram) {
        response = await ProgramService.updateProgram(editingProgram.id, programData);
      } else {
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
    setIsSoundModalOpen(true);
  };

  const handleSaveSound = async (soundData) => {
    try {
      let response;
      if (soundData.id) {
        // Actualizar sonido existente
        response = await ProgramService.updateProgramSound( soundData.id, soundData);
      } else {
        // Crear nuevo sonido
        response = await ProgramService.createProgramSound(selectedProgram.id, soundData);
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

  const playSound = (sound) => {
    if (playingSound === sound.id) {
      // Pausar sonido
      setPlayingSound(null);
      setPlayProgress(prev => ({ ...prev, [sound.id]: 0 }));
    } else {
      // Reproducir sonido
      setPlayingSound(sound.id);
      
      // Simular progreso de reproducción
      const duration = parseInt(sound.duration) || 10;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setPlayProgress(prev => ({ ...prev, [sound.id]: (progress / duration) * 100 }));
        
        if (progress >= duration) {
          clearInterval(interval);
          setPlayingSound(null);
          setPlayProgress(prev => ({ ...prev, [sound.id]: 0 }));
        }
      }, 1000);
    }
    
    console.log('Reproduciendo sonido:', sound.name);
  };

  const handleEditSound = (sound) => {
    setSelectedSound(sound);
    setIsSoundModalOpen(true);
  };

  const handlePlaySound = (sound) => {
    playSound(sound);
  };

  return (
    <div className={`programs-container ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="programs-header">
        <div className="header-content">
          <h1>Gestión de Programas</h1>
          <p>Crea y administra programas con sus efectos de sonido</p>
        </div>
        <button className="new-program-btn" onClick={handleCreateProgram}>
          <FaPlus /> Nuevo Programa
        </button>
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
                <p>No hay programas registrados</p>
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
                    <button 
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProgram(program);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProgramStatus(program.status.toLowerCase(), program.id);
                      }}
                    >
                      🥟
                    </button>
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
                            className="btn-icon play"
                            onClick={() => handlePlaySound(sound)}
                            title="Reproducir"
                          >
                            {playingSound === sound.id ? <FaPause /> : <FaPlay />}
                          </button>
                          <button 
                            className="btn-icon edit"
                            onClick={() => handleEditSound(sound)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-icon delete"
                            onClick={() => handleDeleteSound(sound.id)}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="sound-category">{sound.category}</p>
                      {sound.description && (
                        <p className="sound-description">{sound.description}</p>
                      )}
                      {playingSound === sound.id && (
                        <div className="sound-progress">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${playProgress[sound.id] || 0}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {/* Botón para agregar nuevo sonido */}
                <div className="sound-card add-sound-card" onClick={handleAddSound}>
                  <div className="add-sound-content">
                    <div className="add-icon"><FaPlus /></div>
                    <p>Cargar Nuevo Sonido</p>
                  </div>
                </div>
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

export default Programs;