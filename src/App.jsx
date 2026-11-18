import { Routes, Route } from "react-router";
import Menu from "./Components/Menu";
import ProtectedRoute from "./Components/ProtectedRoute";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Listagem from "./pages/Listagem";
import Detalhes from "./pages/Detalhes";
import Perfil from "./pages/Perfil";
import Pagina404 from "./pages/Pagina404";
import "./App.css";
import NovoRegistro from "./pages/NovoRegistro";

export default function App() {
  return (
    <>
      <Menu />
      <main>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registros" element={<Listagem />} />
            <Route path="/registros/novo" element={<NovoRegistro />} />
            <Route path="/registros/:id" element={<Detalhes />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </>
  );
}