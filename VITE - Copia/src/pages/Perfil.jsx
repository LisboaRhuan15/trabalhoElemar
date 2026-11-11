import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Perfil() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState(null);

  async function handleLogout() {
    const { error } = await signOut();
    if (error) {
      setErro("Erro ao encerrar a sessão: " + error.message);
      return;
    }
    navigate("/login");
  }

  return (
    <section>
      <h1>Meu Perfil</h1>
      <p><strong>Nome completo:</strong> {user.user_metadata?.nome ?? "Não informado"}</p>
      <p><strong>E-mail:</strong> {user.email}</p>
      <p><strong>Identificador:</strong> {user.id}</p>

      {erro && <p className="erro">{erro}</p>}

      <button onClick={handleLogout}>Sair</button>
    </section>
  );
}