export function traduzirErroAuth(error, contexto) {
  switch (error.code) {
    case "invalid_credentials":
      return { campo: null, mensagem: "E-mail ou senha incorretos." };

    case "email_not_confirmed":
      return { campo: null, mensagem: "Confirme seu e-mail antes de entrar." };

    case "user_already_exists":
    case "email_exists":
      return { campo: "email", mensagem: "Este e-mail já está cadastrado." };

    case "weak_password":
      return { campo: "senha", mensagem: "Senha muito fraca. Escolha outra." };

    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return {
        campo: null,
        mensagem: "Muitas tentativas. Aguarde um pouco e tente novamente.",
      };

    default:
      console.error(`Erro de ${contexto}:`, error);
      return {
        campo: null,
        mensagem: "Ocorreu um erro inesperado. Tente novamente.",
      };
  }
}

export function traduzirErroBanco(error) {
  switch (error.code) {
    case "23514": 
      return "Algum dado não atende às regras do banco (verifique o tamanho do nome).";
    case "42501": 
      return "Você não tem permissão para realizar esta operação.";
    default:
      console.error("Erro do banco:", error);
      return "Não foi possível salvar o registro. Tente novamente.";
  }
}