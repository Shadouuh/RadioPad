import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";
import { UserProvider } from './shared/contexts/UserContext.jsx';
import { SidebarProvider, useSidebar } from './shared/contexts/SidebarContext.jsx';
import { MultiAudioPlayerProvider } from './shared/contexts/MultiAudioPlayerContext.jsx';
import Login from './pages/login/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Users from './pages/users/Users.jsx';
import Programs from './pages/programs/Programs.jsx';
import Settings from './pages/settings/Settings.jsx';
import InstitutionalSounds from './pages/sounds/InstitutionalSounds.jsx';
import Sidebar from './shared/components/Sidebar.jsx';
import MultiAudioPlayer from './shared/components/MultiAudioPlayer.jsx';
import SplashScreen from './shared/components/SplashScreen.jsx';

const AppContent = () => {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const isLoginPage = location.pathname === '/';
  const [showSplash, setShowSplash] = useState(true);

  // Mostrar pantalla de carga por 2 segundos en cada cambio de ruta
  useEffect(() => {
    setShowSplash(true);
    const t = setTimeout(() => setShowSplash(false), 750);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app-container">
      {showSplash && <SplashScreen />}
      {!isLoginPage && <Sidebar />}
      <main className={`main-content ${!isLoginPage ? (isCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar') : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sounds/institutional" element={<InstitutionalSounds />} />
        </Routes>
      </main>
      {!isLoginPage && <MultiAudioPlayer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <UserProvider>
        <SidebarProvider>
          <MultiAudioPlayerProvider>
            <ToastContainer
              position="top-left"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              limit={3}
              pauseOnFocusLoss
              pauseOnHover />
            <AppContent />
          </MultiAudioPlayerProvider>
        </SidebarProvider>
      </UserProvider>
    </Router>
  );
}

export default App;