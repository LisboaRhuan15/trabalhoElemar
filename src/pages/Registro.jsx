import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { supabase } from "../services/supabase";
import { registroSchema } from "../schemas/registroSchema";
import { traduzirErroAuth } from "../utils/errosSupabase";

export default function Registro() {
  const [sucesso, setSucesso] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registroSchema),
    mode: "onTouched",
    defaultValues: { nome: "", email: "", senha: "", confirmacao: "" },
  });

  async function onSubmit({ nome, email, senha }) {
    setSucesso(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });

    if (error) {
      const { campo, mensagem } = traduzirErroAuth(error, "cadastro");
      if (campo) {
        setError(campo, { type: "server", message: mensagem });
      } else {
        setError("root.serverError", { type: "server", message: mensagem });
      }
      return;
    }

   
    if (data.user && data.user.identities?.length === 0) {
      setError("email", {
        type: "server",
        message: "Este e-mail já está cadastrado.",
      });
      return;
    }

    setSucesso(
      data.session
        ? "Cadastro realizado com sucesso! Você já está logado."
        : "Cadastro realizado! Verifique seu e-mail e confirme o endereço antes de entrar."
    );
    reset();
  }

  return (
    <section className="form-box">
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          Nome completo
          <input {...register("nome")} />
          {errors.nome && <span className="erro">{errors.nome.message}</span>}
        </label>

        <label>
          E-mail
          <input type="email" {...register("email")} />
          {errors.email && <span className="erro">{errors.email.message}</span>}
        </label>

        <label>
          Senha
          <input type="password" {...register("senha")} />
          {errors.senha && <span className="erro">{errors.senha.message}</span>}
        </label>

        <label>
          Confirmar senha
          <input type="password" {...register("confirmacao")} />
          {errors.confirmacao && (
            <span className="erro">{errors.confirmacao.message}</span>
          )}
        </label>

        {errors.root?.serverError && (
          <p className="erro">{errors.root.serverError.message}</p>
        )}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}