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
import CrearEmpresa from './pages/CrearEmpresa';
import EmpresaEditarPage from './pages/EditarEmpresaPage';
import SuperadminEmpresas from './pages/SuperAdminEmpresas';

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
        <Route path="/crear-empresa" element={<PrivateRoute element={<CrearEmpresa />} />} />
        <Route path="/editar-empresa" element={<PrivateRoute element={<EmpresaEditarPage />} />} />
        <Route path="/editar-empresa-admin" element={<PrivateRoute element={<SuperadminEmpresas />} />} />
      </Routes>
    </Router>
  );
};

export default App;
