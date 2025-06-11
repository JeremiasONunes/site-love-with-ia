import { useState } from "react";
import { gerarMensagemPositiva } from "./api/openai";
import { motion as Motion } from "framer-motion";

export default function App() {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  function extrairUltimaMensagemEntreAspas(texto) {
  const regex = /"([^"]+)"/g;
  let resultado = null;
  let match;

  while ((match = regex.exec(texto)) !== null) {
    resultado = match[1]; // vai atualizando para a última ocorrência
  }

  return resultado || texto; // se não encontrar aspas, retorna o texto inteiro
}
  const gerar = async () => {
  setCarregando(true);
  try {
    const textoCompleto = await gerarMensagemPositiva();
    const fraseExtraida = extrairUltimaMensagemEntreAspas(textoCompleto);
    setMensagem(fraseExtraida);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    setMensagem("Ops! Algo deu errado, tente novamente.");
  } finally {
    setCarregando(false);
  }
};


  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-6">
      <Motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-pink-600 mb-8 select-none"
      >
        💖 Mensagens para Você 💖
      </Motion.h1>

      <button
        onClick={gerar}
        disabled={carregando}
        className={`bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition 
          ${carregando ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        {carregando ? "Gerando..." : "Gerar Mensagem Fofa"}
      </button>

      {mensagem && (
        <Motion.div
          key={mensagem} // para animação funcionar ao trocar mensagem
          className="mt-10 max-w-md bg-white rounded-xl shadow-lg p-6 text-center text-pink-700 text-lg font-medium select-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {mensagem}
        </Motion.div>
      )}
    </div>
  );
}
