// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BusquedaPage from "./pages/busqueda";
import Registro from "./pages/registro";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusquedaPage />} />
        <Route path="/registro" element={<Registro />} />

      </Routes>
    </Router>
  );
}

export default App;
