/**
 * Panel del chatbot AI.
 *
 * Asistente conversacional que explica:
 *  - Qué es este portfolio y cómo funciona
 *  - Todos los comandos disponibles (incluyendo easter eggs)
 *  - Info sobre Adrian: proyectos, experiencia, skills, contacto
 *
 * Diseño:
 *  - Estilo terminal para coherencia con el resto del portfolio
 *  - Pattern matching por keywords para respuestas predefinidas
 *  - Quick replies para guiar al usuario
 */

import { useState, useRef, useEffect } from "preact/hooks";
import { getResponse } from "./chatResponses";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `👋 ¡Hey! Soy el asistente de Adrian.

Esta web es un portfolio interactivo estilo terminal — puedes escribir comandos reales con el teclado.

Pregúntame sobre:
• Qué comandos hay disponibles
• Los proyectos de Adrian
• Su experiencia y skills
• Easter eggs ocultos 👀
• Cómo contactar con él

¿Qué quieres saber?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Intentional UX delay — no async work, simulates "thinking" for natural feel
    setTimeout(() => {
      const response = getResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div
      class="
        fixed bottom-24 right-6 z-50
        w-96 h-[520px]
        bg-[#0a0a0a]/95 backdrop-blur-sm
        border border-blue-600 rounded-lg
        shadow-2xl shadow-blue-600/20
        flex flex-col
        font-mono
      "
    >
      {/* Header */}
      <div class="flex items-center justify-between px-4 py-3 border-b border-blue-600/50 bg-black/50">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-blue-400 text-sm font-bold">AIR Assistant</span>
          <span class="text-gray-500 text-xs">// ask me anything</span>
        </div>
        <button onClick={onClose} class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} class="flex-1 overflow-y-auto p-4 space-y-4 terminal-scroll">
        {messages.map((msg, i) => (
          <div key={i} class={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              class={`
                max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200 border border-gray-700"
                }
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div class="flex justify-start">
            <div class="bg-gray-800 text-gray-400 px-3 py-2 rounded-lg text-sm border border-gray-700">
              <span class="animate-pulse">Procesando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} class="p-3 border-t border-blue-600/50 bg-black/50">
        <div class="flex space-x-2">
          <input
            type="text"
            value={input}
            onInput={(e) => {
              setInput((e.target as HTMLInputElement).value);
            }}
            placeholder="Pregunta sobre Adrian..."
            class="
              flex-1 bg-gray-900 border border-gray-700 rounded-lg
              px-3 py-2 text-sm text-white
              focus:outline-none focus:border-blue-500
              placeholder-gray-500
            "
          />
          <button
            type="submit"
            disabled={isLoading}
            class="
              bg-blue-600 hover:bg-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              px-4 py-2 rounded-lg
              text-white text-sm font-bold
              transition-colors
            "
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}
