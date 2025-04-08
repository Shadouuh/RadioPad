import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './assets/pages/Home.jsx'; 
import LoginForm from './assets/pages/LoginForm.jsx'; 

const App = () => {
  const isAuth = false;
  return (
    <Router>
      <header></header>
      <main>
        <Routes>
          <Route path="/" element={isAuth ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!isAuth ? <LoginForm /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <footer></footer>
    </Router>
  );
};

export default App;
