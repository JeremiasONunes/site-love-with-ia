import { useState, useEffect } from "react";
import { gerarMensagemPositiva } from "./api/openai";
import { motion as Motion } from "framer-motion";

export default function App() {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [temporizador, setTemporizador] = useState(0);

  // Função para extrair a última string entre aspas
  function extrairUltimaMensagemEntreAspas(texto) {
    const regex = /"([^"]+)"/g;
    let resultado = null;
    let match;

    while ((match = regex.exec(texto)) !== null) {
      resultado = match[1]; // atualiza para a última ocorrência
    }

    return resultado || texto;
  }

  // Função para gerar mensagem
  const gerar = async () => {
    if (temporizador > 0) return;

    setCarregando(true);
    try {
      const textoCompleto = await gerarMensagemPositiva();
      const fraseExtraida = extrairUltimaMensagemEntreAspas(textoCompleto);
      setMensagem(fraseExtraida);
      setTemporizador(15); // inicia cooldown
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMensagem("Ops! Algo deu errado, tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Contador regressivo do temporizador
  useEffect(() => {
    if (temporizador === 0) return;
    const interval = setInterval(() => {
      setTemporizador((prev) => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [temporizador]);

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <Motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-pink-600 mb-6 sm:mb-8 text-center select-none"
      >
        💖 Mensagens para Você Laís de seu namorado Jeremias O Nunes 💖
      </Motion.h1>

      <button
        onClick={gerar}
        disabled={carregando || temporizador > 0}
        className={`bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-lg transition 
          ${carregando || temporizador > 0
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer"
          }`}
      >
        {carregando
          ? "Gerando..."
          : temporizador > 0
            ? `Aguarde ${temporizador}s`
            : "Gerar Mensagem Fofa"}
      </button>

      {mensagem && (
        <Motion.div
          key={mensagem}
          className="mt-6 sm:mt-10 w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center text-pink-700 text-base sm:text-lg font-medium select-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {mensagem}
        </Motion.div>
      )}
      <Motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-10 max-w-md text-center text-pink-800 text-sm sm:text-base font-normal italic"
      >
        Laís, você é a razão do meu sorriso diário, a luz que dá sentido à minha caminhada.
        Ter você ao meu lado é a maior alegria que a vida me deu. 💗<br />
        Como desenvolvedor e, principalmente, como seu namorado, eu não poderia deixar de criar uma página só pra você.
        Essa é a minha forma de dizer: <strong>você é tudo pra mim</strong>. ✨
      </Motion.p>
    </div>
  );
}
