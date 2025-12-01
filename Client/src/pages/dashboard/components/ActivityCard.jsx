import React from 'react';
import { FiActivity } from 'react-icons/fi';
import './styles/ActivityCard.css';

const ActivityCard = ({ title, subtitle, activities = [] }) => {
  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <div className="activity-card-title-section">
          <FiActivity size={20} className="activity-card-icon" />
          <h3 className="activity-card-title">{title}</h3>
        </div>
        {subtitle && (
          <p className="activity-card-subtitle">{subtitle}</p>
        )}
      </div>
      
      <div className="activity-card-content">
        {activities.length > 0 ? (
          <ul className="activity-list">
            {activities.map((activity, index) => (
              <li key={index} className="activity-item">
                <div className="activity-item-content">
                  <span className="activity-item-text">{activity.text}</span>
                  <span className="activity-item-time">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="activity-empty">
            <p>No hay actividad reciente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;