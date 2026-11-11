import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Menu() {
  const { user, loading } = useAuth();

  return (
    <nav className="menu">
      <Link to="/">Início</Link>

      {!loading && user && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/registros">Registros</Link>
          <Link to="/perfil">Perfil</Link>
        </>
      )}

      {!loading && !user && (
        <>
          <Link to="/login">Entrar</Link>
          <Link to="/registro">Criar conta</Link>
        </>
      )}
    </nav>
  );
}