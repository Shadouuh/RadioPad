import React from 'react';
import { FiMusic, FiUsers, FiClock, FiSettings } from 'react-icons/fi';
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';
import StatCard from './components/StatCard.jsx';
import ActivityCard from './components/ActivityCard.jsx';
import SystemStatusCard from './components/SystemStatusCard.jsx';
import './styles/Dashboard.css';
import axios from '../../shared/api/axios.js';
import useNotification from '../../shared/hooks/useNotification.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

const Dashboard = () => {
  const [serverStatus, setServerStatus] = useState({
    success: false,
    message: '',
    connection: false
  });
  const [time, setTime] = useState(new Date().toLocaleTimeString('es-ES', { hour12: false }));
  const [loading, setLoading] = useState(true);
  const notify = useNotification();
  const { isCollapsed } = useSidebar();
  const [dashboardData, setDashboardData] = useState({
    totalPrograms: 0,
    totalSounds: 0,
    totalUsers: 0,
    lastProgram: {
      name: '',
      time: ''
    },
    lastSound: {
      name: '',
      time: ''
    },
    lastUser: {
      name: '',
      time: ''
    }
  });

  // Obtener datos del dashboard al montar el componente
  useEffect(() => {
    fetchData();
    checkApi();
  }, []);

  useEffect(() => {
    if (!serverStatus.success) return;
    fetchData();
  }, [serverStatus.success]);

  // Actualizar cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      checkApi();
      setTime(new Date().toLocaleTimeString('es-ES', { hour12: false }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      if (!serverStatus.success) return;
      setLoading(true);
      const data = await axios.get('/dashboard/data');
      setDashboardData(data?.data.data || {});
    } catch (error) {
      notify(error?.message || 'Error al obtener los datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkApi = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/test');
      if (response.data?.success) {
        setServerStatus({
          success: true,
          message: response.data?.message || 'Servidor operativo',
          connection: true
        })
      }
    } catch (err) {
      console.error(err?.response?.data?.message || 'El servidor esta caido:', err);
      setServerStatus({
        success: false,
        message: err?.response?.data?.message || 'El servidor esta caido',
        connection: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Datos estáticos para las tarjetas de estadísticas
  const statsData = [
    {
      title: 'Programas Activos',
      value: dashboardData.totalPrograms,
      subtitle: '+2 desde la semana pasada',
      icon: FiMusic,
      iconColor: '#6b7280'
    },
    {
      title: 'FX Disponibles',
      value: dashboardData.totalSounds,
      subtitle: '+15 nuevos efectos',
      icon: FiSettings,
      iconColor: '#6b7280'
    },
    {
      title: 'Usuarios Conectados',
      value: dashboardData.totalUsers,
      subtitle: 'En línea ahora',
      icon: FiUsers,
      iconColor: '#6b7280'
    },
    {
      title: 'Ultima actualización',
      value: time,
      subtitle: 'Horas hoy',
      icon: FiClock,
      iconColor: '#6b7280'
    }
  ];

  // Datos estáticos para actividad reciente
  const recentActivities = [
    {
      text: 'Ultimo programa creado: ' + dashboardData.lastProgram.name || 'N/A',
      time: dashboardData.lastProgram.time || 'N/A'
    },
    {
      text: 'Nuevo FX agregado: ' + dashboardData.lastSound.name || 'N/A',
      time: dashboardData.lastSound.time || 'N/A'
    },
    {
      text: 'Nuevo usuario: ' + dashboardData.lastUser.name + ' creado',
      time: dashboardData.lastUser.time || 'N/A'
    }
  ];

  // Datos estáticos para estado del sistema
  const systemStatus = [
    {
      label: 'Servidor Principal',
      status: serverStatus.success ? 'operativo' : 'Desconectado'
    },
    {
      label: 'Base de Datos',
      status: serverStatus.connection ? 'operativo' : 'Desconectada'
    }
  ];

  return (
    <div className={`dashboard ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Bienvenido de vuelta, Jefe de Operadores</p>
        </div>
        <div className="dashboard-user-badge">
          Jefe de Operadores
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
            loading={loading}
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
            loading={loading}
          />
        </div>

        {/* System Status Card */}
        <div className="dashboard-status-section">
          <SystemStatusCard
            title="Estado del Sistema"
            subtitle="Información del sistema en tiempo real"
            statusItems={systemStatus}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;