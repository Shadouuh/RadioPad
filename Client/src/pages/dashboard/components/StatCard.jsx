import React from 'react';
import './styles/StatCard.css';

const StatCard = ({ title, value, subtitle, icon: Icon, iconColor = '#6b7280', loading = true }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-title-section">
          <h3 className="stat-card-title">{title}</h3>
          {Icon && (
            <div className="stat-card-icon" style={{ color: iconColor }}>
              <Icon size={20} />
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="stat-card-loading">
          cargando... 🥟
        </div>
      )}

      <div className="stat-card-content">
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;