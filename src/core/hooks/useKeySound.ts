/**
 * Hook para efecto de sonido de teclado mecánico.
 *
 * Genera un click suave usando Web Audio API — sin dependencias externas.
 * Incluye toggle on/off con persistencia en localStorage.
 *
 * Diseño:
 *  - Sonido corto (~50ms) tipo tecla mecánica
 *  - Variación aleatoria sutil en pitch para naturalidad
 *  - AudioContext se inicializa en primer click (restricción del navegador)
 */
import { useState, useRef, useCallback } from "preact/hooks";

const STORAGE_KEY = "terminal-sound-enabled";

export function useKeySound() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  /**
   * Inicializa el AudioContext (lazy, por restricción de navegadores).
   */
  function getAudioContext(): AudioContext {
    audioCtxRef.current ??= new AudioContext();
    return audioCtxRef.current;
  }

  /**
   * Reproduce un click corto estilo tecla mecánica.
   *
   * Usa un oscillador de onda cuadrada con decay rápido
   * y variación de pitch para evitar monotonía.
   */
  const playClick = useCallback(() => {
    if (!enabled) return;

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
  }, [enabled]);

  /**
   * Toggle on/off con persistencia.
   */
  function toggleSound(): void {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
  }

  return {
    soundEnabled: enabled,
    playClick,
    toggleSound,
  };
}
