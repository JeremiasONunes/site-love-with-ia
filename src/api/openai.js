import { InferenceClient } from "@huggingface/inference";

// Cria o cliente usando o token da variável de ambiente
const client = new InferenceClient(import.meta.env.VITE_HF_TOKEN);

export const gerarMensagemPositiva = async () => {
  try {
    const chatCompletion = await client.chatCompletion({
      provider: "auto", // provider certo para o modelo
      model: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
      messages: [
        {
          role: "user",
          content: "Escreva uma mensagem curta, doce e positiva para animar minha namorada. Seja fofa e gentil.",
        },
      ],
      // Você pode adicionar temperature, max_tokens etc aqui se quiser
    });

    // Retorna o conteúdo da primeira resposta
    return chatCompletion.choices[0].message.content || "Não consegui gerar a mensagem :(";
  } catch (erro) {
    console.error("Erro ao gerar mensagem com Hugging Face:", erro);
    return "Erro ao gerar mensagem 😢";
  }
};
