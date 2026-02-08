/**
 * Hook para detectar el Konami Code.
 *
 * Secuencia: ↑ ↑ ↓ ↓ ← → ← → B A
 *
 * Cuando se completa, ejecuta el callback proporcionado.
 */

import { useEffect, useRef, useCallback } from "preact/hooks";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function useKonamiCode(onActivate: () => void): void {
  const inputSequence = useRef<string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const resetSequence = useCallback(() => {
    inputSequence.current = [];
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar si está escribiendo en un input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Añadir tecla a la secuencia
      inputSequence.current.push(event.code);

      // Mantener solo las últimas N teclas (longitud del código)
      if (inputSequence.current.length > KONAMI_SEQUENCE.length) {
        inputSequence.current.shift();
      }

      // Verificar si coincide
      const isMatch = inputSequence.current.every((key, index) => key === KONAMI_SEQUENCE[index]);

      if (isMatch && inputSequence.current.length === KONAMI_SEQUENCE.length) {
        // ¡Konami code activado!
        onActivate();
        resetSequence();
      }

      // Reset después de 2 segundos de inactividad
      timeoutRef.current = window.setTimeout(resetSequence, 2000);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onActivate, resetSequence]);
}
