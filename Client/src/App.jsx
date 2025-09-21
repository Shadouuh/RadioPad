// Rutas
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Notificaciones
import { ToastContainer } from "react-toastify";
// Layout
import Layout from './Layout.jsx';

// Paginas

// Provedor del usuario
import { UserProvider } from './contexts/UserContext.jsx';
import Home from "./pages/Home/Home.jsx";

function App() {
  return (
    <Router>
      <UserProvider>
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
        <Routes>
          {/* Rutas del Cliente */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} /> */}
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;