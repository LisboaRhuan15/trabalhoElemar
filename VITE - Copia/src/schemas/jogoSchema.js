import { z } from "zod";

const anoMaximo = new Date().getFullYear() + 1;

export const jogoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  genero: z.string().trim().min(1, "Informe o gênero."),
  ano_lancamento: z
    .string()
    .min(1, "Informe o ano de lançamento.")
    .refine((v) => /^\d{4}$/.test(v), "Informe um ano com 4 dígitos.")
    .refine(
      (v) => Number(v) >= 1950 && Number(v) <= anoMaximo,
      `O ano deve estar entre 1950 e ${anoMaximo}.`
    ),
  preco: z
    .string()
    .min(1, "Informe o preço.")
    .refine(
      (v) => !Number.isNaN(Number(v.replace(",", "."))),
      "Informe um preço válido."
    )
    .refine(
      (v) => Number(v.replace(",", ".")) >= 0,
      "O preço não pode ser negativo."
    ),
  plataforma: z.string().trim().min(1, "Informe a plataforma."),
});