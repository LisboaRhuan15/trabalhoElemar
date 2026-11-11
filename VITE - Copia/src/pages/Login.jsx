import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Quem já está logado não precisa ver o login
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (carregando) return; // impede envio repetido

    setErro(null);
    if (!email.trim() || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setCarregando(false);

    if (error) {
      setErro("Não foi possível entrar: " + error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <section className="form-box">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p>
        Não tem conta? <Link to="/registro">Criar conta</Link>
      </p>
    </section>
  );
}