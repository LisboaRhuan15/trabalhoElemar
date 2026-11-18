import { z } from "zod";

export const registroSchema = z
  .object({
    nome: z.string().trim().min(1, "Informe o nome completo."),
    email: z
      .string()
      .min(1, "Informe o e-mail.")
      .email("Informe um e-mail válido."),
    senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
    confirmacao: z.string().min(1, "Confirme a senha."),
  })
  .refine((dados) => dados.senha === dados.confirmacao, {
    message: "A confirmação de senha não corresponde à senha.",
    path: ["confirmacao"],
  });