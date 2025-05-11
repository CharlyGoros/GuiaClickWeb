// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BusquedaPage from "./pages/busqueda";
import Registro from "./pages/registro";
import Login from "./pages/login";
import Configuracion from "./pages/configuracion";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusquedaPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </Router>
  );
}

export default App;
