import React, { useState, useRef, useEffect } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useSidebar } from '../contexts/SidebarContext';
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX, 
  FiX,
  FiMusic
} from 'react-icons/fi';
import './styles/GlobalAudioPlayer.css';

const GlobalAudioPlayer = () => {
  const {
    isVisible,
    isPlaying,
    currentSound,
    currentTime,
    duration,
    volume,
    isMuted,
    loading,
    pause,
    resume,
    seekTo,
    changeVolume,
    toggleMute,
    closePlayer,
    formatTime
  } = useAudioPlayer();

  const { isCollapsed } = useSidebar();
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressBarRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const truncate = (str = '', max = 15) => {
    if (!str) return '';
    return str.length > max ? `${str.slice(0, max)}...` : str;
  };

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manejar clic en la barra de progreso
  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
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
    changeVolume(newVolume);
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

  if (!isVisible || !currentSound) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const sidebarWidth = isCollapsed ? 80 : 280;
  const isSidebarMobileMode = viewportWidth <= 650;
  const displayName = viewportWidth <= 650 
    ? truncate(currentSound.sound_name, 15) 
    : (currentSound.sound_name || 'Audio');

  return (
    <div 
      className="global-audio-player"
      style={{ left: isSidebarMobileMode ? 0 : `${sidebarWidth}px` }}
    >
      {/* Información del sonido */}
      <div className="player-info">
        <div className="sound-icon">
          <FiMusic />
        </div>
        <div className="sound-details">
          <h4 className="sound-name">{displayName}</h4>
          <p className="sound-description">
            {currentSound.description || 'Sonido institucional'}
          </p>
        </div>
      </div>

      {/* Controles principales */}
      <div className="player-controls">
        {/* Botón de play/pause */}
        <button
          className={`control-button play-pause-btn ${loading ? 'loading' : ''}`}
          onClick={isPlaying ? pause : resume}
          disabled={loading}
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {loading ? (
            <div className="loading-spinner-small"></div>
          ) : isPlaying ? (
            <FiPause />
          ) : (
            <FiPlay />
          )}
        </button>

        {/* Tiempo y barra de progreso */}
        <div className="progress-section">
          <div className="time-display-combined">
            {formatTime(currentTime)}/{formatTime(duration)}
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
            onClick={toggleMute}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
          </button>

          {showVolumeSlider && (
            <div className="volume-slider-container vertical">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider vertical"
                orient="vertical"
              />
              <div className="volume-percentage-display">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón de cerrar */}
      <button
        className="control-button close-btn"
        onClick={closePlayer}
        title="Cerrar reproductor"
      >
        <FiX />
      </button>
    </div>
  );
};

export default GlobalAudioPlayer;