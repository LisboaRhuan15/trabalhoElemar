import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Bem-vindo(a), {user.user_metadata?.nome ?? user.email}!</p>
      <ul>
        <li><Link to="/registros">Ver registros</Link></li>
        <li><Link to="/perfil">Meu perfil</Link></li>
      </ul>
    </section>
  );
}