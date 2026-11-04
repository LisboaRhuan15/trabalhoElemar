import { Link } from "react-router";

export default function Inicio() {
  return (
    <section>
      <h1>Minha Aplicação</h1>
      <p>Aplicação React que integra React Router e Supabase.</p>
      <Link to="/registros">Ver registros</Link>
    </section>
  );
}