/**
 * Hook para efecto de sonido de teclado mecánico.
 *
 * Genera un click suave usando Web Audio API — sin dependencias externas.
 * Incluye toggle on/off con persistencia en localStorage.
 *
 * Diseño:
 *  - Estado compartido via módulo singleton (no Context)
 *  - Todos los consumidores se sincronizan via custom event "sound-toggle"
 *  - Sonido corto (~50ms) tipo tecla mecánica
 *  - Variación aleatoria sutil en pitch para naturalidad
 *  - AudioContext se inicializa en primer click (restricción del navegador)
 */
import { useState, useEffect, useCallback } from "preact/hooks";

const STORAGE_KEY = "terminal-sound-enabled";
const SYNC_EVENT = "sound-toggle";

/**
 * Lee el valor inicial de localStorage.
 * Default: true (sonido activado).
 */
function readEnabled(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

/**
 * AudioContext singleton (lazy init por restricción de navegadores).
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  audioCtx ??= new AudioContext();
  return audioCtx;
}

export function useKeySound() {
  const [enabled, setEnabled] = useState<boolean>(readEnabled);

  /**
   * Escucha custom events disparados por OTROS componentes
   * que llaman toggleSound(). Esto sincroniza el estado
   * entre TerminalHeader y TerminalBody sin Context.
   */
  useEffect(() => {
    function handleSync() {
      setEnabled(readEnabled());
    }

    window.addEventListener(SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
    };
  }, []);

  /**
   * Reproduce un click corto estilo tecla mecánica.
   *
   * Usa un oscillador de onda cuadrada con decay rápido
   * y variación de pitch para evitar monotonía.
   */
  const playClick = useCallback(() => {
    // Leer directo de localStorage para evitar stale closures
    if (localStorage.getItem(STORAGE_KEY) === "false") return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Frecuencia base con variación aleatoria (±200Hz)
      const baseFreq = 3500 + (Math.random() - 0.5) * 400;
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      oscillator.type = "square";

      // Volumen: ataque instantáneo, decay rápido
      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch {
      // Silenciar errores de audio (ej: AudioContext no disponible)
    }
  }, []);

  /**
   * Toggle on/off con persistencia + notificación a otros consumidores.
   */
  function toggleSound(): void {
    const newValue = !readEnabled();
    localStorage.setItem(STORAGE_KEY, String(newValue));
    setEnabled(newValue);

    // Notificar a otros componentes en la misma página
    window.dispatchEvent(new Event(SYNC_EVENT));
  }

  return {
    soundEnabled: enabled,
    playClick,
    toggleSound,
  };
}
