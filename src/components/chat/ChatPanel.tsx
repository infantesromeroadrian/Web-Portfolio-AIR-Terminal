/**
 * Panel del chatbot AI.
 *
 * Este componente muestra la interfaz de conversación con el chatbot.
 * Por ahora es un placeholder que se conectará con un backend LLM.
 *
 * Diseño:
 *  - Estilo terminal para coherencia con el resto del portfolio
 *  - Header con título y botón de cerrar
 *  - Área de mensajes con scroll
 *  - Input para escribir mensajes
 */

import { useState } from "preact/hooks";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy el asistente AI de Adrian. Puedo responder preguntas sobre su experiencia, proyectos y habilidades en AI Security. ¿En qué puedo ayudarte?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Respuestas predefinidas mientras no hay backend.
   * TODO: Conectar con API de LLM (OpenAI, Ollama, etc.)
   */
  const getResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("proyecto") || q.includes("project")) {
      return `Adrian tiene 4 proyectos principales de AI Security:

🎯 **WatchDogs OSINT** - Sistema multi-agente con GPT-4 Vision para análisis de video (Score: 95/100)

🛡️ **Threat Intelligence Aggregator** - Plataforma con NER, BERT y LDA para threat intel (35 endpoints)

🔍 **SIEM Anomaly Detector** - SIEM con ML ensemble (Isolation Forest + DBSCAN + GMM)

📧 **Email Threat Platform** - Detector dual SPAM + Phishing con 95% accuracy

¿Te interesa saber más sobre alguno en particular?`;
    }

    if (q.includes("experiencia") || q.includes("trabajo") || q.includes("bbva")) {
      return `Adrian trabaja actualmente en **BBVA** como AI Security Architect, donde:

• Diseña arquitecturas de seguridad para sistemas de IA
• Implementa detección de fraude con ML
• Desarrolla pipelines de MLOps seguros
• Realiza red teaming de modelos LLM

Anteriormente trabajó en Ecoembes y Capgemini en roles de Data Science y desarrollo.`;
    }

    if (q.includes("skill") || q.includes("tecnolog") || q.includes("stack")) {
      return `El stack principal de Adrian incluye:

**AI/ML**: PyTorch, TensorFlow, Scikit-learn, LangChain, LangGraph
**Security**: Adversarial ML, LLM Red Teaming, Threat Modeling
**Backend**: Python, FastAPI, Docker, Kubernetes
**MLOps**: MLflow, W&B, Dagster, vLLM

Especializado en la intersección de IA y Ciberseguridad.`;
    }

    if (q.includes("contacto") || q.includes("email") || q.includes("linkedin")) {
      return `Puedes contactar a Adrian a través de:

📧 Email: adrianinrom@proton.me
💼 LinkedIn: linkedin.com/in/inteligencia-artificial-adrian
🐙 GitHub: github.com/infantesromeroadrian

¡Está abierto a oportunidades en AI Security!`;
    }

    if (q.includes("estudi") || q.includes("formacion") || q.includes("master")) {
      return `Formación de Adrian:

🎓 **Máster en Generative AI** - MIOTI (2024-2025)
🎓 **Máster en Big Data** - MIOTI (2023-2024)
🎓 **Grado en Ingeniería del Software** - U-tad
📜 **ASIR** - Administración de Sistemas

Además tiene múltiples certificaciones en ML Engineering y AI.`;
    }

    return `Interesante pregunta. Puedo ayudarte con información sobre:

• **Proyectos** - Los 4 proyectos de AI Security de Adrian
• **Experiencia** - Su trabajo actual en BBVA
• **Skills** - Stack tecnológico y especialidades
• **Formación** - Estudios y certificaciones
• **Contacto** - Cómo contactar con Adrian

¿Sobre qué te gustaría saber más?`;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simular delay de respuesta
    setTimeout(() => {
      const response = getResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      class="
        fixed bottom-24 right-6 z-50
        w-96 h-[500px]
        bg-[#0a0a0a]/95 backdrop-blur-sm
        border border-violet-600 rounded-lg
        shadow-2xl shadow-violet-600/20
        flex flex-col
        font-mono
      "
    >
      {/* Header */}
      <div class="flex items-center justify-between px-4 py-3 border-b border-violet-600/50 bg-black/50">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-violet-400 text-sm font-bold">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          class="text-gray-400 hover:text-white transition-colors"
        >
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
      <div class="flex-1 overflow-y-auto p-4 space-y-4 terminal-scroll">
        {messages.map((msg, i) => (
          <div
            key={i}
            class={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              class={`
                max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white"
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
              <span class="animate-pulse">Pensando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} class="p-3 border-t border-violet-600/50 bg-black/50">
        <div class="flex space-x-2">
          <input
            type="text"
            value={input}
            onInput={(e) => { setInput((e.target as HTMLInputElement).value); }}
            placeholder="Escribe tu pregunta..."
            class="
              flex-1 bg-gray-900 border border-gray-700 rounded-lg
              px-3 py-2 text-sm text-white
              focus:outline-none focus:border-violet-500
              placeholder-gray-500
            "
          />
          <button
            type="submit"
            disabled={isLoading}
            class="
              bg-violet-600 hover:bg-violet-500
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
