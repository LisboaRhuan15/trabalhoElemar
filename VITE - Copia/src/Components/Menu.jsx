import { Link } from "react-router";

export default function Menu() {
  return (
    <nav className="menu">
      <Link to="/">Início</Link>
      <Link to="/registros">Registros</Link>
    </nav>
  );
}