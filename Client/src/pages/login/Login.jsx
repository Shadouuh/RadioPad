import React, { useState, useContext } from 'react';
import { FiWifi, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './styles/style.css';
import { UserContext } from '../../shared/contexts/UserContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleLogin({ email, password });
      // La navegación se maneja dentro del contexto
    } catch (error) {
      // El contexto ya maneja notificaciones; este catch es por seguridad
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUserClick = (userEmail) => {
    setEmail(userEmail);
    setPassword('1234');
  };

  const testUsers = [
    { email: 'admin@radiopad.com', role: 'Jefe de Operadores' },
    { email: 'operator@radiopad.com', role: 'Operador' },
    { email: 'productor@radiopad.com', role: 'Productor' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo y título */}
        <div className="login-header">
          <div className="login-logo">
            <FiWifi className="login-logo-icon" />
          </div>
          <h1 className="login-title">RadioPad</h1>
          <p className="login-subtitle">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Campo Email */}
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <FiMail />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="usuario@radiopad.com"
                required
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Contraseña
            </label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <FiLock />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input login-input-password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="login-password-toggle-icon" />
                ) : (
                  <FiEye className="login-password-toggle-icon" />
                )}
              </button>
            </div>
          </div>

          {/* Botón de login */}
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Usuarios de prueba */}
        <div className="login-test-users">
          <h3 className="login-test-users-title">Usuarios de prueba:</h3>
          <div className="login-test-users-list">
            {testUsers.map((user, index) => (
              <div key={index} className="login-test-user">
                <span 
                  className="login-test-user-email"
                  onClick={() => handleTestUserClick(user.email)}
                >
                  {user.email}
                </span>
                <span className="login-test-user-role">({user.role})</span>
              </div>
            ))}
          </div>
          <div className="login-forgot-password">
            <button className="login-forgot-password-link" onClick={() => navigate('/')}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;