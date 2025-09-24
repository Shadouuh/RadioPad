import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserProvider } from './shared/contexts/UserContext.jsx';
import { SidebarProvider, useSidebar } from './shared/contexts/SidebarContext.jsx';
import Login from './pages/login/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Users from './pages/users/Users.jsx';
import Programs from './pages/programs/Programs.jsx';
import Settings from './pages/settings/Settings.jsx';
import Sidebar from './shared/components/Sidebar.jsx';

const AppContent = () => {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const isLoginPage = location.pathname === '/';

  return (
    <div className="app-container">
      {!isLoginPage && <Sidebar />}
      <main className={`main-content ${!isLoginPage ? (isCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar') : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <UserProvider>
        <SidebarProvider>
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
        </SidebarProvider>
      </UserProvider>
    </Router>
  );
}

export default App;