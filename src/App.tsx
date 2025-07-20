import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import Login from './pages/auth/login';
import Home from './pages/Home';
import Register from './pages/auth/registro';
import { ManualPage } from './pages/manual';
import CrearManualPage from './pages/CreateManualPage';
import Favorites from './pages/Favorites';
import PrivateRoute from './services/PrivateRoute';
import EditarManualPage from './pages/EditarManualPage';
import { DashboardPage } from './pages/AdminDashboard';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}

      <Routes>
        <Route path="/editar-manual/:id" element={<PrivateRoute element={<EditarManualPage />} />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/manual/:id" element={<ManualPage />} />
        <Route path="/crear-manual" element={<PrivateRoute element={<CrearManualPage />} />} />
        <Route path="/favorites" element={<PrivateRoute element={<Favorites />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
