import React from 'react';
import { FiWifi } from 'react-icons/fi';
import './styles/SystemStatusCard.css';

const SystemStatusCard = ({ title, subtitle, statusItems = [], loading = true }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'operativo':
        return '#10b981';
      case 'conectada':
        return '#3b82f6';
      case 'en vivo':
        return '#10b981';
      default:
        return '#f59e0b';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status.toLowerCase()) {
      case 'operativo':
        return '#d1fae5';
      case 'conectada':
        return '#dbeafe';
      case 'en vivo':
        return '#d1fae5';
      default:
        return '#fef3c7';
    }
  };

  return (
    <div className="system-status-card">
      <div className="system-status-header">
        <div className="system-status-title-section">
          <FiWifi size={20} className="system-status-icon" />
          <h3 className="system-status-title">{title}</h3>
        </div>
        {subtitle && (
          <p className="system-status-subtitle">{subtitle}</p>
        )}
      </div>


      {!loading && (
        <div className="system-status-content">
          {statusItems.length > 0 ? (
            <div className="status-list">
              {statusItems.map((item, index) => (
                <div key={index} className="status-item">
                  <div className="status-item-info">
                    <span className="status-item-label">{item.label}</span>
                    <span
                      className="status-item-badge"
                      style={{
                        color: getStatusColor(item.status),
                        backgroundColor: getStatusBgColor(item.status)
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  {item.usage && (
                    <div className="status-item-usage">
                      <span className="status-usage-text">{item.usage}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="status-empty">
              <p>No hay información del sistema disponible</p>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default SystemStatusCard;