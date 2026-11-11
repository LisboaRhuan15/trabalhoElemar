import { useState } from "react";
import { Link } from "react-router";
import { supabase } from "../services/supabase";

export default function Registro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  function validar() {
    if (!nome.trim() || !email.trim() || !senha || !confirmacao) {
      return "Todos os campos são obrigatórios.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Informe um e-mail válido.";
    }
    if (senha.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres.";
    }
    if (senha !== confirmacao) {
      return "A confirmação de senha não corresponde à senha.";
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setCarregando(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });
    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    // Com confirmação de e-mail ligada, e-mail já cadastrado volta sem erro e sem identities
    if (data.user && data.user.identities?.length === 0) {
      setErro("Este e-mail já está cadastrado.");
      return;
    }

    if (data.session) {
      setMensagem("Cadastro realizado com sucesso! Você já está logado.");
    } else {
      setMensagem(
        "Cadastro realizado! Verifique seu e-mail e confirme o endereço antes de fazer login."
      );
    }

    setNome("");
    setEmail("");
    setSenha("");
    setConfirmacao("");
  }

  return (
    <section className="form-box">
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Nome completo
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        <label>
          Confirmar senha
          <input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
        </label>

        {erro && <p className="erro">{erro}</p>}
        {mensagem && <p className="sucesso">{mensagem}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}