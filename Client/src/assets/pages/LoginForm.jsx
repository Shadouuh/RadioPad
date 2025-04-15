import { useState } from 'react';
import { LuUser } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { LuRadio } from "react-icons/lu";
import { LuAudioWaveform } from "react-icons/lu";
import { useAuth } from '../../context/AuthContext';
import './styles/loginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      console.error('Error de inicio de sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-container">
        <div className="login-form">
        <div className="login-header">
            <div className="logo">
                <LuRadio size={40}/>
            </div>
            <h1>RadioPad</h1>
            <h4>Sistema Profesional de Gestíon de Audio</h4>
        </div>
      <form onSubmit={handleSubmit}>
        <label>Usuario</label>
        <div className="input-container">
          <LuUser stroke="#54545c" size={14}/>
          <input 
            type="email" 
            placeholder="Ingresa tu correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <label>Contraseña</label>
        <div className="input-container">
          <LuLock stroke="#54545c" size={14}/>
          <input 
            type="password" 
            placeholder="Ingresa tu Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message-login">{error}</p>}
        <input 
          type="submit" 
          value={loading ? "Cargando..." : "Iniciar Sesión"} 
          className="login-btn" 
          disabled={loading}
        />
        <div className="little-text">
        <LuAudioWaveform/>
        <h4> Tecnologia de Audio Profesional</h4>
        </div>
        
      </form>
      </div>
    </section>
  );
};

export default LoginForm;
