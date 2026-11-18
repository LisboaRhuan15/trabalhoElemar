import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "../services/supabase";

export default function Listagem() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarRegistros() {
      const { data, error } = await supabase
        .from("jogos")
        .select("*");

      if (error) {
        setErro(error.message);
      } else {
        setRegistros(data);
      }
      setCarregando(false);
    }

    buscarRegistros();
  }, []);

  if (carregando) return <p>Carregando registros...</p>;
  if (erro) return <p>Erro ao consultar o Supabase: {erro}</p>;
  if (registros.length === 0) return <p>Nenhum registro cadastrado.</p>;

  return (
    <section>
      <h1>Registros</h1>
      <Link to="/registros/novo">+ Novo registro</Link>
      <ul className="lista">
        {registros.map((item) => (
          <li key={item.id}>
            <span>{item.nome}</span>
            <Link to={`/registros/${item.id}`}>Ver detalhes</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}