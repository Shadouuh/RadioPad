import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaMusic } from 'react-icons/fa';
import './styles/SoundModal.css';

const SoundModal = ({ isOpen, onClose, onSave, sound }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    category: 'Efectos de ambiente'
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sound) {
      setFormData({
        name: sound.sound_name || '',
        description: sound.description || '',
        duration: sound.duration_seconds || '',
        category: sound.category || 'Efectos de ambiente'
      });
      setSelectedFile(null); // Para edición, no necesitamos archivo nuevo
    } else {
      setFormData({
        name: '',
        description: '',
        duration: '',
        category: 'Efectos de ambiente'
      });
      setSelectedFile(null);
    }
  }, [sound, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        if (!formData.name) {
          setFormData(prev => ({
            ...prev,
            name: file.name.replace(/\.[^/.]+$/, "")
          }));
        }
      } else {
        alert('Por favor, selecciona un archivo de audio válido.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        if (!formData.name) {
          setFormData(prev => ({
            ...prev,
            name: file.name.replace(/\.[^/.]+$/, "")
          }));
        }
      } else {
        alert('Por favor, selecciona un archivo de audio válido.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Para edición, no requerimos archivo nuevo
    if (!sound && !selectedFile) {
      alert('Por favor, selecciona un archivo de audio.');
      return;
    }
    
    const soundData = {
      ...formData,
      ...(sound && { id: sound.id }), // Incluir ID si estamos editando
      ...(selectedFile && { file: selectedFile }) // Solo incluir archivo si hay uno nuevo
    };
    
    onSave(soundData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      category: 'Efectos de ambiente'
    });
    setSelectedFile(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content sound-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{sound ? 'Editar Sonido' : 'Cargar Nuevo Sonido'}</h2>
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* File Upload Area - Solo mostrar para nuevos sonidos */}
            {!sound && (
              <div className="form-group">
                <label>Archivo de Audio</label>
                <div 
                  className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  
                  {selectedFile ? (
                    <div className="file-selected-info">
                      <div className="file-icon"><FaMusic /></div>
                      <div className="file-details">
                        <p className="file-name">{selectedFile.name}</p>
                        <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="file-upload-placeholder">
                      <div className="upload-icon">📁</div>
                      <p className="upload-text">
                        Arrastra y suelta tu archivo de audio aquí
                      </p>
                      <p className="upload-subtext">
                        o haz clic para seleccionar
                      </p>
                      <p className="upload-formats">
                        Formatos soportados: MP3, WAV, OGG, M4A
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Nombre del Sonido</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ingresa el nombre del sonido"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el sonido y su uso"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Música">Música</option>
                  <option value="Efectos">Efectos</option>
                  <option value="Jingles">Jingles</option>
                  <option value="Comerciales">Comerciales</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-button">
                {sound ? 'Actualizar Sonido' : 'Cargar Sonido'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoundModal;