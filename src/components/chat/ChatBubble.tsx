/**
 * Burbuja flotante del chatbot AI.
 *
 * Este componente muestra un botón flotante en la esquina inferior derecha
 * que al hacer clic abre/cierra el panel de chat.
 *
 * Decisiones de diseño:
 *  - Posición fija (fixed) para estar siempre visible
 *  - Animación de pulso para llamar la atención
 *  - Mensaje proactivo después de inactividad
 *  - Z-index alto para estar por encima de todo
 */

import { useState, useEffect } from "preact/hooks";
import ChatPanel from "./ChatPanel";

const PROACTIVE_DELAY_MS = 15000; // 15 segundos de inactividad
const PROACTIVE_STORAGE_KEY = "chat-proactive-shown";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProactiveHint, setShowProactiveHint] = useState(false);

  /**
   * Mensaje proactivo — aparece después de X segundos si el usuario
   * no ha interactuado con el chat (solo una vez por sesión).
   */
  useEffect(() => {
    // No mostrar si ya se mostró en esta sesión
    if (sessionStorage.getItem(PROACTIVE_STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowProactiveHint(true);
        sessionStorage.setItem(PROACTIVE_STORAGE_KEY, "true");
      }
    }, PROACTIVE_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Ocultar hint proactivo cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      setShowProactiveHint(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Panel de chat (visible cuando isOpen = true) */}
      {isOpen && (
        <ChatPanel
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}

      {/* Burbuja flotante + tooltip — más arriba en móvil para no tapar bottom bar */}
      <div class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 group">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          class={`
            w-12 h-12 sm:w-14 sm:h-14 rounded-full
            bg-gradient-to-br from-blue-600 to-cyan-500
            shadow-lg shadow-blue-600/40
            flex items-center justify-center
            transition-all duration-300 ease-out
            hover:scale-110 hover:shadow-blue-500/60 hover:shadow-xl
            focus-ring
            ${isOpen ? "rotate-0 scale-100" : "animate-pulse"}
          `}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat AI"}
        >
          {isOpen ? (
            /* Icono X para cerrar */
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-200"
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
              class="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-200"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
            </svg>
          )}
        </button>

        {/* Mensaje proactivo — aparece después de inactividad */}
        {showProactiveHint && !isOpen && (
          <div
            class="
              absolute bottom-16 right-0
              bg-blue-600 text-white text-xs sm:text-sm font-mono
              px-3 py-2 rounded-lg whitespace-nowrap
              shadow-lg shadow-blue-600/40
              animate-slide-up
              cursor-pointer
            "
            onClick={() => {
              setIsOpen(true);
              setShowProactiveHint(false);
            }}
          >
            <div class="flex items-center gap-2">
              <span>💬</span>
              <span>¿Necesitas ayuda?</span>
            </div>
            <div class="text-[10px] text-blue-200 mt-0.5">Click para chatear</div>
          </div>
        )}

        {/* Tooltip — visible al hacer hover en el grupo, oculto en mobile */}
        {!isOpen && !showProactiveHint && (
          <div
            class="
              absolute bottom-2 right-[60px] sm:right-[72px]
              bg-black/95 text-white text-xs sm:text-sm font-mono
              px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap
              border border-blue-600/50
              opacity-0 group-hover:opacity-100
              transition-all duration-300
              pointer-events-none
              hidden sm:block
              shadow-lg
            "
          >
            💬 Pregúntame sobre Adrian
          </div>
        )}
      </div>
    </>
  );
}
