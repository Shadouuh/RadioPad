import React from 'react';
import './styles/SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-overlay" aria-label="Pantalla de carga">
      <div className="splash-content">
        <div className="brand">
          <span className="brand-dot" />
          <h1 className="brand-title">RadioPad</h1>
        </div>
        <div className="spinner-complex">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
          <div className="orbit">
            <span className="orb orb-1" />
            <span className="orb orb-2" />
            <span className="orb orb-3" />
          </div>
        </div>
        <p className="loading-text">Cargando experiencia...</p>
      </div>
    </div>
  );
};

export default SplashScreen;