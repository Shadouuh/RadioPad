import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './assets/pages/Home.jsx'; 
import CompanyPad from './assets/pages/CompanyPad.jsx'; 
import Config from './assets/pages/Config.jsx';
import Library from './assets/pages/Library.jsx';
import Pads from './assets/pages/Pads.jsx';
import Programs from './assets/pages/Programs.jsx';
import Users from './assets/pages/Users.jsx';
import LoginForm from './assets/pages/LoginForm.jsx'; 
import Sidebar from './assets/components/Sidebar.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';

// Rutas para la Autenticacion y tal -- Thiago
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
      <div className="app-main-content">
        <aside>
            {isAuthenticated ? <Sidebar /> : null}
        </aside>
      <main>
        <Routes>
          {/* Si no esta Autenticado lleva al Formulario de Login -- Santi */}
          <Route path="/auth" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" />} />

          {/* En caso de Estar autenticado renderiza rutas -- Santi */}
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/programs" element={isAuthenticated ? <Programs /> : <Navigate to="/auth" />} />
          <Route path="/pads" element={isAuthenticated ? <Pads /> : <Navigate to="/auth" />} />
          <Route path="/library" element={isAuthenticated ? <Library /> : <Navigate to="/auth" />} />
          <Route path="/company-pad" element={isAuthenticated ? <CompanyPad /> : <Navigate to="/auth" />} />
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/auth" />} />
          <Route path="/configuration" element={isAuthenticated ? <Config /> : <Navigate to="/auth" />} />
        </Routes>
      </main>
      </div>
  );
};

// Rutas de como se va a ver (layout que no hizo santi 👎) -- Thiago
// Gogogogo -- Atte: Santi
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
