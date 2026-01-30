/**
 * Barra superior de la terminal.
 *
 * Este componente replica la estética clásica de una ventana de terminal:
 *  - Botones estilo macOS (cerrar, minimizar, maximizar)
 *  - Título centrado con el prompt root@portfolio
 *  - Toggle de sonido de teclado
 *  - Versión de la terminal alineada a la derecha
 *
 * Responsabilidad:
 *  - Es puramente visual + toggle de sonido
 *  - No contiene lógica de negocio
 */

import { useKeySound } from "../../core/hooks/useKeySound";

export default function TerminalHeader() {
  const { soundEnabled, toggleSound } = useKeySound();

  return (
    <div class="bg-black border-b border-blue-600">
      <div class="grid grid-cols-3 items-center px-4 py-2">
        {/* COLUMNA IZQUIERDA — Botones estilo macOS (rojo-amarillo-verde) */}
        <div class="flex space-x-2" aria-hidden="true">
          <div class="w-3 h-3 rounded-full bg-[var(--macos-red)] shadow-[0_0_4px_var(--macos-red)]"></div>
          <div class="w-3 h-3 rounded-full bg-[var(--macos-yellow)] shadow-[0_0_4px_var(--macos-yellow)]"></div>
          <div class="w-3 h-3 rounded-full bg-[var(--macos-green)] shadow-[0_0_4px_var(--macos-green)]"></div>
        </div>

        {/* COLUMNA CENTRAL — Título de la terminal */}
        <div class="flex justify-center">
          <span class="text-[var(--accent)] font-mono text-sm">root@portfolio:~#</span>
        </div>

        {/* COLUMNA DERECHA — Toggle sonido + Versión */}
        <div class="flex justify-end items-center space-x-3">
          <button
            onClick={() => {
              toggleSound();
            }}
            class="text-xs font-mono transition-all duration-200 hover:text-[var(--white-soft)] focus-ring rounded px-1"
            style={{ color: soundEnabled ? "#3b82f6" : "#555" }}
            title={soundEnabled ? "Sonido: ON" : "Sonido: OFF"}
            aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
          >
            {soundEnabled ? "♪ ON" : "♪ OFF"}
          </button>
          <span class="text-gray-500 font-mono text-xs sm:text-sm hidden sm:inline">
            Terminal V2.0
          </span>
        </div>
      </div>
    </div>
  );
}
