/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { gerarMensagemPositiva } from "./api/openai";
import { MdOutlinePlayCircleFilled } from "react-icons/md";
import { HiMiniPause } from "react-icons/hi2";

export default function App() {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [temporizador, setTemporizador] = useState(0);
  const [tocando, setTocando] = useState(false);
  const audioRef = useRef(null);

  const imagens = [
    "/imagens/foto1.jpg",
    "/imagens/foto2.jpg",
    "/imagens/foto4.jpg",
    "/imagens/foto6.jpg",
    "/imagens/foto7.jpg",
    "/imagens/foto8.jpg",
    "/imagens/foto9.jpg",
    "/imagens/foto10.jpg",
    "/imagens/foto11.jpg",
  ];

  function extrairUltimaMensagemEntreAspas(texto) {
    const regex = /"([^"]+)"/g;
    let resultado = null;
    let match;
    while ((match = regex.exec(texto)) !== null) {
      resultado = match[1];
    }
    return resultado || texto;
  }

  const gerar = async () => {
    if (temporizador > 0) return;
    setCarregando(true);
    try {
      const textoCompleto = await gerarMensagemPositiva();
      const fraseExtraida = extrairUltimaMensagemEntreAspas(textoCompleto);
      setMensagem(fraseExtraida);
      setTemporizador(15);
    } catch (error) {
      setMensagem("Ops! Algo deu errado, tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

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

  useEffect(() => {
    audioRef.current = new Audio("/music/mensagem-para-lais.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (tocando) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setTocando(!tocando);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <Motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 text-center select-none"
      >
        💖 Mensagens para Você Laís de seu namorado Jeremias O Nunes 💖
      </Motion.h1>
      <p className="mb-6 px-4 py-2 text-2xl  text-pink-600 font-semibold ">Essa musica me lembra você meu amor</p>
      <p className="mb-6 px-4 py-2 text-2xl  text-pink-600 font-semibold ">Aperte o play</p>
      {/* Botão de música */}
      <button
        onClick={togglePlay}
        className="mb-6 px-4 py-2 text-4xl  text-pink-600 font-semibold hover:text-pink-200 transition"
      >
        {tocando ? <HiMiniPause /> : <MdOutlinePlayCircleFilled />}
      </button>

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
        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center mt-6 sm:mt-10">
          <div className="w-full mb-4 rounded-2xl overflow-hidden">
            <Slider
              dots={true}
              infinite={true}
              speed={800}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={1000}
              pauseOnHover={true}
              arrows={false}
              className="shadow-none mb-4 rounded-2xl"
              responsive={[
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
              ]}
            >
              {imagens.map((src, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img
                    src={src}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-64 sm:h-80 object-cover rounded-xl"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <Motion.div
            key={mensagem}
            className="pt-8 w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center text-pink-700 text-base sm:text-lg font-medium select-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {mensagem}
          </Motion.div>
        </div>
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
