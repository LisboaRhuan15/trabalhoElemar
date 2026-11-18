import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../services/supabase";

export default function Detalhes() {
  const { id } = useParams();
  const [registro, setRegistro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarRegistro() {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from("jogos")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setErro(error.message);
      } else {
        setRegistro(data);
      }
      setCarregando(false);
    }

    buscarRegistro();
  }, [id]);

  if (carregando) return <p>Carregando registro...</p>;
  if (erro) return <p>Erro ao consultar o Supabase: {erro}</p>;

  if (!registro) {
    return (
      <section>
        <p>Registro não encontrado.</p>
        <Link to="/registros">Voltar para a listagem</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Detalhes do registro</h1>
      {Object.entries(registro).map(([chave, valor]) => (
        <p key={chave}>
          <strong>{chave}:</strong> {String(valor)}
        </p>
      ))}
      <Link to="/registros">Voltar para a listagem</Link>
    </section>
  );
}