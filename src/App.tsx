// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BusquedaPage from "./pages/busqueda";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusquedaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
