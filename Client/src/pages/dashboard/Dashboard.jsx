import React from 'react';
import { FiMusic, FiUsers, FiClock, FiSettings } from 'react-icons/fi';
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';
import StatCard from './components/StatCard.jsx';
import ActivityCard from './components/ActivityCard.jsx';
import SystemStatusCard from './components/SystemStatusCard.jsx';
import './styles/Dashboard.css';

const Dashboard = () => {
  const { isCollapsed } = useSidebar();
  // Datos estáticos para las tarjetas de estadísticas
  const statsData = [
    {
      title: 'Programas Activos',
      value: '12',
      subtitle: '+2 desde la semana pasada',
      icon: FiMusic,
      iconColor: '#6b7280'
    },
    {
      title: 'FX Disponibles',
      value: '248',
      subtitle: '+15 nuevos efectos',
      icon: FiSettings,
      iconColor: '#6b7280'
    },
    {
      title: 'Usuarios Conectados',
      value: '8',
      subtitle: 'En línea ahora',
      icon: FiUsers,
      iconColor: '#6b7280'
    },
    {
      title: 'Tiempo al Aire',
      value: '14:32',
      subtitle: 'Horas hoy',
      icon: FiClock,
      iconColor: '#6b7280'
    }
  ];

  // Datos estáticos para actividad reciente
  const recentActivities = [
    {
      text: 'Programa "Mañana Radial" iniciado',
      time: 'Hace 5 minutos'
    },
    {
      text: 'Nuevo FX agregado: "Intro Noticias"',
      time: 'Hace 15 minutos'
    },
    {
      text: 'Usuario "Operador2" conectado',
      time: 'Hace 1 hora'
    }
  ];

  // Datos estáticos para estado del sistema
  const systemStatus = [
    {
      label: 'Servidor Principal',
      status: 'Operativo'
    },
    {
      label: 'Base de Datos',
      status: 'Conectada'
    },
    {
      label: 'Streaming',
      status: 'En Vivo'
    },
    {
      label: 'Almacenamiento',
      status: '78% Usado',
      usage: '78% Usado'
    }
  ];

  return (
    <div className={`dashboard ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Bienvenido de vuelta, Jefe de Operaciones</p>
        </div>
        <div className="dashboard-user-badge">
          Jefe de Operaciones
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Content Grid */}
      <div className="dashboard-content-grid">
        {/* Activity Card */}
        <div className="dashboard-activity-section">
          <ActivityCard
            title="Actividad Reciente"
            subtitle="Últimas acciones en el sistema"
            activities={recentActivities}
          />
        </div>

        {/* System Status Card */}
        <div className="dashboard-status-section">
          <SystemStatusCard
            title="Estado del Sistema"
            subtitle="Información del sistema en tiempo real"
            statusItems={systemStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;