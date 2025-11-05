import React, { useState, useRef, useEffect } from 'react';
import { useMultiAudioPlayer } from '../contexts/MultiAudioPlayerContext';
import { useSidebar } from '../contexts/SidebarContext';
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX, 
  FiX,
  FiMusic
} from 'react-icons/fi';
import './styles/MultiAudioPlayer.css';

const SinglePlayer = ({ playerId, player, index }) => {
  const {
    pausePlayer,
    resumePlayer,
    seekTo,
    changeVolume,
    toggleMute,
    closePlayer,
    formatTime
  } = useMultiAudioPlayer();

  const { isCollapsed } = useSidebar();
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressBarRef = useRef(null);
  const volumeSliderRef = useRef(null);

  // Manejar clic en la barra de progreso
  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !player.duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * player.duration;
    
    seekTo(playerId, newTime);
  };

  // Manejar arrastre en la barra de progreso
  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e) => {
    if (!isDragging) return;
    handleProgressClick(e);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  // Manejar cambio de volumen
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(playerId, newVolume);
  };

  // Efectos para manejar eventos globales
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging]);

  // Cerrar slider de volumen al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    if (showVolumeSlider) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showVolumeSlider]);

  if (!player.isVisible || !player.currentSound) {
    return null;
  }

  const progressPercentage = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;
  const sidebarWidth = isCollapsed ? 80 : 280;

  return (
    <div 
      className={`multi-audio-player player-position-${index}`}
      style={{ 
        left: `${sidebarWidth}px`,
        bottom: `${player.bottomOffset || 0}px`,
        zIndex: player.zIndex
      }}
    >
      {/* Información del sonido */}
      <div className="player-info">
        <div className="sound-icon">
          <FiMusic />
        </div>
        <div className="sound-details">
          <h4 className="sound-name">{player.currentSound.sound_name || player.currentSound.name}</h4>
          <p className="sound-description">
            {player.currentSound.description || player.currentSound.category || 'Sonido'}
          </p>
        </div>
      </div>

      {/* Controles principales */}
      <div className="player-controls">
        {/* Botón de play/pause */}
        <button
          className={`control-button play-pause-btn ${player.loading ? 'loading' : ''}`}
          onClick={player.isPlaying ? () => pausePlayer(playerId) : () => resumePlayer(playerId)}
          disabled={player.loading}
          title={player.isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {player.loading ? (
            <div className="loading-spinner-small"></div>
          ) : player.isPlaying ? (
            <FiPause />
          ) : (
            <FiPlay />
          )}
        </button>

        {/* Tiempo y barra de progreso */}
        <div className="progress-section">
          <div className="time-display-combined">
            {formatTime(player.currentTime)}/{formatTime(player.duration)}
          </div>
          
          <div 
            className="progress-bar-container"
            ref={progressBarRef}
            onMouseDown={handleProgressMouseDown}
          >
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
              <div 
                className="progress-thumb"
                style={{ left: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controles de volumen */}
        <div 
          className="volume-controls"
          ref={volumeSliderRef}
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            className="control-button volume-btn"
            onClick={() => toggleMute(playerId)}
            title={player.isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {player.isMuted || player.volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
          </button>

          {showVolumeSlider && (
            <div className="volume-slider-container vertical">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={player.isMuted ? 0 : player.volume}
                onChange={handleVolumeChange}
                className="volume-slider vertical"
                orient="vertical"
              />
              <div className="volume-percentage-display">
                {Math.round((player.isMuted ? 0 : player.volume) * 100)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón de cerrar */}
      <button
        className="control-button close-btn"
        onClick={() => closePlayer(playerId)}
        title="Cerrar reproductor"
      >
        <FiX />
      </button>
    </div>
  );
};

const MultiAudioPlayer = () => {
  const { players } = useMultiAudioPlayer();

  // Convertir el Map a array y ordenar por zIndex (más recientes arriba)
  const playersArray = Array.from(players.entries()).sort(
    ([, a], [, b]) => b.zIndex - a.zIndex
  );

  return (
    <>
      {playersArray.map(([playerId, player], index) => (
        <SinglePlayer 
          key={playerId} 
          playerId={playerId} 
          index={index}
          player={{
            ...player,
            // Ajustar la posición vertical basada en el índice desde la parte inferior
            bottomOffset: index * 90 // 90px de altura por reproductor
          }}
        />
      ))}
    </>
  );
};

export default MultiAudioPlayer;