import { LuUser } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { LuRadio } from "react-icons/lu";
import { LuAudioWaveform } from "react-icons/lu";
// Estilos
import './styles/loginForm.css';
const LoginForm = () => {
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
      <form action="" method="POST">
        <label>Usuario</label>
        <div className="input-container">
          <LuUser stroke="#54545c" size={14}/>
          <input type="text" placeholder="Ingresa tu Usuario" />
        </div>
        <label>Contraseña</label>
        <div className="input-container">
          <LuLock stroke="#54545c" size={14}/>
          <input type="password" placeholder="Ingresa tu Contraseña" />
        </div>
        <input type="submit" value="Iniciar Sesion" className="login-btn"/>
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
