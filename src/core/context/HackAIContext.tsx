/**
 * Contexto global para el modo HackAI (identidad secreta).
 *
 * Cuando se activa (via Konami code), cambia:
 *  - Tema visual (rojo/negro agresivo)
 *  - Respuestas de comandos
 *  - Identidad mostrada
 */

import { createContext } from "preact";
import { useContext, useState, useCallback, useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";

interface HackAIContextType {
  isHackAIMode: boolean;
  toggleHackAI: () => void;
  activateHackAI: () => void;
  deactivateHackAI: () => void;
}

const HackAIContext = createContext<HackAIContextType | null>(null);

/**
 * Provider que envuelve la app y gestiona el estado del modo HackAI.
 */
export function HackAIProvider({ children }: { children: ComponentChildren }) {
  const [isHackAIMode, setIsHackAIMode] = useState(false);

  const toggleHackAI = useCallback(() => {
    setIsHackAIMode((prev) => !prev);
  }, []);

  const activateHackAI = useCallback(() => {
    setIsHackAIMode(true);
  }, []);

  const deactivateHackAI = useCallback(() => {
    setIsHackAIMode(false);
  }, []);

  // Aplicar clase al body para cambiar el tema
  useEffect(() => {
    if (isHackAIMode) {
      document.body.classList.add("hackai-mode");
      // Efecto de transición: flash rojo
      document.body.style.animation = "hackai-activate 0.5s ease-out";
      setTimeout(() => {
        document.body.style.animation = "";
      }, 500);
    } else {
      document.body.classList.remove("hackai-mode");
    }
  }, [isHackAIMode]);

  return (
    <HackAIContext.Provider
      value={{ isHackAIMode, toggleHackAI, activateHackAI, deactivateHackAI }}
    >
      {children}
    </HackAIContext.Provider>
  );
}

/**
 * Hook para acceder al contexto HackAI.
 */
export function useHackAI(): HackAIContextType {
  const context = useContext(HackAIContext);
  if (!context) {
    throw new Error("useHackAI must be used within HackAIProvider");
  }
  return context;
}
