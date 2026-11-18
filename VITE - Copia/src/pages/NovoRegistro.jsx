import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import { jogoSchema } from "../schemas/jogoSchema";
import { traduzirErroBanco } from "../utils/errosSupabase";

export default function NovoRegistro() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sucesso, setSucesso] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jogoSchema),
    mode: "onTouched",
    defaultValues: {
      nome: "",
      genero: "",
      ano_lancamento: "",
      preco: "",
      plataforma: "",
    },
  });

  async function onSubmit(dados) {
    setSucesso(null);

    const { error } = await supabase.from("jogos").insert({
      nome: dados.nome,
      genero: dados.genero,
      ano_lancamento: Number(dados.ano_lancamento),
      preco: Number(dados.preco.replace(",", ".")),
      plataforma: dados.plataforma,
      user_id: user.id,
    });

    if (error) {
      setError("root.serverError", {
        type: "server",
        message: traduzirErroBanco(error),
      });
      return;
    }

    setSucesso("Registro salvo com sucesso! Redirecionando...");
    reset();
    setTimeout(() => navigate("/registros"), 1500);
  }

  return (
    <section className="form-box">
      <h1>Novo registro</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          Nome
          <input {...register("nome")} />
          {errors.nome && <span className="erro">{errors.nome.message}</span>}
        </label>

        <label>
          Gênero
          <input {...register("genero")} />
          {errors.genero && <span className="erro">{errors.genero.message}</span>}
        </label>

        <label>
          Ano de lançamento
          <input inputMode="numeric" {...register("ano_lancamento")} />
          {errors.ano_lancamento && (
            <span className="erro">{errors.ano_lancamento.message}</span>
          )}
        </label>

        <label>
          Preço
          <input inputMode="decimal" {...register("preco")} />
          {errors.preco && <span className="erro">{errors.preco.message}</span>}
        </label>

        <label>
          Plataforma
          <input {...register("plataforma")} />
          {errors.plataforma && (
            <span className="erro">{errors.plataforma.message}</span>
          )}
        </label>

        {errors.root?.serverError && (
          <p className="erro">{errors.root.serverError.message}</p>
        )}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </form>
      <p>
        <Link to="/registros">Voltar para a listagem</Link>
      </p>
    </section>
  );
}