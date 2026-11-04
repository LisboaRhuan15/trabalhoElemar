import { Routes, Route } from "react-router";
import Menu from "./Components/Menu";
import Inicio from "./pages/Inicio";
import Listagem from "./pages/Listagem";
import Detalhes from "./pages/Detalhes";
import "./App.css";

export default function App() {
  return (
    <>
      <Menu />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registros" element={<Listagem />} />
          <Route path="/registros/:id" element={<Detalhes />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Routes>
      </main>
    </>
  );
}