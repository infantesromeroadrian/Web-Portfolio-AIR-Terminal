/**
 * Contexto global para el modo L4tentNoise (identidad secreta).
 *
 * Cuando se activa (via Konami code), cambia:
 *  - Tema visual (rojo/negro agresivo)
 *  - Respuestas de comandos
 *  - Identidad mostrada
 */

import { createContext } from "preact";
import { useContext, useState, useCallback, useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";

interface L4tentNoiseContextType {
  isL4tentMode: boolean;
  toggleL4tent: () => void;
  activateL4tent: () => void;
  deactivateL4tent: () => void;
}

const L4tentNoiseContext = createContext<L4tentNoiseContextType | null>(null);

/**
 * Provider que envuelve la app y gestiona el estado del modo L4tentNoise.
 */
export function L4tentNoiseProvider({ children }: { children: ComponentChildren }) {
  const [isL4tentMode, setIsL4tentMode] = useState(false);

  const toggleL4tent = useCallback(() => {
    setIsL4tentMode((prev) => !prev);
  }, []);

  const activateL4tent = useCallback(() => {
    setIsL4tentMode(true);
  }, []);

  const deactivateL4tent = useCallback(() => {
    setIsL4tentMode(false);
  }, []);

  // Aplicar clase al body para cambiar el tema
  useEffect(() => {
    if (isL4tentMode) {
      document.body.classList.add("l4tent-mode");
      // Efecto de transición: flash rojo
      document.body.style.animation = "l4tent-activate 0.5s ease-out";
      setTimeout(() => {
        document.body.style.animation = "";
      }, 500);
    } else {
      document.body.classList.remove("l4tent-mode");
    }
  }, [isL4tentMode]);

  return (
    <L4tentNoiseContext.Provider
      value={{ isL4tentMode, toggleL4tent, activateL4tent, deactivateL4tent }}
    >
      {children}
    </L4tentNoiseContext.Provider>
  );
}

/**
 * Hook para acceder al contexto L4tentNoise.
 */
export function useL4tentNoise(): L4tentNoiseContextType {
  const context = useContext(L4tentNoiseContext);
  if (!context) {
    throw new Error("useL4tentNoise must be used within L4tentNoiseProvider");
  }
  return context;
}
