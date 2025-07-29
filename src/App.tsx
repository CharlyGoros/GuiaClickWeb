import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
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
import Login from './pages/Auth/login';
import Register from './pages/Auth/registro';




const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const hideNavAndFooter = pathname === '/login' || pathname === '/registro';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/manual/:id" element={<ManualPage />} />

          {/* Protected routes */}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
