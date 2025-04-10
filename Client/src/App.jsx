import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './assets/pages/Home.jsx'; 
import LoginForm from './assets/pages/LoginForm.jsx'; 
import { AuthProvider, useAuth } from './context/AuthContext';

// rutas para la autenticacion y tal
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <header></header>
      <main>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <footer></footer>
    </>
  );
};

// rutas de como se va a ver (layout que no hizo santi 👎)
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
