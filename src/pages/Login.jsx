import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../schemas/loginSchema";
import { traduzirErroAuth } from "../utils/errosSupabase";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", senha: "" },
  });

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  async function onSubmit({ email, senha }) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      const { campo, mensagem } = traduzirErroAuth(error, "login");
      if (campo) {
        setError(campo, { type: "server", message: mensagem });
      } else {
        setError("root.serverError", { type: "server", message: mensagem });
      }
      return;
    }

    navigate("/dashboard");
  }

  return (
    <section className="form-box">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

        {errors.root?.serverError && (
          <p className="erro">{errors.root.serverError.message}</p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p>
        Não tem conta? <Link to="/registro">Criar conta</Link>
      </p>
    </section>
  );
}