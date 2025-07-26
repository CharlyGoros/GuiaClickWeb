import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';

import Login from './pages/Auth/login';
import Register from './pages/Auth/registro';
import Home from './pages/Home';
import { ManualPage } from './pages/manual';
import CrearManualPage from './pages/CreateManualPage';
import EditarManualPage from './pages/EditarManualPage';
import Favorites from './pages/Favorites';
import PrivateRoute from './services/PrivateRoute';
import CrearEmpresa from './pages/CrearEmpresa';
import EmpresaEditarPage from './pages/EditarEmpresaPage';
import SuperadminEmpresas from './pages/SuperAdminEmpresas';
import UsersListPage from './pages/UserListPage';
import ManualsListPage from './pages/ManualListPage';
import DashboardEmpresasPage from './pages/DashboardEmpresas';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/registro" element={!user ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/manual/:id" element={<ManualPage />} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/favorites" element={<PrivateRoute element={<Favorites />} />} />
        <Route path="/crear-manual" element={<PrivateRoute element={<CrearManualPage />} />} />
        <Route path="/editar-manual/:id" element={<PrivateRoute element={<EditarManualPage />} />} />

        {/* Empresa management */}
        <Route path="/crear-empresa" element={<PrivateRoute element={<CrearEmpresa />} />} />
        <Route path="/editar-empresa" element={<PrivateRoute element={<EmpresaEditarPage />} />} />

        {/* Dashboard sub-routes */}
        <Route path="/dashboard/users" element={<PrivateRoute element={<UsersListPage />} />} />
        <Route path="/dashboard/manuals" element={<PrivateRoute element={<ManualsListPage />} />} />
        <Route path="/dashboard/empresas" element={<PrivateRoute element={<DashboardEmpresasPage />} />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/users" replace />} />

        {/* Legacy superadmin route */}
        <Route path="/editar-empresa-admin" element={<PrivateRoute element={<SuperadminEmpresas />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
