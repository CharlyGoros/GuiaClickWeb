// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import Login from './pages/auth/login';
import Home from './pages/Home';
import Register from './pages/auth/registro';
// import Register from './pages/auth/register';
// import BusquedaPage from './pages/busqueda';
// import Configuracion from './pages/configuracion';

const App: React.FC = () => {
  const { user } = useAuth();
  console.log('User:', user);
  return (
    <Router>
      {/* Navbar solo si hay user */}
      {user && <Navbar />}

      <Routes>
        {/* Registro */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />

        {/* No logueado → Login; logueado → Home */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Registro */}
        <Route
          path="/register"
          element={<Register />}
        />
        {/* Rutas privadas */}
        {/* <Route
          path="/"
          element={user ? <BusquedaPage /> : <Navigate to="/login" replace />}
        /> */}
        {/* <Route
          path="/configuracion"
          element={user ? <Configuracion /> : <Navigate to="/login" replace />}
        /> */}

        {/* Cualquier otra → si logueado va a Home, si no a Login */}
        <Route
          path="*"
          element={<Navigate to={user ? '/' : '/login'} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
