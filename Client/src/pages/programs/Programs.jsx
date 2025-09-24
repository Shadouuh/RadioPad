import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaTimes, FaHeadphones } from 'react-icons/fa';
import { MdMusicNote } from 'react-icons/md';
import ProgramModal from './modals/ProgramModal.jsx';
import SoundModal from './modals/SoundModal.jsx';
import './styles/programs.css';
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';

const Programs = () => {
  const { isCollapsed } = useSidebar();
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: 'FX Institucionales',
      description: 'Efectos de sonido institucionales predefinidos',
      status: 'Active',
      effects: 4,
      sounds: [
        { id: 1, name: 'ID Estación', duration: '10s', category: 'Institucional' },
        { id: 2, name: 'Hora Oficial', duration: '5s', category: 'Institucional' },
        { id: 3, name: 'Identificación Legal', duration: '8s', category: 'Institucional' },
        { id: 4, name: 'Cortina Noticias', duration: '12s', category: 'Institucional' }
      ]
    },
    {
      id: 2,
      name: 'Programa Matutino',
      description: 'Efectos y música para el programa matutino',
      status: 'Active',
      effects: 4,
      sounds: [
        { id: 5, name: 'Intro Matutino', duration: '15s', category: 'Música' },
        { id: 6, name: 'Transición', duration: '3s', category: 'Efectos' },
        { id: 7, name: 'Jingle Comercial', duration: '8s', category: 'Jingles' },
        { id: 8, name: 'Outro', duration: '10s', category: 'Música' }
      ]
    },
    {
      id: 3,
      name: 'Noticiero Vespertino',
      description: 'Sonidos para el noticiero de la tarde',
      status: 'Inactive',
      effects: 4,
      sounds: [
        { id: 9, name: 'Breaking News', duration: '6s', category: 'Efectos' },
        { id: 10, name: 'Cortina Deportes', duration: '7s', category: 'Música' },
        { id: 11, name: 'Clima Intro', duration: '4s', category: 'Efectos' },
        { id: 12, name: 'Cierre Noticiero', duration: '12s', category: 'Música' }
      ]
    }
  ]);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [playProgress, setPlayProgress] = useState({});

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setIsProgramModalOpen(true);
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = (programData) => {
    if (editingProgram) {
      // Editar programa existente
      setPrograms(prev => prev.map(p => 
        p.id === editingProgram.id 
          ? { ...p, ...programData }
          : p
      ));
    } else {
      // Crear nuevo programa
      const newProgram = {
        id: Date.now(),
        ...programData,
        effects: 0,
        sounds: []
      };
      setPrograms(prev => [...prev, newProgram]);
    }
  };

  const handleDeleteProgram = (programId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este programa?')) {
      setPrograms(prev => prev.filter(p => p.id !== programId));
      if (selectedProgram && selectedProgram.id === programId) {
        setSelectedProgram(null);
      }
    }
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
  };

  const handleAddSound = () => {
    setIsSoundModalOpen(true);
  };

  const handleSaveSound = (soundData) => {
    if (selectedProgram) {
      const newSound = {
        id: Date.now(),
        name: soundData.name,
        duration: soundData.duration || 'N/A',
        category: soundData.category,
        description: soundData.description,
        file: soundData.file
      };

      setPrograms(prev => prev.map(p => 
        p.id === selectedProgram.id 
          ? { 
              ...p, 
              sounds: [...p.sounds, newSound],
              effects: p.sounds.length + 1
            }
          : p
      ));

      // Actualizar el programa seleccionado
      setSelectedProgram(prev => ({
        ...prev,
        sounds: [...prev.sounds, newSound],
        effects: prev.sounds.length + 1
      }));
    }
  };

  const handleDeleteSound = (soundId) => {
    if (selectedProgram && window.confirm('¿Estás seguro de que quieres eliminar este sonido?')) {
      setPrograms(prev => prev.map(p => 
        p.id === selectedProgram.id 
          ? { 
              ...p, 
              sounds: p.sounds.filter(s => s.id !== soundId),
              effects: p.sounds.length - 1
            }
          : p
      ));

      setSelectedProgram(prev => ({
        ...prev,
        sounds: prev.sounds.filter(s => s.id !== soundId),
        effects: prev.sounds.length - 1
      }));
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
            {programs.map(program => (
              <div 
                key={program.id} 
                className={`program-item ${selectedProgram?.id === program.id ? 'selected' : ''}`}
                onClick={() => handleSelectProgram(program)}
              >
                <div className="program-info">
                  <h4>{program.name}</h4>
                  <p>{program.effects} efectos</p>
                </div>
                <div className="program-actions">
                  <span className={`status-badge ${program.status.toLowerCase()}`}>
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
                      handleDeleteProgram(program.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
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
                {selectedProgram.sounds.map(sound => (
                  <div key={sound.id} className="sound-card">
                    <div className="sound-header">
                      <div className="play-button-container">
                        <button 
                          className={`play-btn ${playingSound === sound.id ? 'playing' : ''}`}
                          onClick={() => playSound(sound)}
                        >
                          {playingSound === sound.id ? <FaPause /> : <FaPlay />}
                        </button>
                        {playingSound === sound.id && (
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${playProgress[sound.id] || 0}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="sound-info">
                        <h4>{sound.name}</h4>
                        <span className="sound-duration">{sound.duration}</span>
                      </div>
                      <button 
                        className="delete-sound-btn"
                        onClick={() => handleDeleteSound(sound.id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="sound-footer">
                      <span className={`category-badge ${sound.category.toLowerCase()}`}>
                        {sound.category}
                      </span>
                    </div>
                  </div>
                ))}
                
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
        onClose={() => setIsSoundModalOpen(false)}
        onSave={handleSaveSound}
      />
    </div>
  );
};

export default Programs;