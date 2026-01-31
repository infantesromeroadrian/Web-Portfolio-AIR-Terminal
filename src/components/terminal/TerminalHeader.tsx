/**
 * Barra superior de la terminal - Estilo premium.
 *
 * Este componente replica la estética de una ventana moderna:
 *  - Botones estilo macOS con hover effects
 *  - Título centrado con estilo coral
 *  - Toggle de sonido
 */

import { useKeySound } from "../../core/hooks/useKeySound";

export default function TerminalHeader() {
  const { soundEnabled, toggleSound } = useKeySound();

  return (
    <div class="bg-[var(--bg-elevated)]/50 border-b border-[var(--border-subtle)]">
      <div class="grid grid-cols-3 items-center px-4 py-3">
        {/* COLUMNA IZQUIERDA — Botones macOS */}
        <div class="flex space-x-2" aria-hidden="true">
          <div class="w-3 h-3 rounded-full bg-[var(--macos-red)] shadow-[0_0_6px_var(--macos-red)] hover:scale-110 transition-transform cursor-pointer"></div>
          <div class="w-3 h-3 rounded-full bg-[var(--macos-yellow)] shadow-[0_0_6px_var(--macos-yellow)] hover:scale-110 transition-transform cursor-pointer"></div>
          <div class="w-3 h-3 rounded-full bg-[var(--macos-green)] shadow-[0_0_6px_var(--macos-green)] hover:scale-110 transition-transform cursor-pointer"></div>
        </div>

        {/* COLUMNA CENTRAL — Título */}
        <div class="flex justify-center items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[var(--coral-bright)] animate-pulse"></span>
          <span class="text-[var(--text-secondary)] font-mono text-sm">
            air<span class="text-[var(--coral-bright)]">@</span>security
          </span>
        </div>

        {/* COLUMNA DERECHA — Toggle sonido + Versión */}
        <div class="flex justify-end items-center space-x-3">
          <button
            onClick={() => {
              toggleSound();
            }}
            class="text-xs font-mono transition-all duration-300 hover:text-[var(--coral-bright)] focus-ring rounded px-2 py-1"
            style={{ color: soundEnabled ? "var(--cyan-bright)" : "var(--text-muted)" }}
            title={soundEnabled ? "Sonido: ON" : "Sonido: OFF"}
            aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
          >
            {soundEnabled ? "♪ ON" : "♪ OFF"}
          </button>
          <span class="text-[var(--text-muted)] font-mono text-xs hidden sm:inline">v2.1</span>
        </div>
      </div>
    </div>
  );
}
