/**
 * Burbuja flotante del chatbot AI.
 *
 * Este componente muestra un botón flotante en la esquina inferior derecha
 * que al hacer clic abre/cierra el panel de chat.
 *
 * Decisiones de diseño:
 *  - Posición fija (fixed) para estar siempre visible
 *  - Animación de pulso para llamar la atención
 *  - Icono de cerebro/AI para reforzar la temática
 *  - Z-index alto para estar por encima de todo
 */

import { useState } from "preact/hooks";
import ChatPanel from "./ChatPanel";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Panel de chat (visible cuando isOpen = true) */}
      {isOpen && <ChatPanel onClose={() => { setIsOpen(false); }} />}

      {/* Burbuja flotante */}
      <button
        onClick={() => { setIsOpen(!isOpen); }}
        class={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-blue-600 to-cyan-500
          shadow-lg shadow-blue-600/30
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 hover:shadow-blue-500/50
          ${isOpen ? "rotate-0" : "animate-pulse"}
        `}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat AI"}
      >
        {isOpen ? (
          /* Icono X para cerrar */
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          /* Icono de chat/mensaje */
          <svg
            class="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"
            />
          </svg>
        )}
      </button>

      {/* Tooltip cuando está cerrado */}
      {!isOpen && (
        <div
          class="
            fixed bottom-7 right-24 z-50
            bg-black/90 text-white text-sm font-mono
            px-3 py-2 rounded-lg
            border border-blue-600/50
            opacity-0 hover:opacity-100
            pointer-events-none
            transition-opacity duration-300
          "
        >
          💬 Pregúntame sobre Adrian
        </div>
      )}
    </>
  );
}
